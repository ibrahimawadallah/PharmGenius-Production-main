import { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Input,
  Button,
  Text,
  Badge,
  Card,
  CardBody,
  Spinner,
  useColorModeValue,
  Divider,
  Icon,
  Tooltip
} from '@chakra-ui/react';
import { FaInfoCircle, FaPills, FaStethoscope, FaMoneyBillWave } from 'react-icons/fa';
import icd10DrugService from '../services/icd10DrugService';

const ICD10DrugSearch = () => {
  const [diagnosisQuery, setDiagnosisQuery] = useState('');
  const [drugQuery, setDrugQuery] = useState('');
  const [icd10Results, setIcd10Results] = useState([]);
  const [selectedICD10, setSelectedICD10] = useState(null);
  const [drugResults, setDrugResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  // Helper function to generate examples for ICD-10 codes
  const getICD10Examples = (indication, icd10Code) => {
    const examples = {
      // Diabetes examples
      'diabetes': ['Blood sugar levels consistently above 126 mg/dL', 'Frequent urination and excessive thirst', 'Unexplained weight loss with fatigue'],
      'type 2 diabetes': ['HbA1c levels ≥ 6.5%', 'Random glucose ≥ 200 mg/dL with symptoms', 'Family history with obesity'],
      'hypertension': ['Blood pressure consistently ≥ 140/90 mmHg', 'Headaches with dizziness', 'Chest pain or shortness of breath'],
      'high blood pressure': ['Systolic BP > 140 or Diastolic BP > 90', 'Morning headaches', 'Blurred vision'],
      'depression': ['Persistent sadness for 2+ weeks', 'Loss of interest in activities', 'Sleep disturbances'],
      'anxiety': ['Excessive worry about daily activities', 'Physical symptoms like rapid heartbeat', 'Avoidance of social situations'],
      'asthma': ['Wheezing and shortness of breath', 'Chest tightness during exercise', 'Coughing at night'],
      'copd': ['Chronic cough with mucus production', 'Shortness of breath during activities', 'Frequent respiratory infections'],
      'arthritis': ['Joint pain and stiffness in morning', 'Swelling in hands or knees', 'Reduced range of motion'],
      'migraine': ['Severe headache with nausea', 'Sensitivity to light and sound', 'Visual disturbances (aura)'],
      'epilepsy': ['Recurrent seizures', 'Temporary confusion', 'Loss of consciousness episodes'],
      'gastritis': ['Upper abdominal pain', 'Nausea and vomiting', 'Feeling of fullness after eating'],
      'ulcer': ['Burning stomach pain', 'Pain between meals or at night', 'Bloating and heartburn']
    };

    const lowerIndication = indication.toLowerCase();
    for (const [key, value] of Object.entries(examples)) {
      if (lowerIndication.includes(key)) {
        return value;
      }
    }
    
    // Default examples based on ICD-10 code patterns
    if (icd10Code?.startsWith('E')) return ['Endocrine system disorder', 'Metabolic condition', 'Hormonal imbalance'];
    if (icd10Code?.startsWith('I')) return ['Cardiovascular condition', 'Heart or blood vessel issue', 'Circulatory system disorder'];
    if (icd10Code?.startsWith('J')) return ['Respiratory condition', 'Breathing difficulty', 'Lung or airway issue'];
    if (icd10Code?.startsWith('M')) return ['Musculoskeletal condition', 'Joint or muscle pain', 'Bone disorder'];
    if (icd10Code?.startsWith('F')) return ['Mental health condition', 'Behavioral disorder', 'Psychological symptoms'];
    
    return ['Clinical symptoms present', 'Medical evaluation needed', 'Treatment indicated'];
  };

  // Helper function to generate drug usage examples
  const getDrugExamples = (drug) => {
    const genericName = drug['Generic Name']?.toLowerCase() || '';
    const packageName = drug['Package Name']?.toLowerCase() || '';
    const strength = drug['Strength'] || '';
    const dosageForm = drug['Dosage Form']?.toLowerCase() || '';

    const examples = {
      'amlodipine': [`Take ${strength} once daily in the morning`, 'For high blood pressure control', 'Can be taken with or without food'],
      'pantoprazole': [`Take ${strength} 30 minutes before breakfast`, 'For acid reflux and stomach ulcers', 'Swallow whole, do not crush'],
      'levetiracetam': [`Take ${strength} twice daily`, 'For seizure prevention', 'Take at the same times each day'],
      'hydroxychloroquine': [`Take ${strength} with food`, 'For autoimmune conditions', 'Regular eye exams required'],
      'metformin': [`Take ${strength} with meals`, 'For blood sugar control', 'Start with low dose, increase gradually'],
      'lisinopril': [`Take ${strength} once daily`, 'For blood pressure and heart protection', 'Monitor kidney function'],
      'atorvastatin': [`Take ${strength} in the evening`, 'For cholesterol management', 'Avoid grapefruit juice'],
      'omeprazole': [`Take ${strength} before breakfast`, 'For stomach acid reduction', 'Course duration: 4-8 weeks'],
      'simvastatin': [`Take ${strength} in the evening`, 'For high cholesterol', 'Monitor liver function'],
      'losartan': [`Take ${strength} once daily`, 'For hypertension', 'Can cause dizziness initially']
    };

    for (const [key, value] of Object.entries(examples)) {
      if (genericName.includes(key) || packageName.includes(key)) {
        return value;
      }
    }

    // Generic examples based on dosage form
    if (dosageForm.includes('tablet')) {
      return [`Take ${strength} as prescribed`, 'Swallow with water', 'Take at consistent times'];
    } else if (dosageForm.includes('capsule')) {
      return [`Take ${strength} as directed`, 'Swallow whole, do not open', 'Take with adequate fluid'];
    } else if (dosageForm.includes('injection')) {
      return ['Administered by healthcare professional', 'Sterile injection technique required', 'Monitor injection site'];
    }

    return [`Use ${strength} as prescribed`, 'Follow healthcare provider instructions', 'Complete the full course'];
  };

  // Helper function to get cost-effectiveness info
  const getCostInfo = (drug) => {
    const publicPrice = parseFloat(drug['Package Price to Public']) || 0;
    const isThiqa = drug['Included in Thiqa/ ABM - other than 1&7- Drug Formulary'] === 'Yes';
    const isBasic = drug['Included In Basic Drug Formulary'] === 'Yes';
    const basicCopay = parseFloat(drug['Basic co-pay amount (package)']) || 0;

    if (isThiqa && isBasic) {
      return {
        coverage: 'Excellent',
        description: 'Covered by both Thiqa and Basic insurance',
        patientCost: basicCopay > 0 ? `AED ${basicCopay} copay` : 'Minimal copay'
      };
    } else if (isBasic) {
      return {
        coverage: 'Good',
        description: 'Covered by Basic insurance',
        patientCost: basicCopay > 0 ? `AED ${basicCopay} copay` : `AED ${publicPrice}`
      };
    } else if (isThiqa) {
      return {
        coverage: 'Good',
        description: 'Covered by Thiqa insurance',
        patientCost: 'Check with insurance provider'
      };
    } else {
      return {
        coverage: 'Limited',
        description: 'Not covered by major insurance plans',
        patientCost: `Full price: AED ${publicPrice}`
      };
    }
  };

  const searchICD10 = async () => {
    if (!diagnosisQuery.trim()) return;
    
    setLoading(true);
    try {
      const rawResults = await icd10DrugService.searchICD10(diagnosisQuery);
      const normalized = (rawResults || []).map(item => ({
        indication: item.indication || item.description || item.name || '',
        icd10_code: item.icd10_code || item.code || item.icd10 || '',
      }));
      setIcd10Results(normalized);
    } catch (error) {
      console.error('Error searching ICD-10:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectICD10 = (icd10) => {
    setSelectedICD10(icd10);
    setIcd10Results([]);
  };

  const searchDrugs = async () => {
    if (!drugQuery.trim()) return;
    
    setLoading(true);
    try {
      const results = await icd10DrugService.searchUAEDrugsWithICD10(
        drugQuery, 
        selectedICD10?.icd10_code
      );
      setDrugResults(results);
    } catch (error) {
      console.error('Error searching drugs:', error);
    } finally {
      setLoading(false);
    }
  };



  return (
    <VStack spacing={6} align="stretch">
      {/* ICD-10 Diagnosis Search */}
      <Card bg={cardBg} borderColor={borderColor}>
        <CardBody>
          <Text fontSize="lg" fontWeight="bold" mb={4}>
            Step 1: Search Diagnosis (ICD-10)
          </Text>
          <HStack>
            <Input
              placeholder="Enter diagnosis (e.g., Type 2 Diabetes)"
              value={diagnosisQuery}
              onChange={(e) => setDiagnosisQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchICD10()}
            />
            <Button colorScheme="blue" onClick={searchICD10} isLoading={loading}>
              Search
            </Button>
          </HStack>

          {/* Example searches */}
          {!selectedICD10 && icd10Results.length === 0 && (
            <Box mt={4} p={3} bg="blue.50" borderRadius="md">
              <Text fontSize="sm" fontWeight="semibold" mb={2} color="blue.700">
                💡 Try searching for:
              </Text>
              <HStack wrap="wrap" spacing={2}>
                {['Diabetes', 'Hypertension', 'Asthma', 'Depression', 'Migraine', 'Arthritis'].map((example) => (
                  <Badge
                    key={example}
                    colorScheme="blue"
                    cursor="pointer"
                    onClick={() => setDiagnosisQuery(example)}
                    _hover={{ bg: 'blue.200' }}
                  >
                    {example}
                  </Badge>
                ))}
              </HStack>
            </Box>
          )}

          {selectedICD10 && (
            <Box mt={4} p={3} bg="blue.50" borderRadius="md">
              <Text fontWeight="bold">Selected Diagnosis:</Text>
              <Text>{selectedICD10.indication}</Text>
              <Badge colorScheme="blue">{selectedICD10.icd10_code}</Badge>
            </Box>
          )}

          {icd10Results.length > 0 && (
            <VStack mt={4} spacing={3} align="stretch">
              {icd10Results.map((result, index) => {
                const examples = getICD10Examples(result.indication, result.icd10_code);
                return (
                  <Box
                    key={index}
                    p={4}
                    border="1px"
                    borderColor={borderColor}
                    borderRadius="md"
                    cursor="pointer"
                    _hover={{ bg: 'gray.50' }}
                    onClick={() => selectICD10(result)}
                  >
                    <VStack align="start" spacing={2}>
                      <HStack justify="space-between" w="full">
                        <Text fontSize="sm" fontWeight="bold">{result.indication}</Text>
                        <Badge fontSize="xs" colorScheme="blue">{result.icd10_code}</Badge>
                      </HStack>
                      
                      <Box>
                        <HStack mb={2}>
                          <Icon as={FaStethoscope} color="blue.500" boxSize={3} />
                          <Text fontSize="xs" fontWeight="semibold" color="blue.600">
                            Common Examples:
                          </Text>
                        </HStack>
                        <VStack align="start" spacing={1} pl={4}>
                          {examples.slice(0, 3).map((example, idx) => (
                            <Text key={idx} fontSize="xs" color="gray.600">
                              • {example}
                            </Text>
                          ))}
                        </VStack>
                      </Box>
                    </VStack>
                  </Box>
                );
              })}
            </VStack>
          )}
        </CardBody>
      </Card>

      {/* Drug Search */}
      <Card bg={cardBg} borderColor={borderColor}>
        <CardBody>
          <Text fontSize="lg" fontWeight="bold" mb={4}>
            Step 2: Search Medication
          </Text>
          <HStack>
            <Input
              placeholder="Enter medication name"
              value={drugQuery}
              onChange={(e) => setDrugQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchDrugs()}
            />
            <Button colorScheme="green" onClick={searchDrugs} isLoading={loading}>
              Search
            </Button>
          </HStack>

          {/* Example drug searches */}
          {drugResults.length === 0 && (
            <Box mt={4} p={3} bg="green.50" borderRadius="md">
              <Text fontSize="sm" fontWeight="semibold" mb={2} color="green.700">
                💊 Popular medications to search:
              </Text>
              <HStack wrap="wrap" spacing={2}>
                {['Metformin', 'Amlodipine', 'Pantoprazole', 'Paracetamol', 'Aspirin', 'Omeprazole'].map((example) => (
                  <Badge
                    key={example}
                    colorScheme="green"
                    cursor="pointer"
                    onClick={() => setDrugQuery(example)}
                    _hover={{ bg: 'green.200' }}
                  >
                    {example}
                  </Badge>
                ))}
              </HStack>
            </Box>
          )}

          {drugResults.length > 0 && (
            <VStack mt={4} spacing={4} align="stretch">
              {drugResults.map((drug, index) => {
                const examples = getDrugExamples(drug);
                const costInfo = getCostInfo(drug);
                return (
                  <Box
                    key={index}
                    p={5}
                    border="1px"
                    borderColor={borderColor}
                    borderRadius="lg"
                    bg={cardBg}
                    shadow="sm"
                  >
                    <VStack align="start" spacing={4}>
                      {/* Header with drug info and price */}
                      <HStack justify="space-between" align="start" w="full">
                        <VStack align="start" spacing={1}>
                          <Text fontWeight="bold" fontSize="md">{drug['Package Name']}</Text>
                          <Text fontSize="sm" color="gray.600">
                            {drug['Generic Name']} - {drug['Strength']}
                          </Text>
                          <Text fontSize="xs" color="gray.500">
                            {drug['Dosage Form']} • {drug['Package Size']}
                          </Text>
                          <HStack>
                            {drug['Included in Thiqa/ ABM - other than 1&7- Drug Formulary'] === 'Yes' && (
                              <Badge colorScheme="green">Thiqa</Badge>
                            )}
                            {drug['Included In Basic Drug Formulary'] === 'Yes' && (
                              <Badge colorScheme="blue">Basic</Badge>
                            )}
                            {drug.icd10Match && (
                              <Badge colorScheme="purple">ICD-10 Match</Badge>
                            )}
                          </HStack>
                        </VStack>
                        <VStack align="end" spacing={1}>
                          <Text fontWeight="bold" fontSize="lg" color="green.600">
                            AED {drug['Package Price to Public']}
                          </Text>
                          <Badge colorScheme={costInfo.coverage === 'Excellent' ? 'green' : costInfo.coverage === 'Good' ? 'blue' : 'orange'}>
                            {costInfo.coverage} Coverage
                          </Badge>
                        </VStack>
                      </HStack>

                      <Divider />

                      {/* Usage Examples */}
                      <Box w="full">
                        <HStack mb={3}>
                          <Icon as={FaPills} color="green.500" boxSize={4} />
                          <Text fontSize="sm" fontWeight="semibold" color="green.600">
                            Usage Examples:
                          </Text>
                        </HStack>
                        <VStack align="start" spacing={1} pl={5}>
                          {examples.map((example, idx) => (
                            <Text key={idx} fontSize="sm" color="gray.700">
                              • {example}
                            </Text>
                          ))}
                        </VStack>
                      </Box>

                      {/* Cost Information */}
                      <Box w="full">
                        <HStack mb={3}>
                          <Icon as={FaMoneyBillWave} color="blue.500" boxSize={4} />
                          <Text fontSize="sm" fontWeight="semibold" color="blue.600">
                            Cost Information:
                          </Text>
                        </HStack>
                        <VStack align="start" spacing={1} pl={5}>
                          <Text fontSize="sm" color="gray.700">
                            • {costInfo.description}
                          </Text>
                          <Text fontSize="sm" color="gray.700">
                            • Patient cost: {costInfo.patientCost}
                          </Text>
                          {drug['Package Price to Pharmacy'] && (
                            <Text fontSize="sm" color="gray.700">
                              • Pharmacy cost: AED {drug['Package Price to Pharmacy']}
                            </Text>
                          )}
                        </VStack>
                      </Box>

                      {/* Additional Info */}
                      <Box w="full">
                        <HStack mb={2}>
                          <Icon as={FaInfoCircle} color="orange.500" boxSize={3} />
                          <Text fontSize="xs" fontWeight="semibold" color="orange.600">
                            Important Notes:
                          </Text>
                        </HStack>
                        <VStack align="start" spacing={1} pl={4}>
                          <Text fontSize="xs" color="gray.600">
                            • Always consult healthcare provider before use
                          </Text>
                          <Text fontSize="xs" color="gray.600">
                            • Check for drug interactions and allergies
                          </Text>
                          {costInfo.coverage === 'Limited' && (
                            <Text fontSize="xs" color="orange.600">
                              • Consider generic alternatives for cost savings
                            </Text>
                          )}
                        </VStack>
                      </Box>
                    </VStack>
                  </Box>
                );
              })}
            </VStack>
          )}
        </CardBody>
      </Card>



      {loading && (
        <Box textAlign="center">
          <Spinner size="lg" />
        </Box>
      )}
    </VStack>
  );
};

export default ICD10DrugSearch;