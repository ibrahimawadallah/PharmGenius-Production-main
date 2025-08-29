import express from 'express';
import axios from 'axios';

const router = express.Router();

// RxNorm API - Free, no key required
const RXNORM_BASE = 'https://rxnav.nlm.nih.gov/REST';

// Search drugs
router.get('/drugs', async (req, res) => {
  try {
    const { query } = req.query;
    const response = await axios.get(`${RXNORM_BASE}/drugs.json`, {
      params: { name: query }
    });
    
    res.json({
      source: 'RxNorm',
      results: response.data.drugGroup?.conceptGroup || [],
      query
    });
  } catch (error) {
    res.status(500).json({ error: 'RxNorm API error' });
  }
});

export default router;