import axios from 'axios';

class ICD10DrugService {
  constructor() {
    // Use backend proxy route that aggregates free online ICD-10 services
    this.icd10ServiceUrl = '/api/icd10/live';
    this.uaeDrugList = null;
  }

  // Load UAE drug list
  async loadUAEDrugList() {
    if (!this.uaeDrugList) {
      try {
        const response = await axios.get('/uae-drug-list.json');
        this.uaeDrugList = response.data;
      } catch (error) {
        console.error('Error loading UAE drug list:', error);
        this.uaeDrugList = [];
      }
    }
    return this.uaeDrugList;
  }

  // Search ICD-10 codes (via server route that hits free online sources)
  async searchICD10(query) {
    try {
      const response = await axios.get(this.icd10ServiceUrl, {
        params: { terms: query },
      });
      return response.data.results || [];
    } catch (error) {
      console.error('Error searching ICD-10:', error);
      return [];
    }
  }

  // Get drugs for specific ICD-10 code
  async getDrugsForICD10(icd10Code) {
    try {
      const response = await axios.get(`${this.icd10ServiceUrl}/icd10/${icd10Code}/drugs`);
      const data = response.data;
      if (Array.isArray(data)) return data;
      return data.drugs || data.results || [];
    } catch (error) {
      console.error('Error getting drugs for ICD-10:', error);
      return [];
    }
  }

  // Get ICD-10 mappings for a drug
  async getICD10ForDrug(drugName) {
    try {
      const response = await axios.get(`${this.icd10ServiceUrl}/drugs/${drugName}/indications`);
      const data = response.data;
      const raw = Array.isArray(data) ? data : (data.icd10_mappings || data.results || data.mappings || []);
      const normalized = (raw || []).map(item => ({
        icd10_code: item.icd10_code || item.code || item.icd10 || '',
        indication: item.indication || item.description || item.name || '',
        confidence: item.confidence,
        notes: item.notes,
      }));
      return normalized;
    } catch (error) {
      console.error('Error getting ICD-10 for drug:', error);
      return [];
    }
  }

  // Search UAE drugs with ICD-10 integration
  async searchUAEDrugsWithICD10(drugName, icd10Code = null) {
    await this.loadUAEDrugList();
    
    // Filter UAE drugs by name
    let filteredDrugs = this.uaeDrugList.filter(drug => 
      drug['Package Name'] && 
      drug['Package Name'].toLowerCase().includes(drugName.toLowerCase())
    );

    // If ICD-10 code provided, get related drugs and cross-reference
    if (icd10Code) {
      try {
        const icd10Drugs = await this.getDrugsForICD10(icd10Code);
        const icd10DrugNames = icd10Drugs.map(d => d.name?.toLowerCase());
        
        // Prioritize drugs that match ICD-10 indications
        filteredDrugs = filteredDrugs.map(drug => ({
          ...drug,
          icd10Match: icd10DrugNames.some(name => 
            drug['Package Name'].toLowerCase().includes(name) ||
            drug['Generic Name']?.toLowerCase().includes(name)
          )
        })).sort((a, b) => b.icd10Match - a.icd10Match);
      } catch (error) {
        console.error('Error cross-referencing with ICD-10:', error);
      }
    }

    return filteredDrugs.slice(0, 20); // Limit results
  }

  requiresPreAuthorization(drug, icd10Code) {
    // Simple rules based on formulary and ICD-10 code
    const nonChronicCodes = ['J00', 'J01', 'J02', 'J03']; // Common acute conditions
    const isAcute = nonChronicCodes.some(code => icd10Code?.startsWith(code));

    const highCost = (parseFloat(drug['Package Price to Public']) || 0) > 500;
    const notInBasic = drug['Included In Basic Drug Formulary'] !== 'Yes';

    return (!isAcute && notInBasic) || highCost;
  }

  getRecommendedAction(approvalInfo) {
    if (!approvalInfo.insuranceCoverage.thiqa && !approvalInfo.insuranceCoverage.basic) {
      return 'Not covered by insurance - patient pays full amount';
    }
    
    if (approvalInfo.approvalRequired) {
      return 'Prior authorization required - submit approval request';
    }
    
    return 'Covered by insurance - proceed with dispensing';
  }
}

export default new ICD10DrugService();