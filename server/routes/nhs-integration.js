import express from 'express';
import axios from 'axios';

const router = express.Router();

// NHS API endpoints (requires registration)
const NHS_BASE_URL = process.env.NHS_BASE_URL || 'https://api.nhs.uk';
const NHS_API_KEY = process.env.NHS_API_KEY; // Requires NHS approval
const NHS_TIMEOUT = parseInt(process.env.NHS_TIMEOUT) || 30000;

// NHS drug search
router.get('/drugs', async (req, res) => {
  if (!NHS_API_KEY) {
    return res.status(501).json({ 
      error: 'NHS integration not configured',
      message: 'NHS API key required'
    });
  }

  try {
    const { query } = req.query;
    const response = await axios.get(`${NHS_BASE_URL}/medicines`, {
      headers: { 
        'Authorization': `Bearer ${NHS_API_KEY}`,
        'Content-Type': 'application/json'
      },
      params: { q: query },
      timeout: NHS_TIMEOUT
    });
    
    res.json({
      source: 'NHS',
      results: response.data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'NHS API unavailable',
      details: error.message 
    });
  }
});

export default router;