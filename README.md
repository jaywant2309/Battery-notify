# 🔐 Battery Notify System  
### Automated Weekly Lock Battery Check Notifications  
### *(Node.js + DynamoDB + PostgreSQL + Firebase Cloud Messaging)*

This project automates weekly reminders for users who have **not checked their smart lock's battery level in over 30 days**.  
It integrates **DynamoDB**, **PostgreSQL**, **Firebase Cloud Messaging (FCM)**, and a **click-tracking microservice** to measure user engagement.

Designed for:
- IoT Smart Lock Platforms  
- Home Automation Systems  
- Predictive Maintenance Workflows  
- Notification Campaign Analytics  

---

# ⭐ Features

### ✔ Automated Weekly Battery Reminder Notifications  
- Scans DynamoDB for locks with old battery timestamps.  
- Fetches mapped users from PostgreSQL.  
- Sends personalized FCM notifications.

### ✔ Firebase Push Notifications  
Each notification includes:  
- Title & message  
- Deep link & web fallback  
- Tracking parameters (lock_id, user_id, notification_id)

### ✔ Click Tracking Server (Express)  
Tracks:
- Notification clicks  
- User engagement  
- Device + browser metadata  

### ✔ Campaign Analytics  
- Total notifications delivered  
- Unique user clicks  
- Click-Through Rate (CTR)  
- Lock-specific behavior insights  

### ✔ Easy Deployment  
Runs on:
- Docker  
- Local cron  
- AWS Lambda + EventBridge  
- GitHub Actions  

---

# 🧱 System Architecture

## 🧱 System Architecture

```mermaid
flowchart TD
  A["DynamoDB locks table"] --> B["Scan stale locks (30+ days)"]
  B --> C["PostgreSQL lock_user_mapping"]
  C --> D["Notification Sender (Node.js + FCM)"]
  D --> E["User receives push notification"]
  E --> F["Click Tracking Server (Express API)"]
  F --> G["PostgreSQL Analytics Tables"]


# 📂 Project Structure

```
battery-notify/
│
├── src/
│   ├── scan_and_map.js                 # Collect stale locks & user mappings
│   ├── scan_and_map_helper.js          # Helper logic for DynamoDB + PostgreSQL
│   └── send_battery_notifications.js   # FCM notification workflow
│
├── tracker/
│   └── index.js                        # Notification click tracker API
│
├── sql/
│   └── schema.sql                      # PostgreSQL schema for analytics
│
├── docker-compose.yml                  # Local Postgres + DynamoDB setup
├── package.json
├── .env.example
├── README.md
└── create_project.sh
```

---

# ⚙️ Requirements

You must have:

- Node.js **v16+**  
- Docker + Docker Compose  
- Firebase Service Account JSON  
- PostgreSQL client (GUI or CLI)

---

# 🛠 Installation & Setup

### **1. Install dependencies**
```bash
npm install
```

### **2. Start local databases**
```bash
docker-compose up -d
```

### **3. Create PostgreSQL schema**
```bash
psql -U test -d battery -f sql/schema.sql
```

### **4. Create environment file**
```bash
cp .env.example .env
```

Fill in:
- PostgreSQL connection  
- DynamoDB endpoint  
- FCM service account path  
- Tracking server URL  

### **5. Start click tracking server**
```bash
npm run tracker
```

### **6. Test scan**
```bash
npm run scan
```

### **7. Run notification job**
```bash
npm start
```

---

# 📡 Firebase Configuration

### Steps:

1. Go to **Firebase Console**  
2. Navigate → Project Settings  
3. Create a **Service Account**  
4. Download JSON  
5. Set environment variable:

```bash
export GOOGLE_APPLICATION_CREDENTIALS="/path/service-account.json"
```

---

# 📊 Analytics & Reporting

This project automatically logs:

### ✔ Campaigns  
### ✔ Notifications sent  
### ✔ Clicks tracked  
### ✔ User + lock interaction patterns  

### Example — CTR Query

```sql
SELECT 
  (SELECT COUNT(*) FROM notification_clicks)::float /
  (SELECT COUNT(*) FROM notification_recipients) 
  AS ctr;
```

---

# 🧪 Testing With Ngrok (Optional)

Expose tracking server publicly:

```bash
ngrok http 3000
```

Use as:

```
TRACKING_BASE_URL=https://<ngrok-id>.ngrok.io/track_click
```

---

# 🚀 Deployment Options

### **1. AWS Lambda + EventBridge**
- Best for auto-run weekly jobs  
- Fully serverless  
- Highly scalable  

### **2. Cron Job (Linux / EC2 / VPS)**
Simple example:

```bash
0 9 * * 1 cd /app/battery-notify && npm start
```

### **3. GitHub Actions**
Weekly automation:

```yaml
schedule:
  - cron: "0 9 * * 1"
```

### **4. Render / Railway / Heroku**
Run click-tracking server easily.

---

# ✨ Future Enhancements

- Retry queue (Redis + BullMQ)  
- Dashboards for analytics  
- Multi-language notifications  
- Sentry error logging  
- Mobile deep-link testing tool  

---

# 👨‍💻 Author

**Name:** Jaywant Avhad  
**Role:** Backend Developer / Software Engineer  
**GitHub:** https://github.com/jaywant2309 
**LinkedIn:** https://www.linkedin.com/in/jaywant-avhad/

---


