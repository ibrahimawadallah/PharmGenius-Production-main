# 🗄️ MongoDB Setup Guide for PharmGenius

This guide will help you set up MongoDB for PharmGenius production deployment.

---

## 🎯 **Quick Setup Options**

### **Option 1: MongoDB Atlas (Cloud) - RECOMMENDED** ⭐

**Best for:** Production deployment, automatic backups, scaling

#### **Step 1: Create MongoDB Atlas Account**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free account
3. Create a new cluster (M0 Sandbox is free)

#### **Step 2: Configure Database**
1. **Database Name**: `pharmgenius`
2. **Collections**: Will be created automatically
3. **Region**: Choose closest to UAE (Europe/Middle East)

#### **Step 3: Get Connection String**
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database password

#### **Step 4: Update .env File**
```env
MONGODB_URI=mongodb+srv://ibrahim:1234@cluster.mongodb.net/pharmgenius?retryWrites=true&w=majority
```

---

### **Option 2: Local MongoDB Installation**

**Best for:** Development, on-premise deployment

#### **Step 1: Install MongoDB**
```powershell
# Using Chocolatey (Windows)
choco install mongodb

# Or download from: https://www.mongodb.com/try/download/community
```

#### **Step 2: Start MongoDB Service**
```powershell
# Start MongoDB service
net start MongoDB

# Or run manually
mongod --dbpath C:\data\db
```

#### **Step 3: Update .env File**
```env
MONGODB_URI=mongodb://localhost:27017/pharmgenius
```

---

### **Option 3: Hospital MongoDB Server**

**Best for:** Integration with existing hospital infrastructure

#### **Step 1: Contact IT Department**
- Request MongoDB database instance
- Get connection details (host, port, credentials)
- Ensure network access from application server

#### **Step 2: Update .env File**
```env
MONGODB_URI=mongodb://hospital-db-server:27017/pharmgenius
```

---

## 📊 **Data Migration**

Once MongoDB is set up, migrate the data:

### **Step 1: Run Migration Scripts**
```powershell
# Navigate to PharmGenius directory
cd d:\microservices\pharmgenius\PharmGenius

# Run data migration
npm run migrate:mongo

# Process ICD-10 codes
npm run process:icd10
```

### **Step 2: Verify Data**
```powershell
# Check MongoDB connection
npm run check:mongo

# Verify data integrity
node scripts/migration/diagnostics.js
```

---

## 🔧 **Database Configuration**

### **Collections Structure**
```javascript
pharmgenius/
├── drugs/          // UAE drug database
├── formulary/      // Daman insurance data
├── icd10/          // Medical diagnosis codes
├── users/          // User authentication
└── analytics/      // Usage statistics
```

### **Indexes (Auto-created)**
```javascript
// Drugs collection
{ "Package Name": "text", "Generic Name": "text" }
{ "Drug Code": 1 }

// Formulary collection
{ "medication": "text" }
{ "coverage": 1 }

// ICD-10 collection
{ "code": 1 }
{ "description": "text" }
```

---

## 🔒 **Security Configuration**

### **MongoDB Atlas Security**
1. **IP Whitelist**: Add your server IP
2. **Database User**: Create dedicated user for PharmGenius
3. **Permissions**: Read/Write access to pharmgenius database only

### **Local MongoDB Security**
```javascript
// Create database user
use pharmgenius
db.createUser({
  user: "pharmgenius_user",
  pwd: "secure_password_here",
  roles: [
    { role: "readWrite", db: "pharmgenius" }
  ]
})
```

---

## 📈 **Performance Optimization**

### **Connection Pool Settings**
```env
# In .env file
DATABASE_POOL_SIZE=10
CONNECTION_TIMEOUT=30000
```

### **Memory Configuration**
- **Minimum RAM**: 1GB for MongoDB
- **Recommended RAM**: 4GB for optimal performance
- **Storage**: 10GB minimum (50GB recommended)

---

## 🔍 **Troubleshooting**

### **Common Issues**

#### **Connection Timeout**
```bash
Error: MongoServerSelectionError: connection timed out
```
**Solution**: Check network connectivity and firewall settings

#### **Authentication Failed**
```bash
Error: Authentication failed
```
**Solution**: Verify username/password in connection string

#### **Database Not Found**
```bash
Error: Database 'pharmgenius' not found
```
**Solution**: Database will be created automatically on first write

### **Health Check Commands**
```powershell
# Test MongoDB connection
npm run check:mongo

# Validate environment
npm run validate

# Check application health
npm run health
```

---

## 📞 **Support**

### **MongoDB Atlas Support**
- Documentation: https://docs.atlas.mongodb.com/
- Support: Available through Atlas dashboard

### **Local MongoDB Support**
- Documentation: https://docs.mongodb.com/
- Community: https://community.mongodb.com/

### **PharmGenius Support**
- Check logs: `logs/pharmgenius.log`
- Run diagnostics: `npm run validate`
- Contact development team

---

## ✅ **Verification Checklist**

- [ ] MongoDB instance running
- [ ] Connection string configured in .env
- [ ] Data migration completed successfully
- [ ] Health check passes
- [ ] Application starts without errors
- [ ] Drug search functionality works
- [ ] Daman formulary accessible
- [ ] ICD-10 codes searchable

---

**🎉 Once all items are checked, your MongoDB setup is complete!**

*For hospital deployment - PharmGenius Team* 🏥