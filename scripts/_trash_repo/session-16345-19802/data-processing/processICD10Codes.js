import fs from 'fs';
import Papa from 'papaparse';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Working ICD-10 APIs (based on test results)
const ICD10_APIS = [
  {
    name: 'NIH Clinical Tables',
    url: (terms) => `https://clinicaltables.nlm.nih.gov/api/icd10cm/v3/search?sf=code,name&terms=${encodeURIComponent(terms)}`,
    parser: (data) => {
      try {
        const [count, codes, , descriptions] = data;
        if (!descriptions || descriptions.length === 0) return [];
        return descriptions.map(([code, description]) => ({ code, description }));
      } catch (error) {
        return [];
      }
    }
  },
  {
    name: 'OpenFDA Drug API',
    url: (terms) => `https://api.fda.gov/drug/label.json?search=openfda.generic_name:"${encodeURIComponent(terms)}"&limit=5`,
    parser: (data) => {
      try {
        if (!data || !data.results) return [];
        const codes = [];
        data.results.forEach(result => {
          if (result.indications_and_usage) {
            result.indications_and_usage.forEach(indication => {
              // Extract medical conditions that might map to ICD codes
              const conditions = indication.match(/(diabetes|hypertension|depression|asthma|infection|pain|fever|inflammation|allergy|cancer|heart|kidney|liver|lung|brain|blood|bone|skin|eye|ear|nose|throat)/gi);
              if (conditions) {
                conditions.forEach(condition => {
                  codes.push({ 
                    code: 'MED_CONDITION', 
                    description: condition.toLowerCase() + ' (medical condition from FDA label)' 
                  });
                });
              }
              
              // Also include full indication as potential ICD mapping
              if (indication.length > 20 && indication.length < 300) {
                codes.push({ 
                  code: 'FDA_INDICATION', 
                  description: indication.substring(0, 200) 
                });
              }
            });
          }
        });
        return codes.slice(0, 5);
      } catch (error) {
        return [];
      }
    }
  },
  {
    name: 'RxNorm API',
    url: (terms) => `https://rxnav.nlm.nih.gov/REST/drugs.json?name=${encodeURIComponent(terms)}`,
    parser: (data) => {
      try {
        if (!data || !data.drugGroup || !data.drugGroup.conceptGroup) return [];
        const concepts = data.drugGroup.conceptGroup.flatMap(group => 
          group.conceptProperties || []
        );
        return concepts.map(concept => ({
          code: 'RXCUI_' + concept.rxcui,
          description: concept.name + ' (RxNorm concept)'
        })).slice(0, 3);
      } catch (error) {
        return [];
      }
    }
  }
];

// Enhanced drug-to-ICD mapping for common medications
const DRUG_ICD_MAPPINGS = {
  // Diabetes medications
  'metformin': [{ code: 'E11.9', description: 'Type 2 diabetes mellitus without complications' }],
  'insulin': [{ code: 'E10.9', description: 'Type 1 diabetes mellitus without complications' }, { code: 'E11.9', description: 'Type 2 diabetes mellitus without complications' }],
  'glipizide': [{ code: 'E11.9', description: 'Type 2 diabetes mellitus without complications' }],
  'glyburide': [{ code: 'E11.9', description: 'Type 2 diabetes mellitus without complications' }],
  
  // Cardiovascular medications
  'lisinopril': [{ code: 'I10', description: 'Essential (primary) hypertension' }],
  'atorvastatin': [{ code: 'E78.5', description: 'Hyperlipidemia, unspecified' }],
  'amlodipine': [{ code: 'I10', description: 'Essential (primary) hypertension' }],
  'aspirin': [{ code: 'I25.10', description: 'Atherosclerotic heart disease of native coronary artery' }],
  'warfarin': [{ code: 'I48.91', description: 'Unspecified atrial fibrillation' }],
  'clopidogrel': [{ code: 'I25.10', description: 'Atherosclerotic heart disease of native coronary artery' }],
  
  // Respiratory medications
  'albuterol': [{ code: 'J45.909', description: 'Unspecified asthma, uncomplicated' }],
  'montelukast': [{ code: 'J45.909', description: 'Unspecified asthma, uncomplicated' }],
  'fluticasone': [{ code: 'J45.909', description: 'Unspecified asthma, uncomplicated' }],
  
  // Gastrointestinal medications
  'omeprazole': [{ code: 'K21.9', description: 'Gastro-esophageal reflux disease without esophagitis' }],
  'pantoprazole': [{ code: 'K21.9', description: 'Gastro-esophageal reflux disease without esophagitis' }],
  
  // Thyroid medications
  'levothyroxine': [{ code: 'E03.9', description: 'Hypothyroidism, unspecified' }],
  
  // Mental health medications
  'sertraline': [{ code: 'F32.9', description: 'Major depressive disorder, single episode, unspecified' }],
  'escitalopram': [{ code: 'F32.9', description: 'Major depressive disorder, single episode, unspecified' }],
  
  // Pain medications
  'tramadol': [{ code: 'G89.29', description: 'Other chronic pain' }],
  'gabapentin': [{ code: 'G89.29', description: 'Other chronic pain' }],
  
  // Antibiotics (general infection codes)
  'amoxicillin': [{ code: 'J06.9', description: 'Acute upper respiratory infection, unspecified' }],
  'azithromycin': [{ code: 'J06.9', description: 'Acute upper respiratory infection, unspecified' }],
  'ciprofloxacin': [{ code: 'N39.0', description: 'Urinary tract infection, site not specified' }]
};

// Rate limiting
const RATE_LIMIT_DELAY = 2000; // 2 seconds between requests
const BATCH_SIZE = 25; // Process in batches

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function tryAPI(api, terms) {
  try {
    console.log(`  🌐 Trying ${api.name}...`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(api.url(terms), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'PharmGenius-ICD10-Processor/1.0'
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`${api.name} returned ${response.status}`);
    }
    
    const data = await response.json();
    const results = api.parser(data);
    
    if (results && results.length > 0) {
      console.log(`    ✅ Found ${results.length} codes`);
      return results.slice(0, 3); // Limit to 3 most relevant codes
    }
    
    return null;
  } catch (error) {
    console.log(`    ❌ ${api.name} failed: ${error.message}`);
    return null;
  }
}

function findLocalMapping(drugName) {
  const drugLower = drugName.toLowerCase();
  
  for (const [mappedDrug, codes] of Object.entries(DRUG_ICD_MAPPINGS)) {
    if (drugLower.includes(mappedDrug) || mappedDrug.includes(drugLower)) {
      console.log(`    ✅ Found local mapping for ${mappedDrug}`);
      return codes;
    }
  }
  
  return null;
}

async function getICD10CodesForDrug(drugName) {
  console.log(`🔍 Processing: ${drugName}`);
  
  // First try local mappings (fastest)
  const localCodes = findLocalMapping(drugName);
  if (localCodes) {
    return { drug: drugName, codes: localCodes, source: 'Local Mapping' };
  }
  
  // Try external APIs
  for (const api of ICD10_APIS) {
    const results = await tryAPI(api, drugName);
    
    if (results && results.length > 0) {
      return { drug: drugName, codes: results, source: api.name };
    }
    
    // Rate limiting
    await delay(RATE_LIMIT_DELAY);
  }
  
  console.log(`    ❌ No codes found for ${drugName}`);
  return { drug: drugName, codes: [], source: 'None' };
}

async function processUAEDrugs() {
  console.log('🚀 Starting ICD-10 Code Processing for UAE Drugs');
  console.log('================================================');
  
  // Read UAE drug list
  const drugDbPath = path.join(__dirname, '..', 'UAE drug list.csv');
  const csvData = fs.readFileSync(drugDbPath, 'utf8').replace(/^\uFEFF/, '');
  
  const parsed = Papa.parse(csvData, {
    header: true,
    skipEmptyLines: true,
  });
  
  if (parsed.errors.length > 0) {
    console.error('❌ Error parsing CSV:', parsed.errors);
    return;
  }
  
  const drugs = parsed.data.filter(drug => drug['Package Name']);
  console.log(`📊 Found ${drugs.length} drugs to process`);
  
  const results = {};
  const stats = {
    processed: 0,
    withCodes: 0,
    withoutCodes: 0,
    errors: 0
  };
  
  // Process in batches
  for (let i = 0; i < drugs.length; i += BATCH_SIZE) {
    const batch = drugs.slice(i, i + BATCH_SIZE);
    console.log(`\n📦 Processing batch ${Math.floor(i/BATCH_SIZE) + 1}/${Math.ceil(drugs.length/BATCH_SIZE)} (${batch.length} drugs)`);
    
    for (const drug of batch) {
      try {
        const drugName = drug['Package Name'] || drug['Trade Name'] || drug['Generic Name'];
        if (!drugName) continue;
        
        const result = await getICD10CodesForDrug(drugName);
        
        if (result.codes.length > 0) {
          results[drugName.toLowerCase()] = result.codes;
          stats.withCodes++;
        } else {
          stats.withoutCodes++;
        }
        
        stats.processed++;
        
        // Progress update
        if (stats.processed % 100 === 0) {
          console.log(`📈 Progress: ${stats.processed}/${drugs.length} (${Math.round(stats.processed/drugs.length*100)}%)`);
        }
        
      } catch (error) {
        console.error(`❌ Error processing drug:`, error.message);
        stats.errors++;
      }
    }
    
    // Save intermediate results
    const outputPath = path.join(__dirname, '..', 'public', 'icd10-data-enhanced.json');
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    console.log(`💾 Saved intermediate results to ${outputPath}`);
    
    // Longer delay between batches
    await delay(10000);
  }
  
  // Final save
  const finalOutputPath = path.join(__dirname, '..', 'public', 'icd10-data-complete.json');
  fs.writeFileSync(finalOutputPath, JSON.stringify(results, null, 2));
  
  // Generate summary
  console.log('\n🎉 Processing Complete!');
  console.log('======================');
  console.log(`📊 Total drugs processed: ${stats.processed}`);
  console.log(`✅ Drugs with ICD-10 codes: ${stats.withCodes}`);
  console.log(`❌ Drugs without codes: ${stats.withoutCodes}`);
  console.log(`⚠️  Errors: ${stats.errors}`);
  console.log(`📈 Success rate: ${Math.round(stats.withCodes/stats.processed*100)}%`);
  console.log(`💾 Results saved to: ${finalOutputPath}`);
  
  // Create backup of original
  const originalPath = path.join(__dirname, '..', 'public', 'icd10-data.json');
  const backupPath = path.join(__dirname, '..', 'public', 'icd10-data-backup.json');
  if (fs.existsSync(originalPath)) {
    fs.copyFileSync(originalPath, backupPath);
    console.log(`🔄 Original data backed up to: ${backupPath}`);
  }
  
  // Replace original with enhanced data
  fs.copyFileSync(finalOutputPath, originalPath);
  console.log(`🔄 Enhanced data is now active!`);
}

// Run the processor
processUAEDrugs().catch(console.error);