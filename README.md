# 🔐 Battery Notify System  
### Automated Weekly Lock Battery Check Notifications  
### *(Node.js + DynamoDB + PostgreSQL + Firebase Cloud Messaging)*

This project is built to automatically remind users to check the battery level of their smart locks.  
The idea is simple: if a lock has not reported a battery check for more than 30 days, the system sends a notification to all users linked to that lock.  
To support this workflow, the system uses DynamoDB, PostgreSQL, Firebase Cloud Messaging (FCM), and a small click-tracking service.
---

# Battery-notify (Node.js)

Quick start

1. Copy files into a repo.
2. Create `.env` from `.env.example` and fill values (PG connection, firebase credentials path, TRACKING_BASE_URL).
3. Start local DBs: `docker-compose up -d`.
4. Install deps: `npm install`.
5. Create DB schema: `psql -U test -d battery -f sql/schema.sql` (or run with your DB client).
6. Start tracker: `npm run tracker`.
7. Run the send script (test): `npm run start`.

Use `scan` script to just print stale locks & mappings during development: `npm run scan`.

# ⭐ Features

### ✔ Automated Weekly Battery Reminder Notifications  
The project includes a script that scans stale locks and notifies users automatically.
- Scans DynamoDB for locks with old battery timestamps.  
- Fetches mapped users from PostgreSQL.  
- Sends personalized FCM notifications.

### ✔ Firebase Push Notifications  
Notifications include a title, a short message, and a link for tracking user clicks.  
- Deep link & web fallback  
- Tracking parameters (lock_id, user_id, notification_id)

### ✔ Click Tracking Server (Express)  
This small Express server logs user activity when they click a notification, which helps evaluate engagement.
- User engagement  
- Device + browser metadata  

### ✔ Campaign Analytics  
Data about notification sends and clicks is recorded to calculate metrics such as CTR (Click-Through Rate).
- Total notifications delivered  
- Unique user clicks  
- Lock-specific behavior insights  

---


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

---


# 👨‍💻 Author

**Name:** Jaywant Avhad  
**Role:** Backend Developer / Software Engineer  
**GitHub:** https://github.com/jaywant2309 
**LinkedIn:** https://www.linkedin.com/in/jaywant-avhad/

---


This project was developed as part of an assignment based on backend automation, notification systems, and tracking workflows.
