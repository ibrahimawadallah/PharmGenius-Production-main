# SNOMED Snowstorm Setup Guide

## Prerequisites
1. **Java 11+** - Download from [Oracle](https://www.oracle.com/java/technologies/downloads/) or [OpenJDK](https://openjdk.org/)
2. **Elasticsearch** (optional for full features)

## Quick Setup

### 1. Download SNOMED Snowstorm
```bash
# Download latest release
curl -L -o snowstorm.jar https://github.com/IHTSDO/snowstorm/releases/latest/download/snowstorm-*.jar
```

### 2. Start SNOMED Snowstorm
```bash
# Option 1: Use our script
npm run start:snomed

# Option 2: Manual start
java -Xms2g -Xmx4g -jar snowstorm.jar --server.port=8080
```

### 3. Test SNOMED Health
```bash
npm run health:snomed
```

## Alternative: Use Public SNOMED Server
Update `.env` file:
```env
SNOMED_BASE_URL=https://snowstorm.ihtsdotools.org
```

## Endpoints Available
- Health: `http://localhost:8080/actuator/health`
- Concepts: `http://localhost:8080/MAIN/concepts`
- Browser: `http://localhost:8080/browser/MAIN/concepts/{conceptId}`

## Memory Requirements
- Minimum: 2GB RAM
- Recommended: 4GB+ RAM
- Disk: 1GB+ free space