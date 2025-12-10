require('dotenv').config();
const express = require('express');
const { Client } = require('pg');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;
const pg = new Client({ connectionString: process.env.PG_CONNECTION_STRING });

(async () => {
  await pg.connect();
})();

app.get('/track_click', async (req, res) => {
  const { nid, uid, lid } = req.query;

  if (!nid) return res.status(400).send('Missing nid');

  const userAgent = req.get('User-Agent');
  const ip =
    req.ip ||
    req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress;

  try {
    await pg.query(
      'INSERT INTO notification_clicks(id,notification_id,lock_id,user_id,clicked_at,user_agent,ip) VALUES($1,$2,$3,$4,$5,$6,$7)',
      [
        uuidv4(),
        nid,
        lid || null,
        uid || null,
        new Date(),
        userAgent,
        ip
      ]
    );
  } catch (err) {
    console.error('Click insert failed =>', err.message || err);
  }

  const appDeepLink = `myapp://lock/${encodeURIComponent(lid || '')}`;
  const webFallback = `https://your-frontend.example.com/locks/${encodeURIComponent(lid || '')}`;

  res.send(`
    <!doctype html>
    <html>
      <head>
        <meta http-equiv="refresh" content="0;url=${appDeepLink}" />
        <script>
          setTimeout(() => {
            window.location = '${webFallback}';
          }, 500);
        </script>
      </head>
      <body>Redirecting...</body>
    </html>
  `);
});

app.listen(PORT, () => console.log(`Tracker listening on port ${PORT}`));
