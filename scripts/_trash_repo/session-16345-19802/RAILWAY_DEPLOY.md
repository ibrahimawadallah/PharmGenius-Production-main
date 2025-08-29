# Railway Deployment with Atlas MongoDB

## 1. Push to GitHub
```bash
git add .
git commit -m "feat: Add Atlas MongoDB integration with full data migration"
git push origin main
```

## 2. Deploy to Railway
- Go to https://railway.app
- Connect your GitHub repo
- Deploy from main branch

## 3. Add Environment Variables in Railway Dashboard

**Required Variables:**
```
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb+srv://ibrahim:1234@cluster0.dmj7afa.mongodb.net/pharmgenius?retryWrites=true&w=majority
JWT_SECRET=PharmGenius2024!Hospital#SecureKey$Production9xR7mQ3pL8nK5wV2
ENABLE_EXTERNAL_APIS=true
ENABLE_DRUG_INTERACTIONS=true
ENABLE_DAMAN_INTEGRATION=true
ENABLE_ICD10_MAPPING=true
API_RATE_LIMIT=100
```

## 4. Railway will automatically:
- Install dependencies
- Build the app
- Start the server
- Connect to your Atlas MongoDB

## 5. Your app will have access to:
- 21,322 drugs
- 71,703 medical codes
- 24,627 categories
- All drug interactions & safety data

## 6. Test deployment:
- Railway will provide a URL like: `https://pharmgenius-production-xxx.up.railway.app`
- Test: `https://your-url.railway.app/api/health`