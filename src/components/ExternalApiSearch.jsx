import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Input,
  Button,
  Text,
  Heading,
  Badge,
  Card,
  CardBody,
  CardHeader,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Spinner,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  useToast,
  Checkbox,
  CheckboxGroup,
  Stack,
  Divider,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText
} from '@chakra-ui/react';
import { SearchIcon, ExternalLinkIcon, InfoIcon } from '@chakra-ui/icons';
import externalApiService from '../services/externalApiService';

const ExternalApiSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [selectedApis, setSelectedApis] = useState(['openfda', 'rxnorm', 'chembl']);
  const [apiHealth, setApiHealth] = useState(null);
  const toast = useToast();

  useEffect(() => {
    checkApiHealth();
  }, []);

  const checkApiHealth = async () => {
    const health = await externalApiService.checkApiHealth();
    setApiHealth(health);
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast({
        title: 'Search term required',
        description: 'Please enter a drug name to search',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    try {
      const enhancedInfo = await externalApiService.getEnhancedDrugInfo(searchTerm);
      
      if (enhancedInfo.success) {
        setResults(enhancedInfo.data);
        toast({
          title: 'Search completed',
          description: `Found information from multiple pharmaceutical databases`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error(enhancedInfo.error);
      }
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: 'Search failed',
        description: error.message || 'Failed to search pharmaceutical databases',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const renderOpenFDAResults = (openFDAData) => {
    if (!openFDAData?.labels?.length) {
      return <Text color="gray.500">No FDA label information found</Text>;
    }

    return (
      <VStack spacing={4} align="stretch">
        {openFDAData.labels.map((label, index) => (
          <Card key={index} variant="outline">
            <CardHeader>
              <HStack justify="space-between">
                <Heading size="sm">{label.brandName}</Heading>
                <Badge colorScheme="blue">FDA Approved</Badge>
              </HStack>
            </CardHeader>
            <CardBody>
              <VStack spacing={3} align="stretch">
                <Box>
                  <Text fontWeight="bold">Generic Name:</Text>
                  <Text>{label.genericName}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Manufacturer:</Text>
                  <Text>{label.manufacturer}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Dosage Form:</Text>
                  <Text>{label.dosageForm}</Text>
                </Box>
                {label.indications && (
                  <Box>
                    <Text fontWeight="bold">Indications:</Text>
                    <Text fontSize="sm" noOfLines={3}>{label.indications}</Text>
                  </Box>
                )}
                {label.contraindications && (
                  <Box>
                    <Text fontWeight="bold">Contraindications:</Text>
                    <Text fontSize="sm" noOfLines={3}>{label.contraindications}</Text>
                  </Box>
                )}
              </VStack>
            </CardBody>
          </Card>
        ))}
      </VStack>
    );
  };

  const renderRxNormResults = (rxNormData) => {
    if (!rxNormData?.drugs?.length) {
      return <Text color="gray.500">No RxNorm standardized names found</Text>;
    }

    return (
      <VStack spacing={4} align="stretch">
        {rxNormData.drugs.slice(0, 10).map((drug, index) => (
          <Card key={index} variant="outline">
            <CardBody>
              <HStack justify="space-between">
                <VStack align="start" spacing={1}>
                  <Text fontWeight="bold">{drug.name}</Text>
                  <Badge colorScheme="green">{drug.type}</Badge>
                  <Text fontSize="sm" color="gray.600">RxCUI: {drug.rxcui}</Text>
                </VStack>
                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={<ExternalLinkIcon />}
                  onClick={() => window.open(`https://mor.nlm.nih.gov/RxNav/search?searchBy=RXCUI&searchTerm=${drug.rxcui}`, '_blank')}
                >
                  View Details
                </Button>
              </HStack>
            </CardBody>
          </Card>
        ))}
      </VStack>
    );
  };

  const renderChEMBLResults = (chemblData) => {
    if (!chemblData?.molecules?.length) {
      return <Text color="gray.500">No ChEMBL molecular data found</Text>;
    }

    return (
      <VStack spacing={4} align="stretch">
        {chemblData.molecules.map((molecule, index) => (
          <Card key={index} variant="outline">
            <CardHeader>
              <HStack justify="space-between">
                <Heading size="sm">{molecule.prefName}</Heading>
                <Badge colorScheme="purple">ChEMBL</Badge>
              </HStack>
            </CardHeader>
            <CardBody>
              <SimpleGrid columns={2} spacing={4}>
                <Stat>
                  <StatLabel>ChEMBL ID</StatLabel>
                  <StatNumber fontSize="md">{molecule.chemblId}</StatNumber>
                </Stat>
                <Stat>
                  <StatLabel>Molecular Formula</StatLabel>
                  <StatNumber fontSize="md">{molecule.molecularFormula}</StatNumber>
                </Stat>
                <Stat>
                  <StatLabel>Molecular Weight</StatLabel>
                  <StatNumber fontSize="md">{molecule.molecularWeight}</StatNumber>
                  <StatHelpText>g/mol</StatHelpText>
                </Stat>
                <Stat>
                  <StatLabel>Max Phase</StatLabel>
                  <StatNumber fontSize="md">{molecule.maxPhase}</StatNumber>
                  <StatHelpText>Clinical development</StatHelpText>
                </Stat>
              </SimpleGrid>
              <Button
                mt={4}
                size="sm"
                variant="outline"
                leftIcon={<ExternalLinkIcon />}
                onClick={() => window.open(`https://www.ebi.ac.uk/chembl/compound_report_card/${molecule.chemblId}`, '_blank')}
              >
                View in ChEMBL
              </Button>
            </CardBody>
          </Card>
        ))}
      </VStack>
    );
  };

  const renderSummary = (summary) => {
    return (
      <SimpleGrid columns={2} spacing={4} mb={6}>
        <Stat>
          <StatLabel>FDA Approved</StatLabel>
          <StatNumber>
            <Badge colorScheme={summary.fdaApproved ? 'green' : 'gray'}>
              {summary.fdaApproved ? 'Yes' : 'No'}
            </Badge>
          </StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Molecular Data</StatLabel>
          <StatNumber>
            <Badge colorScheme={summary.molecularData ? 'purple' : 'gray'}>
              {summary.molecularData ? 'Available' : 'Not Found'}
            </Badge>
          </StatNumber>
        </Stat>
      </SimpleGrid>
    );
  };

  return (
    <Box p={6} maxW="1200px" mx="auto">
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading size="lg" mb={2}>
            External Pharmaceutical APIs
          </Heading>
          <Text color="gray.600">
            Search across OpenFDA, RxNorm, and ChEMBL databases for comprehensive drug information
          </Text>
        </Box>

        {/* API Health Status */}
        {apiHealth && (
          <Alert status={apiHealth.success ? 'success' : 'warning'}>
            <AlertIcon />
            <AlertTitle>API Status:</AlertTitle>
            <AlertDescription>
              {apiHealth.success ? 'All external APIs are accessible' : 'Some APIs may be unavailable'}
            </AlertDescription>
          </Alert>
        )}

        {/* Search Interface */}
        <Card>
          <CardBody>
            <VStack spacing={4}>
              <HStack w="full">
                <Input
                  placeholder="Enter drug name (e.g., aspirin, metformin, ibuprofen)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  size="lg"
                />
                <Button
                  leftIcon={<SearchIcon />}
                  colorScheme="blue"
                  onClick={handleSearch}
                  isLoading={loading}
                  loadingText="Searching..."
                  size="lg"
                >
                  Search
                </Button>
              </HStack>

              <CheckboxGroup value={selectedApis} onChange={setSelectedApis}>
                <Stack direction="row" spacing={4}>
                  <Checkbox value="openfda">OpenFDA</Checkbox>
                  <Checkbox value="rxnorm">RxNorm</Checkbox>
                  <Checkbox value="chembl">ChEMBL</Checkbox>
                </Stack>
              </CheckboxGroup>
            </VStack>
          </CardBody>
        </Card>

        {/* Loading State */}
        {loading && (
          <Box textAlign="center" py={8}>
            <Spinner size="xl" color="blue.500" />
            <Text mt={4}>Searching pharmaceutical databases...</Text>
          </Box>
        )}

        {/* Results */}
        {results && !loading && (
          <Card>
            <CardHeader>
              <Heading size="md">Search Results for "{results.drugName}"</Heading>
              <Text fontSize="sm" color="gray.500">
                Last updated: {new Date(results.timestamp).toLocaleString()}
              </Text>
            </CardHeader>
            <CardBody>
              {/* Summary */}
              {renderSummary(results.summary)}

              <Divider mb={6} />

              {/* Detailed Results */}
              <Tabs variant="enclosed">
                <TabList>
                  <Tab>
                    <HStack>
                      <Text>OpenFDA</Text>
                      <Badge colorScheme="blue" variant="subtle">
                        {results.sources.openFDA?.labels?.length || 0}
                      </Badge>
                    </HStack>
                  </Tab>
                  <Tab>
                    <HStack>
                      <Text>RxNorm</Text>
                      <Badge colorScheme="green" variant="subtle">
                        {results.sources.rxNorm?.drugs?.length || 0}
                      </Badge>
                    </HStack>
                  </Tab>
                  <Tab>
                    <HStack>
                      <Text>ChEMBL</Text>
                      <Badge colorScheme="purple" variant="subtle">
                        {results.sources.chembl?.molecules?.length || 0}
                      </Badge>
                    </HStack>
                  </Tab>
                </TabList>

                <TabPanels>
                  <TabPanel>
                    {renderOpenFDAResults(results.sources.openFDA)}
                  </TabPanel>
                  <TabPanel>
                    {renderRxNormResults(results.sources.rxNorm)}
                  </TabPanel>
                  <TabPanel>
                    {renderChEMBLResults(results.sources.chembl)}
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </CardBody>
          </Card>
        )}

        {/* Information Box */}
        <Alert status="info">
          <AlertIcon />
          <Box>
            <AlertTitle>About External APIs</AlertTitle>
            <AlertDescription>
              <VStack align="start" spacing={2} mt={2}>
                <Text><strong>OpenFDA:</strong> Official FDA drug labeling and safety information</Text>
                <Text><strong>RxNorm:</strong> Standardized drug naming and vocabulary from NIH</Text>
                <Text><strong>ChEMBL:</strong> Bioactive molecules and drug discovery data from EBI</Text>
              </VStack>
            </AlertDescription>
          </Box>
        </Alert>
      </VStack>
    </Box>
  );
};

export default ExternalApiSearch;