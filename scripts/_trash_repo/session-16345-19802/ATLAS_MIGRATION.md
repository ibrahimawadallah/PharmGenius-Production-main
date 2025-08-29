# MongoDB Atlas Migration Guide

## 1. Create Atlas Account
- Go to https://cloud.mongodb.com
- Sign up for free account
- Create new project

## 2. Create Cluster
- Click "Build a Database"
- Choose M0 (Free tier)
- Select region closest to you
- Name cluster (e.g., "pharmgenius-cluster")

## 3. Create Database User
- Go to Database Access
- Add new user with username/password
- Give "Read and write to any database" permission

## 4. Configure Network Access
- Go to Network Access
- Add IP Address: 0.0.0.0/0 (allow from anywhere)
- Or add your specific IP

## 5. Get Connection String
- Go to Database → Connect
- Choose "Connect your application"
- Copy connection string
- Replace `<password>` with your user password

## 6. Update .env File
```env
MONGODB_URI=mongodb+srv://yourusername:yourpassword@pharmgenius-cluster.xxxxx.mongodb.net/pharmgenius?retryWrites=true&w=majority
```

## 7. Run Migration
```bash
npm run migrate:atlas
```

## 8. Test Connection
```bash
npm start
```

Should show: "MongoDB initialized successfully"

## Troubleshooting
- Check username/password in connection string
- Verify network access allows your IP
- Ensure cluster is not paused (Atlas auto-pauses free tier)