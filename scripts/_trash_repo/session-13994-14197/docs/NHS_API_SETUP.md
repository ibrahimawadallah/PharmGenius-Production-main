# NHS API Integration Setup

## 1. Apply for NHS API Access

Visit: https://developer.api.nhs.uk

### Required Information:
- Organization name
- Use case description
- Expected API usage volume
- Data protection compliance

### Application Process:
1. Create developer account
2. Submit API access request
3. Provide technical documentation
4. Wait for approval (2-4 weeks)

## 2. API Credentials Setup

Once approved, you'll receive:
- API Key
- Client ID
- Client Secret

## 3. Environment Configuration

Update `.env` file:
```env
NHS_API_KEY=your_actual_api_key_here
NHS_BASE_URL=https://api.nhs.uk
NHS_TIMEOUT=30000
```

## 4. Available Endpoints

- `/api/nhs/drugs` - Search NHS medicines database
- More endpoints can be added as needed

## 5. Testing

```bash
curl http://localhost:3001/api/nhs/drugs?query=paracetamol
```

## 6. Compliance Requirements

- GDPR compliance
- NHS data governance
- Rate limiting respect
- Proper error handling