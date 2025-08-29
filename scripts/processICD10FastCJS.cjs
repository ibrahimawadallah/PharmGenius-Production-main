const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');

// Fast ICD-10 processing with smart drug name extraction
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
    url: (terms) => `https://api.fda.gov/drug/label.json?search=openfda.generic_name:"${encodeURIComponent(terms)}"&limit=3`,
    parser: (data) => {
      try {
        if (!data || !data.results) return [];
        const codes = [];
        data.results.forEach(result => {
          if (result.indications_and_usage) {
            result.indications_and_usage.forEach(indication => {
              const conditions = indication.match(/(diabetes|hypertension|depression|asthma|infection|pain|fever|inflammation|allergy|cancer|heart|kidney|liver|lung|brain|blood|bone|skin|eye|ear|nose|throat|arthritis|migraine|epilepsy|anxiety|insomnia|nausea|vomiting|diarrhea|constipation|ulcer|reflux|cholesterol|thyroid|anemia|clot|stroke|seizure)/gi);
              if (conditions) {
                conditions.forEach(condition => {
                  codes.push({ 
                    code: 'MED_CONDITION', 
                    description: condition.toLowerCase() + ' (medical condition)' 
                  });
                });
              }
            });
          }
        });
        return codes.slice(0, 3);
      } catch (error) {
        return [];
      }
    }
  }
];

// Extract generic drug name from complex drug names
function extractGenericName(drugName) {
  if (!drugName) return '';
  
  // Convert to lowercase and clean
  let cleaned = drugName.toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
  
  // Remove common prefixes/suffixes
  cleaned = cleaned
    .replace(/^(teva|pfizer|novartis|roche|merck|gsk|abbott|bayer|sanofi|astrazeneca)-?/gi, '')
    .replace(/-(tablets?|capsules?|injection|syrup|suspension|solution|cream|ointment|gel|drops?|spray|inhaler|patch|suppository|powder|granules|sachets?|vials?|ampoules?|prefilled|pen|auto-injector|extended|release|controlled|immediate|delayed|enteric|coated|chewable|dispersible|effervescent|sublingual|buccal|transdermal|topical|ophthalmic|otic|nasal|rectal|vaginal|oral|intravenous|intramuscular|subcutaneous)$/gi, '')
    .replace(/\s+(mg|mcg|g|ml|l|units?|iu|%|\d+)\s*$/gi, '')
    .replace(/\s*\d+\s*(mg|mcg|g|ml|l|units?|iu|%)\s*$/gi, '')
    .trim();
  
  // Extract first meaningful word (usually the generic name)
  const words = cleaned.split(/\s+/);
  return words[0] || drugName;
}

// Fetch ICD-10 codes for a drug
async function fetchICD10Codes(drugName) {
  const fetch = (await import('node-fetch')).default;
  const genericName = extractGenericName(drugName);
  const searchTerms = [genericName, drugName].filter(Boolean);
  
  for (const term of searchTerms) {
    for (const api of ICD10_APIS) {
      try {
        const response = await fetch(api.url(term), {
          headers: { 'User-Agent': 'PharmGenius-ICD10-Processor/1.0' }
        });
        
        if (response.ok) {
          const data = await response.json();
          const codes = api.parser(data);
          if (codes && codes.length > 0) {
            return codes.slice(0, 3); // Limit to 3 codes per drug
          }
        }
      } catch (error) {
        // Continue to next API
      }
    }
  }
  
  return [];
}

// Main processing function
async function processICD10Fast() {
  console.log('🚀 Starting Fast ICD-10 Processing...');
  
  // Load UAE drug list
  const csvPath = path.join(__dirname, '..', 'UAE drug list.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf8');
  const parsed = Papa.parse(csvContent, { header: true, skipEmptyLines: true });
  
  console.log(`📊 Loaded ${parsed.data.length} drugs from UAE list`);
  
  // Prioritize common drugs (first 25 entries for testing)
  const prioritizedDrugs = parsed.data.slice(0, 25);
  console.log(`🎯 Processing ${prioritizedDrugs.length} prioritized drugs`);
  
  const results = {};
  let processed = 0;
  let found = 0;
  
  for (const row of prioritizedDrugs) {
        const packageName = row['Package Name'] || '';
        const genericName = row['Generic Name'] || '';
        const drugName = packageName.trim() || genericName.trim();
        if (!drugName) continue;
    
    processed++;
    console.log(`[${processed}/25] Processing: ${drugName}`);
    
    try {
      const codes = await fetchICD10Codes(drugName);
      if (codes.length > 0) {
        results[drugName] = codes;
        found++;
        console.log(`  ✅ Found ${codes.length} codes`);
      } else {
        console.log(`  ❌ No codes found`);
      }
    } catch (error) {
      console.log(`  ⚠️ Error: ${error.message}`);
    }
    
    // Rate limiting
    if (processed % 10 === 0) {
      console.log(`📈 Progress: ${processed}/${prioritizedDrugs.length} (${found} drugs with codes)`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    } else {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  // Save results
  const outputPath = path.join(__dirname, '..', 'public', 'icd10-data-fast.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  
  console.log(`\n🎉 Fast ICD-10 Processing Complete!`);
  console.log(`📊 Results:`);
  console.log(`   - Processed: ${processed} drugs`);
  console.log(`   - Found codes for: ${found} drugs`);
  console.log(`   - Success rate: ${((found / processed) * 100).toFixed(1)}%`);
  console.log(`   - Output saved to: ${outputPath}`);
}

// Run the script
processICD10Fast().catch(console.error);