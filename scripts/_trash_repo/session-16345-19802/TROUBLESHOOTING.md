# PharmGenius Troubleshooting Guide

## Common Issues and Solutions

### 1. Port Already in Use Error

**Error**: `EADDRINUSE: address already in use 0.0.0.0:3001`

**Solutions**:
- Use the provided batch file: `start-clean.bat`
- Or manually kill processes:
  ```cmd
  netstat -ano | findstr :3001
  taskkill /f /pid [PID_NUMBER]
  ```
- Or use the kill-ports batch file: `kill-ports.bat`

### 2. SQLite Dependencies Missing

**Error**: `Cannot find package 'sqlite' imported from...`

**Solutions**:
- Install SQLite dependencies: `npm run install:sqlite`
- Or skip SQLite migration: Use `npm run migrate:atlas` instead
- Or use the safe migration: `npm run migrate:sqlite` (now uses safe version)

### 3. MongoDB Connection Issues

**Error**: MongoDB connection failed

**Solutions**:
- Check your `.env` file has correct `MONGODB_URI`
- Test connection: `npm run check:mongo`
- Verify Atlas cluster is running
- Check network connectivity

### 4. Build Issues

**Error**: Application not built

**Solutions**:
- Run build command: `npm run build`
- Check if `dist` folder exists
- Verify Vite configuration

## Quick Start Commands

1. **Clean start** (recommended):
   ```cmd
   start-clean.bat
   ```

2. **Manual start**:
   ```cmd
   npm run kill-ports
   npm start
   ```

3. **Development mode**:
   ```cmd
   npm run dev
   ```

## Port Configuration

- **Production**: Port 3002 (changed from 3001 to avoid conflicts)
- **Development**: Port 5173 (Vite default)
- **Health check**: `http://localhost:3002/api/health`

## Environment Variables

Make sure your `.env` file contains:
```env
PORT=3002
MONGODB_URI=mongodb+srv://ibrahim:1234@cluster0.dmj7afa.mongodb.net/pharmgenius?retryWrites=true&w=majority
NODE_ENV=production
```

## Database Status

Check database connections:
- MongoDB Atlas: `npm run check:mongo`
- Migration status: `npm run migrate:atlas`

## Git Issues

If you see git command errors, use proper syntax:
```cmd
git add .
git commit -m "Your message"
git push origin main
```

## Server Health Check

Test if server is running:
```cmd
curl http://localhost:3002/api/health
```

Or visit in browser: `http://localhost:3002/api/health`