require('dotenv').config();
const { DynamoDBClient, ScanCommand } = require('@aws-sdk/client-dynamodb');
const { unmarshall } = require('@aws-sdk/util-dynamodb');
const { Client } = require('pg');

const DYNAMO_ENDPOINT = process.env.DYNAMO_ENDPOINT;
const DYNAMO_TABLE = process.env.DYNAMO_TABLE_LOCKS || 'locks';
const PG_CONN = process.env.PG_CONNECTION_STRING;

async function getStaleLocks(cutoffEpochMillis) {
  const ddb = new DynamoDBClient({ endpoint: DYNAMO_ENDPOINT, region: process.env.AWS_REGION });
  const results = [];
  let ExclusiveStartKey;
  do {
    const cmd = new ScanCommand({ TableName: DYNAMO_TABLE, ProjectionExpression: 'lock_id, last_battery_check_ts', ExclusiveStartKey });
    const res = await ddb.send(cmd);
    (res.Items || []).forEach(it => {
      const obj = unmarshall(it);
      const ts = typeof obj.last_battery_check_ts === 'string' ? Date.parse(obj.last_battery_check_ts) : obj.last_battery_check_ts;
      if (ts && ts < cutoffEpochMillis) results.push({ lock_id: obj.lock_id, last_battery_check_ts: ts });
    });
    ExclusiveStartKey = res.LastEvaluatedKey;
  } while (ExclusiveStartKey);
  return results;
}

async function getMappingsForLocks(lockIds) {
  const pg = new Client({ connectionString: PG_CONN });
  await pg.connect();
  if (!lockIds.length) return [];
  const placeholders = lockIds.map((_, i) => `$${i+1}`).join(',');
  const q = `SELECT lock_id, user_id, fcm_id FROM lock_user_mapping WHERE lock_id IN (${placeholders})`;
  const res = await pg.query(q, lockIds);
  await pg.end();
  return res.rows;
}

async function getLocksAndMappings(){
  const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const locks = await getStaleLocks(cutoff);
  const lockIds = locks.map(l => l.lock_id);
  const mappings = await getMappingsForLocks(lockIds);
  return { locks, mappings };
}

module.exports = { getLocksAndMappings };
