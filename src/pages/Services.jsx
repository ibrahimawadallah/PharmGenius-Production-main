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
  useColorModeValue,
  Button,
  List,
  ListItem,
  ListIcon
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import {
  FaPills,
  FaUserMd,
  FaGraduationCap,
  FaBrain,
  FaCheckCircle,
  FaArrowRight
} from 'react-icons/fa';

const Services = () => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  const services = [
    {
      icon: FaPills,
      title: 'Drug Information Hub',
      description: 'Comprehensive medication database with real-time interaction checking.',
      features: [
        '10,000+ drug database',
        'Real-time interaction checking',
        'UAE formulary integration',
        'Evidence-based dosing guidelines'
      ],
      color: 'blue'
    },
    {
      icon: FaUserMd,
      title: 'Expert Consultations',
      description: 'Connect with licensed healthcare professionals for personalized care.',
      features: [
        'Video consultations',
        'UAE-licensed providers',
        'Flexible scheduling',
        'Secure messaging'
      ],
      color: 'green'
    },
    {
      icon: FaGraduationCap,
      title: 'Learning & Development',
      description: 'Continuing education modules for healthcare professionals.',
      features: [
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
      description: 'Comprehensive mental health resources and counseling.',
      features: [
        'Mental health screenings',
        'Professional counseling',
        'Crisis intervention',
        'Wellness tracking'
      ],
      color: 'teal'
    }
  ];

  return (
    <Box py={16} bg={useColorModeValue('gray.50', 'gray.900')}>
      <Container maxW="7xl">
        <VStack spacing={16} align="stretch">
          {/* Header */}
          <Box textAlign="center">
            <Heading size="2xl" color="blue.600" mb={6}>
              Comprehensive Healthcare Services
            </Heading>
            <Text fontSize="xl" color={textColor} maxW="3xl" mx="auto">
              Discover our range of innovative healthcare services designed to improve patient outcomes 
              and enhance professional development.
            </Text>
          </Box>

          {/* Services Grid */}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
            {services.map((service, index) => (
              <Card key={index} bg={bgColor} border="1px" borderColor={borderColor} shadow="lg">
                <CardHeader>
                  <HStack spacing={4}>
                    <Box
                      p={3}
                      borderRadius="full"
                      bg={`${service.color}.100`}
                      color={`${service.color}.600`}
                    >
                      <Icon as={service.icon} w={6} h={6} />
                    </Box>
                    <Box>
                      <Heading size="md" color="gray.800">
                        {service.title}
                      </Heading>
                      <Text color={textColor} mt={2}>
                        {service.description}
                      </Text>
                    </Box>
                  </HStack>
                </CardHeader>
                <CardBody pt={0}>
                  <List spacing={2} mb={6}>
                    {service.features.map((feature, idx) => (
                      <ListItem key={idx}>
                        <ListIcon as={FaCheckCircle} color="green.500" />
                        {feature}
                      </ListItem>
                    ))}
                  </List>
                  <Button
                    colorScheme={service.color}
                    size="lg"
                    rightIcon={<FaArrowRight />}
                    w="full"
                  >
                    Learn More
                  </Button>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>

          {/* CTA Section */}
          <Box textAlign="center" py={12}>
            <Heading size="xl" color="gray.800" mb={6}>
              Ready to Get Started?
            </Heading>
            <Text fontSize="lg" color={textColor} mb={8} maxW="2xl" mx="auto">
              Contact our team to learn more about our services and how we can help 
              improve healthcare delivery in your organization.
            </Text>
            <HStack spacing={4} justify="center" flexWrap="wrap">
              <Button
                as={RouterLink}
                to="/contact"
                colorScheme="blue"
                size="lg"
                leftIcon={<FaArrowRight />}
                px={8}
              >
                Get Started
              </Button>
              <Button
                as={RouterLink}
                to="/pricing"
                variant="outline"
                size="lg"
                px={8}
              >
                View Pricing
              </Button>
            </HStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default Services;
