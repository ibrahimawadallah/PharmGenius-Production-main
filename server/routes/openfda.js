import express from 'express';
import axios from 'axios';

const router = express.Router();

// OpenFDA API - No key required
const OPENFDA_BASE = 'https://api.fda.gov';

// Search drugs
router.get('/drugs', async (req, res) => {
  try {
    const { query } = req.query;
    const response = await axios.get(`${OPENFDA_BASE}/drug/label.json`, {
      params: { 
        search: `openfda.brand_name:"${query}"`,
        limit: 10
      }
    });
    
    res.json({
      source: 'OpenFDA',
      results: response.data.results,
      total: response.data.meta.results.total
    });
  } catch (error) {
    res.status(500).json({ error: 'OpenFDA API error' });
  }
});

export default router;