-- Create lock_user_mapping (if you don't already have it)
CREATE TABLE IF NOT EXISTS lock_user_mapping (
  lock_id TEXT PRIMARY KEY,
  user_id TEXT,
  fcm_id TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- Analytics tables
CREATE TABLE IF NOT EXISTS notification_campaigns (
  campaign_id UUID PRIMARY KEY,
  campaign_name TEXT,
  run_date TIMESTAMP NOT NULL,
  message_text TEXT,
  message_title TEXT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS notification_recipients (
  id UUID PRIMARY KEY,
  campaign_id UUID REFERENCES notification_campaigns(campaign_id),
  notification_id TEXT NOT NULL,
  lock_id TEXT,
  user_id TEXT,
  fcm_id TEXT,
  sent_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS notification_clicks (
  id UUID PRIMARY KEY,
  notification_id TEXT NOT NULL,
  lock_id TEXT,
  user_id TEXT,
  clicked_at TIMESTAMP DEFAULT now(),
  user_agent TEXT,
  ip TEXT
);
