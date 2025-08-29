import { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  VStack,
  HStack,
  Button,
  Icon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Input,
  Badge,
  useColorModeValue,
  useToast,
  Divider,
} from '@chakra-ui/react';
import { FaPills, FaStethoscope, FaTools } from 'react-icons/fa';
import ICD10DrugSearch from '../components/ICD10DrugSearch';
import icd10DrugService from '../services/icd10DrugService';

function DrugToICDMapper() {
  const [drugQuery, setDrugQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [icdResults, setIcdResults] = useState([]);
  const toast = useToast();
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const handleSearch = async () => {
    const q = drugQuery.trim();
    if (!q) return;
    setLoading(true);
    try {
      const mappings = await icd10DrugService.getICD10ForDrug(q);
      setIcdResults(mappings || []);
      if (!mappings || mappings.length === 0) {
        toast({
          title: 'No ICD-10 mappings found',
          description: 'Try a different drug name or generic name.',
          status: 'info',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch {
      toast({
        title: 'Search failed',
        description: 'There was an error fetching ICD-10 mappings.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <VStack spacing={6} align="stretch">
      <Card bg={cardBg} borderColor={borderColor}>
        <CardBody>
          <Text fontSize="lg" fontWeight="bold" mb={4}>
            Search ICD-10 by Drug
          </Text>
          <HStack>
            <Input
              placeholder="Enter drug name (e.g., Metformin)"
              value={drugQuery}
              onChange={(e) => setDrugQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button colorScheme="pharmgenius" onClick={handleSearch} isLoading={loading} leftIcon={<FaStethoscope />}>
              Search
            </Button>
          </HStack>

          {icdResults.length > 0 && (
            <VStack mt={4} spacing={3} align="stretch">
              {icdResults.map((item, idx) => (
                <Box
                  key={`${item.icd10_code || idx}-${idx}`}
                  p={4}
                  border="1px"
                  borderColor={borderColor}
                  borderRadius="md"
                  bg={cardBg}
                >
                  <VStack align="start" spacing={1}>
                    <HStack justify="space-between" w="full">
                      <Text fontWeight="bold" fontSize="md">{item.indication || item.description || 'ICD-10 Mapping'}</Text>
                      {item.icd10_code && <Badge colorScheme="purple">{item.icd10_code}</Badge>}
                    </HStack>
                    {item.confidence && (
                      <Text fontSize="sm" color="gray.600">Confidence: {Math.round(item.confidence * 100)}%</Text>
                    )}
                    {item.notes && (
                      <Text fontSize="sm" color="gray.600">{item.notes}</Text>
                    )}
                  </VStack>
                </Box>
              ))}
            </VStack>
          )}
        </CardBody>
      </Card>
    </VStack>
  );
}

export default function Tools() {
  const [tabIndex, setTabIndex] = useState(0);
  const heroBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const toolsList = [
    {
      id: 'icd-to-drug',
      title: 'ICD-10 → Drug Finder',
      description: 'Search ICD-10 diagnosis and find UAE formulary medications with coverage hints.',
      icon: FaPills,
      open: () => setTabIndex(0),
      cta: 'Open',
    },
    {
      id: 'drug-to-icd',
      title: 'Drug → ICD-10 Mapper',
      description: 'Map a medication name to relevant ICD-10 diagnosis codes/indications.',
      icon: FaStethoscope,
      open: () => setTabIndex(1),
      cta: 'Open',
    },
  ];

  return (
    <Container maxW="7xl" py={10}>
      <VStack align="stretch" spacing={8}>
        <Card bg={heroBg} border="1px" borderColor={borderColor}>
          <CardBody>
            <HStack spacing={4}>
              <Box
                w="10"
                h="10"
                bg="pharmgenius.600"
                borderRadius="lg"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Icon as={FaTools} color="white" />
              </Box>
              <VStack align="start" spacing={1}>
                <Heading size="lg">Tools Hub</Heading>
                <Text color="gray.600">
                  Quick access to diagnosis-drug mapping utilities.
                </Text>
              </VStack>
            </HStack>
          </CardBody>
        </Card>

        {/* Tools List (cards) */}
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          {toolsList.map((tool) => (
            <Card key={tool.id} border="1px" borderColor={borderColor}>
              <CardBody>
                <VStack align="start" spacing={3}>
                  <HStack spacing={3}>
                    <Box
                      w="8"
                      h="8"
                      bg="pharmgenius.500"
                      borderRadius="md"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Icon as={tool.icon} color="white" />
                    </Box>
                    <Heading size="md">{tool.title}</Heading>
                  </HStack>
                  <Text color="gray.600">{tool.description}</Text>
                  <Button colorScheme="pharmgenius" onClick={tool.open}>
                    {tool.cta}
                  </Button>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>

        <Divider />

        {/* Tabs for actual tools */}
        <Tabs index={tabIndex} onChange={setTabIndex} colorScheme="pharmgenius" variant="enclosed">
          <TabList>
            <Tab><HStack><Icon as={FaPills} /><Text>ICD-10 → Drug Finder</Text></HStack></Tab>
            <Tab><HStack><Icon as={FaStethoscope} /><Text>Drug → ICD-10 Mapper</Text></HStack></Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <ICD10DrugSearch />
            </TabPanel>
            <TabPanel>
              <DrugToICDMapper />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Container>
  );
}