import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const SNOMED_BASE_URL = process.env.SNOMED_BASE_URL || 'http://localhost:8080';

async function testSnomedHealth() {
  console.log(`Testing SNOMED at: ${SNOMED_BASE_URL}`);
  
  try {
    const response = await axios.get(`${SNOMED_BASE_URL}/codesystems`, { 
      timeout: 5000 
    });
    
    console.log('✅ SNOMED service is available');
    console.log(`Status: ${response.status}`);
    console.log(`Codesystems: ${Array.isArray(response.data) ? response.data.length : 'Unknown'}`);
  } catch (error) {
    console.log('❌ SNOMED service unavailable');
    console.log(`Error: ${error.message}`);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Make sure SNOMED Snowstorm is running on port 8080');
    }
  }
}

testSnomedHealth();