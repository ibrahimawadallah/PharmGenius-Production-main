import express from 'express';
import axios from 'axios';
const router = express.Router();

// OpenFDA API Integration
class OpenFDAService {
  constructor() {
    this.baseURL = 'https://api.fda.gov';
    this.timeout = 10000; // 10 seconds
  }

  async searchDrugLabels(query, limit = 10) {
    // Try multiple query strategies to reduce 404s
    const strategies = [
      `openfda.brand_name.exact:"${query}" OR openfda.generic_name.exact:"${query}"`,
      `openfda.brand_name:"${query}" OR openfda.generic_name:"${query}" OR openfda.substance_name:"${query}"`,
      `openfda.generic_name:${query}* OR openfda.brand_name:${query}* OR openfda.substance_name:${query}*`,
      `indications_and_usage:"${query}" OR description:"${query}"`
    ];

    let lastError = null;
    for (const searchExpr of strategies) {
      try {
        const response = await axios.get(`${this.baseURL}/drug/label.json`, {
          params: { search: searchExpr, limit },
          timeout: this.timeout
        });
        return {
          success: true,
          data: response.data.results || [],
          meta: response.data.meta || {},
          queryTried: searchExpr
        };
      } catch (error) {
        // 404 from OpenFDA means "no results" for that query, try next strategy
        if (error?.response?.status === 404) {
          continue;
        }
        // Keep the last non-404 error to report if all strategies fail
        lastError = error;
      }
    }

    if (lastError) {
      console.error('OpenFDA API error:', lastError.message);
      return {
        success: false,
        error: lastError.message,
        data: []
      };
    }

    // If we get here, all strategies returned 404 (no hits)
    return {
      success: true,
      data: [],
      meta: {},
      queryTried: 'no_results'
    };
  }

  async getDrugAdverseEvents(drugName, limit = 10) {
    // Try multiple query strategies to reduce 404s
    const strategies = [
      `patient.drug.medicinalproduct.exact:"${drugName}"`,
      `patient.drug.medicinalproduct:"${drugName}"`,
      `patient.drug.openfda.substance_name:"${drugName}" OR patient.drug.openfda.generic_name:"${drugName}"`,
      `patient.reaction.reactionmeddrapt:"${drugName}"`
    ];

    let lastError = null;
    for (const searchExpr of strategies) {
      try {
        const response = await axios.get(`${this.baseURL}/drug/event.json`, {
          params: { search: searchExpr, limit },
          timeout: this.timeout
        });
        return {
          success: true,
          data: response.data.results || [],
          meta: response.data.meta || {},
          queryTried: searchExpr
        };
      } catch (error) {
        if (error?.response?.status === 404) {
          continue;
        }
        lastError = error;
      }
    }

    if (lastError) {
      console.error('OpenFDA Adverse Events API error:', lastError.message);
      return {
        success: false,
        error: lastError.message,
        data: []
      };
    }

    return {
      success: true,
      data: [],
      meta: {},
      queryTried: 'no_results'
    };
  }

  async getDrugRecalls(drugName, limit = 10) {
    try {
      const response = await axios.get(`${this.baseURL}/drug/enforcement.json`, {
        params: {
          search: `product_description:"${drugName}"`,
          limit: limit
        },
        timeout: this.timeout
      });
      
      return {
        success: true,
        data: response.data.results || [],
        meta: response.data.meta || {}
      };
    } catch (error) {
      // Treat 404 as empty results for recall as well
      if (error?.response?.status === 404) {
        return {
          success: true,
          data: [],
          meta: {},
          note: 'no_results'
        };
      }
      console.error('OpenFDA Recalls API error:', error.message);
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  }
}

// RxNorm API Integration
class RxNormService {
  constructor() {
    this.baseURL = 'https://rxnav.nlm.nih.gov/REST';
    this.timeout = 10000;
  }

  async searchDrugs(query) {
    try {
      const response = await axios.get(`${this.baseURL}/drugs.json`, {
        params: {
          name: query
        },
        timeout: this.timeout
      });
      
      return {
        success: true,
        data: response.data.drugGroup?.conceptGroup || [],
        query: query
      };
    } catch (error) {
      console.error('RxNorm API error:', error.message);
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  }

  async getDrugInteractions(rxcui) {
    try {
      const response = await axios.get(`${this.baseURL}/interaction/interaction.json`, {
        params: {
          rxcui: rxcui
        },
        timeout: this.timeout
      });
      
      return {
        success: true,
        data: response.data.interactionTypeGroup || [],
        rxcui: rxcui
      };
    } catch (error) {
      console.error('RxNorm Interactions API error:', error.message);
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  }

  async getDrugProperties(rxcui) {
    try {
      const response = await axios.get(`${this.baseURL}/rxcui/${rxcui}/properties.json`);
      
      return {
        success: true,
        data: response.data.properties || {},
        rxcui: rxcui
      };
    } catch (error) {
      console.error('RxNorm Properties API error:', error.message);
      return {
        success: false,
        error: error.message,
        data: {}
      };
    }
  }
}

// ChEMBL API Integration
class ChEMBLService {
  constructor() {
    this.baseURL = 'https://www.ebi.ac.uk/chembl/api/data';
    this.timeout = 15000;
  }

  async searchMolecules(query, limit = 10) {
    try {
      const response = await axios.get(`${this.baseURL}/molecule.json`, {
        params: {
          pref_name__icontains: query,
          limit: limit,
          format: 'json'
        },
        timeout: this.timeout
      });
      
      return {
        success: true,
        data: response.data.molecules || [],
        meta: response.data.page_meta || {}
      };
    } catch (error) {
      console.error('ChEMBL API error:', error.message);
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  }

  async getDrugTargets(chemblId) {
    try {
      const response = await axios.get(`${this.baseURL}/molecule/${chemblId}/mechanism.json`);
      
      return {
        success: true,
        data: response.data.mechanisms || [],
        chemblId: chemblId
      };
    } catch (error) {
      console.error('ChEMBL Targets API error:', error.message);
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  }

  async getDrugIndications(chemblId) {
    try {
      const response = await axios.get(`${this.baseURL}/drug_indication.json`, {
        params: {
          molecule_chembl_id: chemblId,
          format: 'json'
        },
        timeout: this.timeout
      });
      
      return {
        success: true,
        data: response.data.drug_indications || [],
        chemblId: chemblId
      };
    } catch (error) {
      console.error('ChEMBL Indications API error:', error.message);
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  }
}

// Initialize services
const openFDAService = new OpenFDAService();
const rxNormService = new RxNormService();
const chemblService = new ChEMBLService();

// OpenFDA Routes
router.get('/openfda/drug-labels/:drugName', async (req, res) => {
  try {
    const { drugName } = req.params;
    const limit = parseInt(req.query.limit) || 10;
    
    const result = await openFDAService.searchDrugLabels(drugName, limit);
    
    if (result.success) {
      res.json({
        source: 'OpenFDA',
        drugName,
        labels: result.data.map(label => ({
          brandName: label.openfda?.brand_name?.[0] || 'Unknown',
          genericName: label.openfda?.generic_name?.[0] || 'Unknown',
          manufacturer: label.openfda?.manufacturer_name?.[0] || 'Unknown',
          dosageForm: label.openfda?.dosage_form?.[0] || 'Unknown',
          route: label.openfda?.route?.[0] || 'Unknown',
          indications: label.indications_and_usage?.[0] || 'Not available',
          contraindications: label.contraindications?.[0] || 'Not available',
          warnings: label.warnings?.[0] || 'Not available',
          adverseReactions: label.adverse_reactions?.[0] || 'Not available'
        })),
        total: result.data.length,
        timestamp: new Date().toISOString()
      });
    } else {
      // Treat OpenFDA errors as empty results to avoid surfacing errors to UI
      res.json({
        source: 'OpenFDA',
        drugName,
        labels: [],
        total: 0,
        timestamp: new Date().toISOString(),
        note: 'OpenFDA unavailable'
      });
    }
  } catch (error) {
    // As a last resort, still respond with empty results
    res.json({
      source: 'OpenFDA',
      drugName: req.params.drugName,
      labels: [],
      total: 0,
      timestamp: new Date().toISOString(),
      note: 'OpenFDA error'
    });
  }
});

router.get('/openfda/adverse-events/:drugName', async (req, res) => {
  try {
    const { drugName } = req.params;
    const limit = parseInt(req.query.limit) || 10;
    
    const result = await openFDAService.getDrugAdverseEvents(drugName, limit);
    
    if (result.success) {
      res.json({
        source: 'OpenFDA',
        drugName,
        adverseEvents: result.data.map(event => ({
          receiptDate: event.receiptdate,
          serious: event.serious,
          patientAge: event.patient?.patientonsetage || 'Unknown',
          patientSex: event.patient?.patientsex || 'Unknown',
          reactions: event.patient?.reaction?.map(r => ({
            term: r.reactionmeddrapt,
            outcome: r.reactionoutcome
          })) || []
        })),
        total: result.data.length,
        timestamp: new Date().toISOString()
      });
    } else {
      res.json({
        source: 'OpenFDA',
        drugName,
        adverseEvents: [],
        total: 0,
        timestamp: new Date().toISOString(),
        note: 'OpenFDA unavailable'
      });
    }
  } catch (error) {
    res.json({
      source: 'OpenFDA',
      drugName: req.params.drugName,
      adverseEvents: [],
      total: 0,
      timestamp: new Date().toISOString(),
      note: 'OpenFDA error'
    });
  }
});

// RxNorm Routes
router.get('/rxnorm/search/:drugName', async (req, res) => {
  try {
    const { drugName } = req.params;
    
    const result = await rxNormService.searchDrugs(drugName);
    
    if (result.success) {
      const drugs = [];
      result.data.forEach(group => {
        if (group.conceptProperties) {
          group.conceptProperties.forEach(concept => {
            drugs.push({
              rxcui: concept.rxcui,
              name: concept.name,
              synonym: concept.synonym,
              tty: concept.tty,
              language: concept.language
            });
          });
        }
      });
      
      res.json({
        source: 'RxNorm',
        query: drugName,
        drugs: drugs,
        total: drugs.length,
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(500).json({
        error: 'Failed to search RxNorm',
        details: result.error
      });
    }
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
});

router.get('/rxnorm/interactions/:rxcui', async (req, res) => {
  try {
    const { rxcui } = req.params;
    
    const result = await rxNormService.getDrugInteractions(rxcui);
    
    if (result.success) {
      const interactions = [];
      result.data.forEach(group => {
        if (group.interactionPair) {
          group.interactionPair.forEach(pair => {
            interactions.push({
              interactionConcept: pair.interactionConcept?.[0]?.minConceptItem || {},
              severity: pair.severity || 'Unknown',
              description: pair.description
            });
          });
        }
      });
      
      res.json({
        source: 'RxNorm',
        rxcui,
        interactions: interactions,
        total: interactions.length,
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(500).json({
        error: 'Failed to fetch interactions',
        details: result.error
      });
    }
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
});

// ChEMBL Routes
router.get('/chembl/search/:drugName', async (req, res) => {
  try {
    const { drugName } = req.params;
    const limit = parseInt(req.query.limit) || 10;
    
    const result = await chemblService.searchMolecules(drugName, limit);
    
    if (result.success) {
      res.json({
        source: 'ChEMBL',
        query: drugName,
        molecules: result.data.map(molecule => ({
          chemblId: molecule.molecule_chembl_id,
          prefName: molecule.pref_name,
          molecularFormula: molecule.molecule_properties?.molecular_formula || 'Unknown',
          molecularWeight: molecule.molecule_properties?.molecular_weight || 'Unknown',
          logp: molecule.molecule_properties?.alogp || 'Unknown',
          maxPhase: molecule.max_phase || 'Unknown',
          therapeuticFlag: molecule.therapeutic_flag,
          moleculeType: molecule.molecule_type
        })),
        total: result.data.length,
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(500).json({
        error: 'Failed to search ChEMBL',
        details: result.error
      });
    }
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
});

router.get('/chembl/targets/:chemblId', async (req, res) => {
  try {
    const { chemblId } = req.params;
    
    const result = await chemblService.getDrugTargets(chemblId);
    
    if (result.success) {
      res.json({
        source: 'ChEMBL',
        chemblId,
        targets: result.data.map(mechanism => ({
          targetName: mechanism.target_chembl_id,
          mechanismOfAction: mechanism.mechanism_of_action,
          actionType: mechanism.action_type,
          targetType: mechanism.target_type
        })),
        total: result.data.length,
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(500).json({
        error: 'Failed to fetch drug targets',
        details: result.error
      });
    }
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
});

// Combined search endpoint
router.get('/combined-search/:drugName', async (req, res) => {
  try {
    const { drugName } = req.params;
    const includeApis = req.query.apis ? req.query.apis.split(',') : ['openfda', 'rxnorm', 'chembl'];
    
    const results = {};
    
    // Parallel API calls for better performance
    const promises = [];
    
    if (includeApis.includes('openfda')) {
      promises.push(
        openFDAService.searchDrugLabels(drugName, 5).then(result => {
          // Normalize so UI never sees OpenFDA errors as hard failures
          if (result.success) {
            results.openFDA = {
              source: 'OpenFDA',
              drugName,
              labels: result.data.map(label => ({
                brandName: label.openfda?.brand_name?.[0] || 'Unknown',
                genericName: label.openfda?.generic_name?.[0] || 'Unknown',
                manufacturer: label.openfda?.manufacturer_name?.[0] || 'Unknown',
                dosageForm: label.openfda?.dosage_form?.[0] || 'Unknown'
              })),
              total: result.data.length
            };
          } else {
            results.openFDA = { source: 'OpenFDA', drugName, labels: [], total: 0, note: 'unavailable' };
          }
        })
      );
    }
    
    if (includeApis.includes('rxnorm')) {
      promises.push(
        rxNormService.searchDrugs(drugName).then(result => {
          results.rxNorm = result;
        })
      );
    }
    
    if (includeApis.includes('chembl')) {
      promises.push(
        chemblService.searchMolecules(drugName, 5).then(result => {
          results.chembl = result;
        })
      );
    }
    
    await Promise.all(promises);
    
    res.json({
      drugName,
      sources: results,
      timestamp: new Date().toISOString(),
      note: 'Combined results from multiple pharmaceutical APIs'
    });
    
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    apis: {
      openFDA: 'https://api.fda.gov',
      rxNorm: 'https://rxnav.nlm.nih.gov/REST',
      chembl: 'https://www.ebi.ac.uk/chembl/api/data'
    },
    timestamp: new Date().toISOString()
  });
});

export default router;