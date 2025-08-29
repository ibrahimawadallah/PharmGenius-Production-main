import express from 'express';
import axios from 'axios';

const router = express.Router();

// Configuration with sensible defaults
const SNOMED_BASE_URL = process.env.SNOMED_BASE_URL || 'http://localhost:8080';
const SNOMED_BRANCH = process.env.SNOMED_BRANCH || 'MAIN';
const SNOMED_TIMEOUT = parseInt(process.env.SNOMED_TIMEOUT || '10000', 10);

function getAcceptLanguage(req) {
  return req.get('Accept-Language') || 'en-x-900000000000509007,en;q=0.8';
}

function branchPath() {
  // Encode branch path for nested paths like MAIN/SNOMEDCT-US
  return encodeURIComponent(SNOMED_BRANCH);
}

function handleAxiosError(error, res, fallbackStatus = 502) {
  const status = error?.response?.status || fallbackStatus;
  const message = error?.response?.data?.message || error?.message || 'Unknown error';
  return res.status(status).json({ success: false, error: message });
}

// Health endpoint for SNOMED proxy
router.get('/health', async (req, res) => {
  try {
    const response = await axios.get(`${SNOMED_BASE_URL}/codesystems`, { timeout: SNOMED_TIMEOUT });
    return res.json({
      success: true,
      baseUrl: SNOMED_BASE_URL,
      branch: SNOMED_BRANCH,
      statusCode: response.status,
      codesystems: Array.isArray(response.data) ? response.data.length : (response.data?.items?.length || 0)
    });
  } catch (error) {
    return handleAxiosError(error, res);
  }
});

// Search concepts by term or filters
router.get('/concepts/search', async (req, res) => {
  try {
    const {
      term,
      ecl,
      statedEcl,
      activeFilter,
      limit = 50,
      offset = 0,
      includeLeafFlag = false,
      returnIdOnly = false,
      language,
      conceptIds
    } = req.query;

    const params = {
      term,
      ecl,
      statedEcl,
      activeFilter,
      limit,
      offset,
      includeLeafFlag,
      returnIdOnly,
    };

    if (language) params.language = Array.isArray(language) ? language : String(language).split(',');
    if (conceptIds) params.conceptIds = Array.isArray(conceptIds) ? conceptIds : String(conceptIds).split(',');

    const response = await axios.get(`${SNOMED_BASE_URL}/${branchPath()}/concepts`, {
      params,
      timeout: SNOMED_TIMEOUT,
      headers: { 'Accept-Language': getAcceptLanguage(req) }
    });

    return res.json({ success: true, data: response.data });
  } catch (error) {
    return handleAxiosError(error, res);
  }
});

// Get a concept in browser format
router.get('/concepts/:conceptId', async (req, res) => {
  try {
    const { conceptId } = req.params;
    const response = await axios.get(`${SNOMED_BASE_URL}/browser/${branchPath()}/concepts/${conceptId}`, {
      timeout: SNOMED_TIMEOUT,
      headers: { 'Accept-Language': getAcceptLanguage(req) }
    });
    return res.json({ success: true, data: response.data });
  } catch (error) {
    return handleAxiosError(error, res, error?.response?.status === 404 ? 404 : 502);
  }
});

// Get concept children
router.get('/concepts/:conceptId/children', async (req, res) => {
  try {
    const { conceptId } = req.params;
    const { form = 'inferred', includeDescendantCount = false } = req.query;
    const response = await axios.get(`${SNOMED_BASE_URL}/browser/${branchPath()}/concepts/${conceptId}/children`, {
      params: { form, includeDescendantCount },
      timeout: SNOMED_TIMEOUT,
      headers: { 'Accept-Language': getAcceptLanguage(req) }
    });
    return res.json({ success: true, data: response.data });
  } catch (error) {
    return handleAxiosError(error, res);
  }
});

// Get concept parents
router.get('/concepts/:conceptId/parents', async (req, res) => {
  try {
    const { conceptId } = req.params;
    const { form = 'inferred', includeDescendantCount = false } = req.query;
    const response = await axios.get(`${SNOMED_BASE_URL}/browser/${branchPath()}/concepts/${conceptId}/parents`, {
      params: { form, includeDescendantCount },
      timeout: SNOMED_TIMEOUT,
      headers: { 'Accept-Language': getAcceptLanguage(req) }
    });
    return res.json({ success: true, data: response.data });
  } catch (error) {
    return handleAxiosError(error, res);
  }
});

// Get concept ancestors
router.get('/concepts/:conceptId/ancestors', async (req, res) => {
  try {
    const { conceptId } = req.params;
    const { form = 'inferred' } = req.query;
    const response = await axios.get(`${SNOMED_BASE_URL}/browser/${branchPath()}/concepts/${conceptId}/ancestors`, {
      params: { form },
      timeout: SNOMED_TIMEOUT,
      headers: { 'Accept-Language': getAcceptLanguage(req) }
    });
    return res.json({ success: true, data: response.data });
  } catch (error) {
    return handleAxiosError(error, res);
  }
});

// Search descriptions
router.get('/descriptions/search', async (req, res) => {
  try {
    const { term, active = true, limit = 50, offset = 0, semanticTag, conceptActive } = req.query;
    const params = {
      term,
      active,
      limit,
      offset,
      semanticTag,
      conceptActive
    };
    const response = await axios.get(`${SNOMED_BASE_URL}/browser/${branchPath()}/descriptions`, {
      params,
      timeout: SNOMED_TIMEOUT,
      headers: { 'Accept-Language': getAcceptLanguage(req) }
    });
    return res.json({ success: true, data: response.data });
  } catch (error) {
    return handleAxiosError(error, res);
  }
});

// ECL query convenience endpoint
router.get('/ecl', async (req, res) => {
  try {
    const { ecl, limit = 50, offset = 0, form = 'inferred', returnIdOnly = false } = req.query;
    const params = { ecl, limit, offset, form, returnIdOnly };
    const response = await axios.get(`${SNOMED_BASE_URL}/${branchPath()}/concepts`, {
      params,
      timeout: SNOMED_TIMEOUT,
      headers: { 'Accept-Language': getAcceptLanguage(req) }
    });
    return res.json({ success: true, data: response.data });
  } catch (error) {
    return handleAxiosError(error, res);
  }
});

export default router;