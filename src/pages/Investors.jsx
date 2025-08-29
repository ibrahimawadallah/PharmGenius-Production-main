import React from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  Button,
  HStack,
  Badge,
  useColorModeValue,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Grid,
  GridItem,
  Image
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FaChartLine, FaUsers, FaGlobe, FaDownload, FaEnvelope } from 'react-icons/fa';

const Investors = () => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  const keyMetrics = [
    {
      label: 'Total Users',
      value: '10,000+',
      change: '+45%',
      changeType: 'increase',
      description: 'Healthcare professionals and patients'
    },
    {
      label: 'Revenue Growth',
      value: '$2.3M',
      change: '+78%',
      changeType: 'increase',
      description: 'Annual recurring revenue'
    },
    {
      label: 'Market Penetration',
      value: '15%',
      change: '+8%',
      changeType: 'increase',
      description: 'UAE healthcare market'
    },
    {
      label: 'Customer Retention',
      value: '94%',
      change: '+3%',
      changeType: 'increase',
      description: 'Annual retention rate'
    }
  ];

  const investmentHighlights = [
    {
      title: 'Rapid Market Growth',
      description: 'UAE healthcare market expected to reach $25B by 2025, growing at 12% CAGR',
      icon: FaChartLine,
      color: 'blue'
    },
    {
      title: 'Proven Technology',
      description: 'AI-powered platform with 99.9% uptime and enterprise-grade security',
      icon: FaGlobe,
      color: 'green'
    },
    {
      title: 'Strong Team',
      description: 'Experienced leadership with healthcare and technology expertise',
      icon: FaUsers,
      color: 'purple'
    }
  ];

  const documents = [
    {
      title: 'Investment Deck',
      description: 'Comprehensive overview of our business model and growth strategy',
      icon: FaDownload,
      color: 'blue'
    },
    {
      title: 'Financial Model',
      description: 'Detailed financial projections and key performance indicators',
      icon: FaChartLine,
      color: 'green'
    },
    {
      title: 'Market Analysis',
      description: 'In-depth analysis of UAE healthcare market opportunities',
      icon: FaGlobe,
      color: 'purple'
    }
  ];

  return (
    <Container maxW="7xl" py={8}>
      <VStack spacing={16} align="stretch">
        {/* Header */}
        <Box textAlign="center">
          <Heading size="2xl" color="blue.600" mb={6}>
            Investor Relations
          </Heading>
          <Text fontSize="xl" color={textColor} maxW="3xl" mx="auto">
            Join us in transforming healthcare delivery in the UAE and beyond. 
            Discover investment opportunities in a rapidly growing market.
          </Text>
        </Box>

        {/* Key Metrics */}
        <Box>
          <Heading size="xl" textAlign="center" mb={12} color="gray.800">
            Key Performance Metrics
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
            {keyMetrics.map((metric, index) => (
              <Card key={index} bg={bgColor} border="1px" borderColor={borderColor} textAlign="center">
                <CardBody>
                  <Stat>
                    <StatLabel color="gray.600" fontSize="lg">
                      {metric.label}
                    </StatLabel>
                    <StatNumber fontSize="3xl" fontWeight="bold" color="blue.600">
                      {metric.value}
                    </StatNumber>
                    <StatHelpText>
                      <StatArrow type="increase" />
                      {metric.change}
                    </StatHelpText>
                    <Text color={textColor} fontSize="sm" mt={2}>
                      {metric.description}
                    </Text>
                  </Stat>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </Box>

        {/* Investment Highlights */}
        <Box>
          <Heading size="xl" textAlign="center" mb={12} color="gray.800">
            Investment Highlights
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
            {investmentHighlights.map((highlight, index) => (
              <Card key={index} bg={bgColor} border="1px" borderColor={borderColor} shadow="lg">
                <CardBody textAlign="center">
                  <Box
                    p={4}
                    borderRadius="full"
                    bg={`${highlight.color}.100`}
                    color={`${highlight.color}.600`}
                    w="fit-content"
                    mx="auto"
                    mb={4}
                  >
                    <highlight.icon size={32} />
                  </Box>
                  <Heading size="md" color="gray.800" mb={3}>
                    {highlight.title}
                  </Heading>
                  <Text color={textColor}>
                    {highlight.description}
                  </Text>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </Box>

        {/* Market Opportunity */}
        <Box>
          <Heading size="xl" textAlign="center" mb={12} color="gray.800">
            Market Opportunity
          </Heading>
          <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={12} alignItems="center">
            <GridItem>
              <VStack spacing={6} align="stretch">
                <Heading size="lg" color="gray.800">
                  UAE Healthcare Market
                </Heading>
                <Text color={textColor} fontSize="lg">
                  The UAE healthcare market is experiencing unprecedented growth, driven by:
                </Text>
                <VStack spacing={3} align="stretch">
                  <Text color={textColor}>• Government investment in healthcare infrastructure</Text>
                  <Text color={textColor}>• Growing demand for digital health solutions</Text>
                  <Text color={textColor}>• Increasing healthcare spending per capita</Text>
                  <Text color={textColor}>• Strategic location for regional expansion</Text>
                </VStack>
                <Text color={textColor} fontSize="lg">
                  PharmGenius is positioned to capture a significant share of this $25B market opportunity.
                </Text>
              </VStack>
            </GridItem>
            <GridItem>
              <Box textAlign="center">
                <Image
                  src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop"
                  alt="Healthcare Market Growth"
                  borderRadius="lg"
                  shadow="xl"
                />
              </Box>
            </GridItem>
          </Grid>
        </Box>

        {/* Investment Documents */}
        <Box>
          <Heading size="xl" textAlign="center" mb={12} color="gray.800">
            Investment Documents
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            {documents.map((doc, index) => (
              <Card key={index} bg={bgColor} border="1px" borderColor={borderColor}>
                <CardBody textAlign="center">
                  <Box
                    p={4}
                    borderRadius="full"
                    bg={`${doc.color}.100`}
                    color={`${doc.color}.600`}
                    w="fit-content"
                    mx="auto"
                    mb={4}
                  >
                    <doc.icon size={24} />
                  </Box>
                  <Heading size="md" color="gray.800" mb={3}>
                    {doc.title}
                  </Heading>
                  <Text color={textColor} fontSize="sm" mb={4}>
                    {doc.description}
                  </Text>
                  <Button
                    colorScheme={doc.color}
                    variant="outline"
                    size="sm"
                    w="full"
                    leftIcon={<FaDownload />}
                  >
                    Download
                  </Button>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </Box>

        {/* Contact Section */}
        <Box textAlign="center" py={12}>
          <Heading size="xl" color="gray.800" mb={6}>
            Ready to Invest?
          </Heading>
          <Text fontSize="lg" color={textColor} mb={8} maxW="2xl" mx="auto">
            Join us in revolutionizing healthcare delivery. Contact our investment team 
            to learn more about investment opportunities and schedule a meeting.
          </Text>
          <HStack spacing={4} justify="center" flexWrap="wrap">
            <Button
              as={RouterLink}
              to="/contact"
              colorScheme="blue"
              size="lg"
              leftIcon={<FaEnvelope />}
              px={8}
            >
              Contact Investment Team
            </Button>
            <Button
              variant="outline"
              size="lg"
              px={8}
            >
              Schedule Meeting
            </Button>
          </HStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default Investors;
