require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const admin = require('firebase-admin');
const { Client } = require('pg');
const pLimit = require('p-limit');
const scanAndMap = require('./scan_and_map_helper');

// Initialize Firebase Admin using GOOGLE_APPLICATION_CREDENTIALS
if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.applicationDefault() });
}

const PG_CONN = process.env.PG_CONNECTION_STRING;
const TRACKING_BASE = process.env.TRACKING_BASE_URL;

async function sendToToken(token, payload) {
  const message = {
    token,
    notification: { title: payload.title, body: payload.body },
    data: payload.data,
    android: { notification: { click_action: payload.click_action } },
    apns: { fcm_options: { link: payload.click_action } }
  };
  return admin.messaging().send(message);
}

async function main(){
  const pg = new Client({ connectionString: PG_CONN });
  await pg.connect();

  const { locks, mappings } = await scanAndMap.getLocksAndMappings();
  if (!mappings.length) return console.log('No mappings to send');

  // create campaign
  const campaignId = uuidv4();
  await pg.query(
    'INSERT INTO notification_campaigns(campaign_id,campaign_name,run_date,message_text,message_title) VALUES($1,$2,$3,$4,$5)',
    [campaignId, process.env.CAMPAIGN_NAME || 'weekly_battery_check', new Date(), 'It\'s been over a month since your lock battery was checked.', 'Check your lock battery']
  );

  const limit = pLimit(10);
  const jobs = mappings.map(row => limit(async () => {
    const notificationId = uuidv4();
    const trackingUrl = `${TRACKING_BASE}?nid=${encodeURIComponent(notificationId)}&uid=${encodeURIComponent(row.user_id)}&lid=${encodeURIComponent(row.lock_id)}`;
    const payload = { title: 'Check your lock battery', body: 'Tap to view instructions and check battery', data: { notification_id: notificationId, lock_id: row.lock_id }, click_action: trackingUrl };

    try {
      await sendToToken(row.fcm_id, payload);
      await pg.query('INSERT INTO notification_recipients(id,campaign_id,notification_id,lock_id,user_id,fcm_id,sent_at) VALUES($1,$2,$3,$4,$5,$6,$7)',
        [uuidv4(), campaignId, notificationId, row.lock_id, row.user_id, row.fcm_id, new Date()]);
      return { ok: true };
    } catch (err) {
      console.error('Send error', err && err.message);
      return { ok: false, err };
    }
  }));

  const results = await Promise.all(jobs);
  const success = results.filter(r => r.ok).length;
  console.log(`Sends complete: ${success}/${results.length}`);
  await pg.end();
}

main().catch(err => { console.error(err); process.exit(1); });
