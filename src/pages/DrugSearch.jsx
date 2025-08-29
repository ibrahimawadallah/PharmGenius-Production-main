import React, { useState } from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  Card,
  CardBody,
  CardHeader,
  SimpleGrid,
  HStack,
  Badge,
  useColorModeValue,
  useToast,
  Spinner
} from '@chakra-ui/react';
import { FaSearch, FaPills } from 'react-icons/fa';

const DrugSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  const mockDrugs = [
    {
      id: 1,
      name: 'Paracetamol',
      genericName: 'Acetaminophen',
      category: 'Analgesic',
      description: 'Pain reliever and fever reducer',
      dosage: '500-1000mg every 4-6 hours'
    },
    {
      id: 2,
      name: 'Ibuprofen',
      genericName: 'Ibuprofen',
      category: 'NSAID',
      description: 'Anti-inflammatory pain reliever',
      dosage: '200-400mg every 4-6 hours'
    }
  ];

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: 'Please enter a search term',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      const filtered = mockDrugs.filter(drug => 
        drug.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        drug.genericName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      setSearchResults(filtered);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Container maxW="7xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading size="2xl" color="blue.600" mb={4}>
            Drug Information Database
          </Heading>
          <Text fontSize="lg" color={textColor} maxW="2xl" mx="auto">
            Search our comprehensive database of medications for detailed information.
          </Text>
        </Box>

        <Box maxW="2xl" mx="auto" w="full">
          <InputGroup size="lg">
            <InputLeftElement>
              <FaSearch color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Search by drug name or generic name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              bg={bgColor}
              border="1px"
              borderColor={borderColor}
            />
          </InputGroup>
          <Button
            colorScheme="blue"
            size="lg"
            w="full"
            mt={4}
            onClick={handleSearch}
            isLoading={isLoading}
            loadingText="Searching..."
            leftIcon={<FaSearch />}
          >
            Search Drugs
          </Button>
        </Box>

        {isLoading && (
          <Box textAlign="center" py={8}>
            <Spinner size="xl" color="blue.500" />
            <Text color={textColor} mt={4}>Searching...</Text>
          </Box>
        )}

        {searchResults.length > 0 && (
          <Box>
            <Heading size="lg" color="gray.800" mb={6}>
              Search Results ({searchResults.length})
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {searchResults.map((drug) => (
                <Card key={drug.id} bg={bgColor} border="1px" borderColor={borderColor}>
                  <CardHeader>
                    <HStack justify="space-between" align="flex-start">
                      <Box>
                        <Heading size="md" color="gray.800">{drug.name}</Heading>
                        <Text color="blue.600" fontSize="sm">{drug.genericName}</Text>
                      </Box>
                      <Badge colorScheme="blue">{drug.category}</Badge>
                    </HStack>
                  </CardHeader>
                  <CardBody pt={0}>
                    <VStack spacing={3} align="stretch">
                      <Text color={textColor}>{drug.description}</Text>
                      <Text fontWeight="semibold">Dosage: {drug.dosage}</Text>
                      <Button colorScheme="blue" variant="outline" size="sm">
                        View Details
                      </Button>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </Box>
        )}
      </VStack>
    </Container>
  );
};

export default DrugSearch;
