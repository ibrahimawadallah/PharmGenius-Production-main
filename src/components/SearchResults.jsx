import {
  Box,
  Text,
  Heading,
  Card,
  CardHeader,
  CardBody,
  Tag,
  Flex,
  Spacer,
  SimpleGrid,
} from '@chakra-ui/react';
import { FaPills, FaFileMedicalAlt } from 'react-icons/fa';

// A helper to determine the result type based on available data keys
const getResultType = (item) => {
  if (item.drug_name || item.generic_name) return 'drug';
  if (item.code && item.description) return 'icd';
  // Add more checks for other types, e.g., formulary
  return 'unknown';
};

const DrugResult = ({ item }) => (
  <Card variant="outline">
    <CardHeader>
      <Flex align="center">
        <FaPills color="teal" />
        <Heading size="sm" ml={2}>{item.drug_name || item.name}</Heading>
        <Spacer />
        <Tag colorScheme="teal">{item.category || 'Drug'}</Tag>
      </Flex>
    </CardHeader>
    <CardBody>
      <Text><strong>Generic Name:</strong> {item.generic_name || 'N/A'}</Text>
      <Text><strong>Manufacturer:</strong> {item.manufacturer || 'N/A'}</Text>
    </CardBody>
  </Card>
);

const ICDResult = ({ item }) => (
  <Card variant="outline">
    <CardHeader>
      <Flex align="center">
        <FaFileMedicalAlt color="blue" />
        <Heading size="sm" ml={2}>{item.code}</Heading>
      </Flex>
    </CardHeader>
    <CardBody>
      <Text>{item.description}</Text>
    </CardBody>
  </Card>
);

const UnknownResult = ({ item }) => (
  <Card variant="outline" bg="gray.100">
    <CardBody>
      <Text fontFamily="monospace" fontSize="xs">{JSON.stringify(item, null, 2)}</Text>
    </CardBody>
  </Card>
);

const ResultItem = ({ item }) => {
  const type = getResultType(item);
  switch (type) {
    case 'drug':
      return <DrugResult item={item} />;
    case 'icd':
      return <ICDResult item={item} />;
    default:
      return <UnknownResult item={item} />;
  }
};

const SearchResults = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Box w="100%" p={5} borderWidth="1px" borderRadius="lg" textAlign="center" color="gray.500" bg="gray.50">
        <Text>Search results will appear here.</Text>
      </Box>
    );
  }

  return (
    <Box w="100%" p={5} borderWidth="1px" borderRadius="lg" bg="gray.50">
      <Flex mb={4} align="center">
        <Heading as="h3" size="md">Results</Heading>
        <Spacer />
        <Tag size="lg" colorScheme="blue" borderRadius="full">Found {data.length} item(s)</Tag>
      </Flex>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        {data.map((item, index) => (
          <ResultItem key={item.id || item.code || index} item={item} />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default SearchResults;