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
  Icon,
  HStack,
  Badge,
  useColorModeValue,
  Button,
  Image,
  Grid,
  GridItem,
  List,
  ListItem,
  ListIcon,
  Divider
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import {
  FaPills,
  FaUserMd,
  FaGraduationCap,
  FaBrain,
  FaBriefcase,
  FaChartLine,
  FaShieldAlt,
  FaMobile,
  FaSearch,
  FaBell,
  FaLock,
  FaGlobe,
  FaCheckCircle,
  FaArrowRight
} from 'react-icons/fa';

const Features = () => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  const coreFeatures = [
    {
      icon: FaPills,
      title: 'Comprehensive Drug Database',
      description: 'Access to 10,000+ medications with detailed information, interactions, side effects, and dosing guidelines.',
      benefits: [
        'Real-time drug interaction checking',
        'UAE formulary integration',
        'Evidence-based clinical data',
        'Mobile-optimized search'
      ],
      color: 'blue'
    },
    {
      icon: FaUserMd,
      title: 'Expert Consultations',
      description: 'Connect with licensed healthcare professionals for personalized medical advice and medication reviews.',
      benefits: [
        'Secure video consultations',
        'Qualified UAE-licensed providers',
        'Flexible scheduling options',
        'Comprehensive health records'
      ],
      color: 'green'
    },
    {
      icon: FaGraduationCap,
      title: 'Professional Learning',
      description: 'Continuing education modules for healthcare professionals and patients seeking health literacy.',
      benefits: [
        'Accredited CME courses',
        'Interactive learning modules',
        'Progress tracking',
        'Certificates upon completion'
      ],
      color: 'purple'
    },
    {
      icon: FaBrain,
      title: 'Mental Health Support',
      description: 'Comprehensive mental health resources, assessments, and professional counseling services.',
      benefits: [
        'Anonymous mental health screenings',
        'Professional counseling access',
        'Crisis intervention support',
        'Wellness tracking tools'
      ],
      color: 'teal'
    }
  ];

  const advancedFeatures = [
    {
      icon: FaSearch,
      title: 'AI-Powered Search',
      description: 'Intelligent search algorithms that understand medical terminology and provide relevant results.',
      color: 'orange'
    },
    {
      icon: FaShieldAlt,
      title: 'Enterprise Security',
      description: 'HIPAA-compliant security with end-to-end encryption and role-based access control.',
      color: 'red'
    },
    {
      icon: FaMobile,
      title: 'Mobile-First Design',
      description: 'Responsive design optimized for all devices with offline capabilities and push notifications.',
      color: 'cyan'
    },
    {
      icon: FaGlobe,
      title: 'Multi-Language Support',
      description: 'Available in Arabic and English with localization for UAE healthcare standards.',
      color: 'pink'
    }
  ];

  const technicalFeatures = [
    {
      title: 'Real-time Analytics',
      description: 'Comprehensive dashboards for healthcare providers and administrators',
      icon: FaChartLine
    },
    {
      title: 'API Integration',
      description: 'Seamless integration with existing healthcare systems and EHR platforms',
      icon: FaGlobe
    },
    {
      title: 'Cloud Infrastructure',
      description: 'Scalable cloud-based solution with 99.9% uptime guarantee',
      icon: FaShieldAlt
    }
  ];

  return (
    <Box py={16} bg={useColorModeValue('gray.50', 'gray.900')}>
      <Container maxW="7xl">
        <VStack spacing={16} align="stretch">
          {/* Header */}
          <Box textAlign="center">
            <Heading size="2xl" color="blue.600" mb={6}>
              Powerful Features for Modern Healthcare
            </Heading>
            <Text fontSize="xl" color={textColor} maxW="3xl" mx="auto">
              Discover how PharmGenius combines cutting-edge technology with healthcare expertise 
              to deliver a comprehensive solution for patients, providers, and organizations.
            </Text>
          </Box>

          {/* Core Features */}
          <Box>
            <Heading size="xl" textAlign="center" mb={12} color="gray.800">
              Core Healthcare Services
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
              {coreFeatures.map((feature, index) => (
                <Card key={index} bg={bgColor} border="1px" borderColor={borderColor} shadow="lg">
                  <CardHeader>
                    <HStack spacing={4}>
                      <Box
                        p={3}
                        borderRadius="full"
                        bg={`${feature.color}.100`}
                        color={`${feature.color}.600`}
                      >
                        <Icon as={feature.icon} w={6} h={6} />
                      </Box>
                      <Box>
                        <Heading size="md" color="gray.800">
                          {feature.title}
                        </Heading>
                        <Text color={textColor} mt={2}>
                          {feature.description}
                        </Text>
                      </Box>
                    </HStack>
                  </CardHeader>
                  <CardBody pt={0}>
                    <List spacing={2}>
                      {feature.benefits.map((benefit, idx) => (
                        <ListItem key={idx}>
                          <ListIcon as={FaCheckCircle} color="green.500" />
                          {benefit}
                        </ListItem>
                      ))}
                    </List>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </Box>

          {/* Advanced Features Grid */}
          <Box>
            <Heading size="xl" textAlign="center" mb={12} color="gray.800">
              Advanced Technology Features
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
              {advancedFeatures.map((feature, index) => (
                <Card key={index} bg={bgColor} border="1px" borderColor={borderColor} textAlign="center">
                  <CardBody>
                    <Box
                      p={4}
                      borderRadius="full"
                      bg={`${feature.color}.100`}
                      color={`${feature.color}.600`}
                      w="fit-content"
                      mx="auto"
                      mb={4}
                    >
                      <Icon as={feature.icon} w={8} h={8} />
                    </Box>
                    <Heading size="md" color="gray.800" mb={3}>
                      {feature.title}
                    </Heading>
                    <Text color={textColor} fontSize="sm">
                      {feature.description}
                    </Text>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </Box>

          {/* Technical Features */}
          <Box>
            <Heading size="xl" textAlign="center" mb={12} color="gray.800">
              Technical Excellence
            </Heading>
            <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={12} alignItems="center">
              <GridItem>
                <VStack spacing={6} align="stretch">
                  {technicalFeatures.map((feature, index) => (
                    <Box key={index} p={6} border="1px" borderColor={borderColor} borderRadius="lg">
                      <HStack spacing={4}>
                        <Icon as={feature.icon} w={6} h={6} color="blue.500" />
                        <Box>
                          <Heading size="md" color="gray.800">
                            {feature.title}
                          </Heading>
                          <Text color={textColor} mt={2}>
                            {feature.description}
                          </Text>
                        </Box>
                      </HStack>
                    </Box>
                  ))}
                </VStack>
              </GridItem>
              <GridItem>
                <Box textAlign="center">
                  <Image
                    src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop"
                    alt="Healthcare Technology"
                    borderRadius="lg"
                    shadow="xl"
                  />
                  <Text color={textColor} mt={4} fontSize="sm">
                    State-of-the-art healthcare technology infrastructure
                  </Text>
                </Box>
              </GridItem>
            </Grid>
          </Box>

          {/* Feature Comparison */}
          <Box>
            <Heading size="xl" textAlign="center" mb={12} color="gray.800">
              Feature Comparison
            </Heading>
            <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={8}>
              {[
                {
                  plan: 'Basic',
                  price: 'Free',
                  features: [
                    'Drug database access',
                    'Basic consultations',
                    'Health articles',
                    'Mobile app access'
                  ],
                  color: 'blue'
                },
                {
                  plan: 'Professional',
                  price: '$29/month',
                  features: [
                    'All Basic features',
                    'Unlimited consultations',
                    'Learning modules',
                    'Priority support',
                    'Analytics dashboard'
                  ],
                  color: 'green',
                  popular: true
                },
                {
                  plan: 'Enterprise',
                  price: 'Custom',
                  features: [
                    'All Professional features',
                    'Organization management',
                    'Custom integrations',
                    'Dedicated support',
                    'White-label options'
                  ],
                  color: 'purple'
                }
              ].map((plan, index) => (
                <Card key={index} bg={bgColor} border="1px" borderColor={borderColor} position="relative">
                  {plan.popular && (
                    <Badge
                      position="absolute"
                      top={4}
                      right={4}
                      colorScheme="green"
                      variant="solid"
                    >
                      Most Popular
                    </Badge>
                  )}
                  <CardHeader textAlign="center">
                    <Heading size="lg" color={`${plan.color}.600`}>
                      {plan.plan}
                    </Heading>
                    <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                      {plan.price}
                    </Text>
                  </CardHeader>
                  <CardBody>
                    <List spacing={3}>
                      {plan.features.map((feature, idx) => (
                        <ListItem key={idx}>
                          <ListIcon as={FaCheckCircle} color="green.500" />
                          {feature}
                        </ListItem>
                      ))}
                    </List>
                    <Button
                      colorScheme={plan.color}
                      variant={plan.popular ? 'solid' : 'outline'}
                      size="lg"
                      w="full"
                      mt={6}
                      as={RouterLink}
                      to="/pricing"
                    >
                      Get Started
                    </Button>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </Box>

          {/* CTA Section */}
          <Box textAlign="center" py={12}>
            <Heading size="xl" color="gray.800" mb={6}>
              Ready to Experience the Future of Healthcare?
            </Heading>
            <Text fontSize="lg" color={textColor} mb={8} maxW="2xl" mx="auto">
              Join thousands of healthcare professionals and patients who trust PharmGenius 
              for their healthcare technology needs.
            </Text>
            <HStack spacing={4} justify="center" flexWrap="wrap">
              <Button
                as={RouterLink}
                to="/register"
                colorScheme="blue"
                size="lg"
                leftIcon={<FaArrowRight />}
                px={8}
              >
                Start Free Trial
              </Button>
              <Button
                as={RouterLink}
                to="/contact"
                variant="outline"
                size="lg"
                px={8}
              >
                Schedule Demo
              </Button>
            </HStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default Features;
