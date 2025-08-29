import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Card,
  CardBody,
  Badge,
  Button,
  Divider,
  SimpleGrid,
  List,
  ListItem,
  ListIcon,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Link,
  Spinner,
  Alert,
  AlertIcon,
  useColorModeValue,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Code,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer
} from '@chakra-ui/react';
import { 
  FaCheckCircle, 
  FaExternalLinkAlt, 
  FaBook, 
  FaCode, 
  FaPlay,
  FaInfoCircle,
  FaTools,
  FaGraduationCap
} from 'react-icons/fa';
import featureService from '../services/featureService';

const FeatureContent = ({ featureId, user }) => {
  const [feature, setFeature] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    loadFeatureContent();
  }, [featureId]);

  const loadFeatureContent = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const featureData = await featureService.getFeatureContent(featureId);
      if (featureData) {
        setFeature(featureData);
      } else {
        setError('Feature not found');
      }
    } catch (err) {
      setError('Failed to load feature content');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" color="pharmgenius.500" />
        <Text mt={4} color="gray.600">Loading feature content...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  if (!feature) {
    return (
      <Alert status="warning">
        <AlertIcon />
        Feature content not available
      </Alert>
    );
  }

  const hasPermission = feature.permissions.some(permission => 
    user.permissions.includes(permission)
  );

  if (!hasPermission) {
    return (
      <Alert status="warning">
        <AlertIcon />
        You don't have permission to access this feature. Contact your administrator for access.
      </Alert>
    );
  }

  return (
    <VStack spacing={6} align="stretch">
      {/* Feature Header */}
      <Card bg={cardBg} borderColor={borderColor}>
        <CardBody>
          <VStack spacing={4} align="start">
            <HStack spacing={4}>
              <Badge colorScheme="pharmgenius" fontSize="md" px={3} py={1}>
                {feature.category}
              </Badge>
              <Badge colorScheme="green" variant="outline">
                Active
              </Badge>
            </HStack>
            
            <VStack spacing={2} align="start">
              <Heading size="lg" color="pharmgenius.600">
                {feature.content.title}
              </Heading>
              <Text color="gray.600" fontSize="lg">
                {feature.content.subtitle}
              </Text>
            </VStack>

            <Text color="gray.700">
              {feature.description}
            </Text>
          </VStack>
        </CardBody>
      </Card>

      {/* Feature Content Tabs */}
      <Tabs colorScheme="pharmgenius" variant="enclosed">
        <TabList>
          <Tab>
            <HStack spacing={2}>
              <FaInfoCircle />
              <Text>Overview</Text>
            </HStack>
          </Tab>
          <Tab>
            <HStack spacing={2}>
              <FaCode />
              <Text>API Resources</Text>
            </HStack>
          </Tab>
          <Tab>
            <HStack spacing={2}>
              <FaGraduationCap />
              <Text>Tutorials</Text>
            </HStack>
          </Tab>
          <Tab>
            <HStack spacing={2}>
              <FaBook />
              <Text>Documentation</Text>
            </HStack>
          </Tab>
        </TabList>

        <TabPanels>
          {/* Overview Tab */}
          <TabPanel px={0}>
            <VStack spacing={6} align="stretch">
              {/* Features List */}
              <Card bg={cardBg} borderColor={borderColor}>
                <CardBody>
                  <VStack spacing={4} align="start">
                    <Heading size="md" color="gray.700">
                      Key Features
                    </Heading>
                    <List spacing={3}>
                      {feature.content.features.map((item, index) => (
                        <ListItem key={index}>
                          <ListIcon as={FaCheckCircle} color="green.500" />
                          {item}
                        </ListItem>
                      ))}
                    </List>
                  </VStack>
                </CardBody>
              </Card>

              {/* Quick Actions */}
              <Card bg={cardBg} borderColor={borderColor}>
                <CardBody>
                  <VStack spacing={4} align="start">
                    <Heading size="md" color="gray.700">
                      Quick Actions
                    </Heading>
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4} width="full">
                      <Button
                        leftIcon={<FaPlay />}
                        colorScheme="pharmgenius"
                        variant="outline"
                        size="md"
                      >
                        Get Started
                      </Button>
                      <Button
                        leftIcon={<FaBook />}
                        colorScheme="blue"
                        variant="outline"
                        size="md"
                      >
                        View Documentation
                      </Button>
                      <Button
                        leftIcon={<FaTools />}
                        colorScheme="gray"
                        variant="outline"
                        size="md"
                      >
                        Settings
                      </Button>
                    </SimpleGrid>
                  </VStack>
                </CardBody>
              </Card>
            </VStack>
          </TabPanel>

          {/* API Resources Tab */}
          <TabPanel px={0}>
            <VStack spacing={6} align="stretch">
              <Card bg={cardBg} borderColor={borderColor}>
                <CardBody>
                  <VStack spacing={4} align="start">
                    <Heading size="md" color="gray.700">
                      API Endpoints
                    </Heading>
                    <TableContainer width="full">
                      <Table variant="simple" size="sm">
                        <Thead>
                          <Tr>
                            <Th>Endpoint</Th>
                            <Th>Method</Th>
                            <Th>Description</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {feature.resources.endpoints.map((endpoint, index) => (
                            <Tr key={index}>
                              <Td>
                                <Code colorScheme="blue" fontSize="sm">
                                  {endpoint}
                                </Code>
                              </Td>
                              <Td>
                                <Badge colorScheme="green" size="sm">
                                  GET
                                </Badge>
                              </Td>
                              <Td>
                                <Text fontSize="sm" color="gray.600">
                                  API endpoint for {feature.name.toLowerCase()}
                                </Text>
                              </Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </VStack>
                </CardBody>
              </Card>

              <Card bg={cardBg} borderColor={borderColor}>
                <CardBody>
                  <VStack spacing={4} align="start">
                    <Heading size="md" color="gray.700">
                      Integration Examples
                    </Heading>
                    <Box
                      bg="gray.50"
                      p={4}
                      borderRadius="md"
                      width="full"
                      fontFamily="mono"
                      fontSize="sm"
                    >
                      <Text color="gray.700">
                        {`// Example API call for ${feature.name}`}
                      </Text>
                      <Text color="blue.600">
                        {`fetch('${feature.resources.endpoints[0]}')`}
                      </Text>
                      <Text color="gray.700">
                        {`  .then(response => response.json())`}
                      </Text>
                      <Text color="gray.700">
                        {`  .then(data => console.log(data));`}
                      </Text>
                    </Box>
                  </VStack>
                </CardBody>
              </Card>
            </VStack>
          </TabPanel>

          {/* Tutorials Tab */}
          <TabPanel px={0}>
            <Card bg={cardBg} borderColor={borderColor}>
              <CardBody>
                <VStack spacing={4} align="start">
                  <Heading size="md" color="gray.700">
                    Learning Resources
                  </Heading>
                  <Accordion allowMultiple width="full">
                    {feature.resources.tutorials.map((tutorial, index) => (
                      <AccordionItem key={index}>
                        <AccordionButton>
                          <Box flex="1" textAlign="left">
                            <HStack spacing={3}>
                              <FaGraduationCap color="var(--chakra-colors-pharmgenius-500)" />
                              <Text fontWeight="medium">{tutorial.title}</Text>
                            </HStack>
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                        <AccordionPanel pb={4}>
                          <VStack spacing={3} align="start">
                            <Text color="gray.600">
                              Step-by-step tutorial for {tutorial.title.toLowerCase()}
                            </Text>
                            <HStack spacing={4}>
                              <Button
                                as={Link}
                                href={tutorial.url}
                                leftIcon={<FaExternalLinkAlt />}
                                colorScheme="pharmgenius"
                                size="sm"
                                variant="outline"
                                isExternal
                              >
                                Open Tutorial
                              </Button>
                              <Badge colorScheme="blue">Beginner</Badge>
                            </HStack>
                          </VStack>
                        </AccordionPanel>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </VStack>
              </CardBody>
            </Card>
          </TabPanel>

          {/* Documentation Tab */}
          <TabPanel px={0}>
            <Card bg={cardBg} borderColor={borderColor}>
              <CardBody>
                <VStack spacing={4} align="start">
                  <Heading size="md" color="gray.700">
                    Documentation & Resources
                  </Heading>
                  
                  <VStack spacing={4} align="start" width="full">
                    <HStack spacing={4} p={4} bg="blue.50" borderRadius="md" width="full">
                      <FaBook color="var(--chakra-colors-blue-500)" />
                      <VStack spacing={1} align="start" flex={1}>
                        <Text fontWeight="medium" color="blue.700">
                          Official Documentation
                        </Text>
                        <Text fontSize="sm" color="blue.600">
                          Comprehensive guide for {feature.name}
                        </Text>
                      </VStack>
                      <Button
                        as={Link}
                        href={feature.resources.documentation}
                        leftIcon={<FaExternalLinkAlt />}
                        colorScheme="blue"
                        size="sm"
                        isExternal
                      >
                        View Docs
                      </Button>
                    </HStack>

                    <Divider />

                    <VStack spacing={3} align="start" width="full">
                      <Text fontWeight="medium" color="gray.700">
                        Additional Resources
                      </Text>
                      <List spacing={2}>
                        <ListItem>
                          <ListIcon as={FaCheckCircle} color="green.500" />
                          <Link color="pharmgenius.500" href="#" isExternal>
                            Best Practices Guide <FaExternalLinkAlt style={{ display: 'inline', marginLeft: '4px' }} />
                          </Link>
                        </ListItem>
                        <ListItem>
                          <ListIcon as={FaCheckCircle} color="green.500" />
                          <Link color="pharmgenius.500" href="#" isExternal>
                            Troubleshooting Guide <FaExternalLinkAlt style={{ display: 'inline', marginLeft: '4px' }} />
                          </Link>
                        </ListItem>
                        <ListItem>
                          <ListIcon as={FaCheckCircle} color="green.500" />
                          <Link color="pharmgenius.500" href="#" isExternal>
                            FAQ & Common Issues <FaExternalLinkAlt style={{ display: 'inline', marginLeft: '4px' }} />
                          </Link>
                        </ListItem>
                      </List>
                    </VStack>
                  </VStack>
                </VStack>
              </CardBody>
            </Card>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  );
};

export default FeatureContent;