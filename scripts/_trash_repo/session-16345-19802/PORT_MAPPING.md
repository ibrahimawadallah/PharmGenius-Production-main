# Port Mapping for PharmGenius

## Current Port Usage
- **3002**: PharmGenius Server (PID: 25968) ✅ ACTIVE
- **27017**: MongoDB (PID: 4720) ✅ ACTIVE
- **8080**: SNOMED Snowstorm ❌ NOT RUNNING
- **5173**: Vite Dev Server ❌ NOT RUNNING

## Service Port Configuration

### PharmGenius Main Server
- **Port**: 3002
- **Status**: Running
- **Environment Variable**: `PORT=3002`

### MongoDB
- **Port**: 27017 (localhost)
- **Status**: Running
- **Connection**: `mongodb://localhost:27017/pharmgenius`

### SNOMED Snowstorm
- **Port**: 8080 (expected)
- **Status**: Not Running
- **Environment Variable**: `SNOMED_BASE_URL=http://localhost:8080`

### Vite Development Server
- **Port**: 5173
- **Status**: Not Running
- **Environment Variable**: `VITE_PORT=5173`

## Recommended Port Allocation
- **3002**: Main PharmGenius Server
- **3003**: Backup/Alternative Server
- **5173**: Vite Development
- **8080**: SNOMED Snowstorm
- **27017**: MongoDB (default)