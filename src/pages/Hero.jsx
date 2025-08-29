import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Stack,
  Grid,
  GridItem,
  Image,
  Badge,
  Flex,
  Icon,
  useColorModeValue,
  VStack,
  HStack,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from '@chakra-ui/react';
import { 
  FaShieldAlt, 
  FaUserMd, 
  FaGraduationCap, 
  FaHeart,
  FaCheckCircle,
  FaArrowRight,
  FaPlay,
  FaStar
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();
  const bgColor = useColorModeValue('white', 'gray.900');
  const textColor = useColorModeValue('gray.800', 'white');
  const accentColor = useColorModeValue('brand.500', 'brand.400');

  const handleGetStarted = () => {
    navigate('/register');
  };

  const handleLearnMore = () => {
    navigate('/features');
  };

  const handleWatchDemo = () => {
    // Open demo video modal or navigate to demo page
    console.log('Opening demo video...');
  };

  return (
    <Box bg={bgColor} minH="100vh">
      {/* Hero Section */}
      <Container maxW="7xl" py={{ base: 10, md: 20 }}>
        <Grid
          templateColumns={{ base: '1fr', lg: '1fr 1fr' }}
          gap={{ base: 10, lg: 20 }}
          alignItems="center"
          minH="80vh"
        >
          {/* Left Column - Content */}
          <GridItem>
            <VStack spacing={8} align="start">
              {/* Badge */}
              <Badge
                colorScheme="brand"
                variant="subtle"
                px={4}
                py={2}
                borderRadius="full"
                fontSize="sm"
                fontWeight="semibold"
              >
                🚀 Trusted by 10,000+ Healthcare Professionals
              </Badge>

              {/* Main Heading */}
              <Heading
                as="h1"
                size="2xl"
                fontWeight="black"
                lineHeight="1.1"
                color={textColor}
                fontFamily="heading"
              >
                The Complete{' '}
                <Box as="span" color={accentColor}>
                  Healthcare Platform
                </Box>{' '}
                for Modern Professionals
              </Heading>

              {/* Subtitle */}
              <Text
                fontSize="xl"
                color={useColorModeValue('gray.600', 'gray.300')}
                lineHeight="1.6"
                maxW="600px"
                fontFamily="body"
              >
                Streamline your practice with comprehensive drug information, 
                expert consultations, accredited learning modules, and mental health support. 
                Built by healthcare professionals, for healthcare professionals.
              </Text>

              {/* CTA Buttons */}
              <Stack
                direction={{ base: 'column', sm: 'row' }}
                spacing={4}
                w="full"
                maxW="500px"
              >
                <Button
                  size="lg"
                  colorScheme="brand"
                  onClick={handleGetStarted}
                  rightIcon={<FaArrowRight />}
                  px={8}
                  py={6}
                  fontSize="lg"
                  fontWeight="bold"
                  borderRadius="xl"
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'xl',
                  }}
                  transition="all 0.2s"
                >
                  Get Started Free
                </Button>
                
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleWatchDemo}
                  leftIcon={<FaPlay />}
                  px={8}
                  py={6}
                  fontSize="lg"
                  fontWeight="semibold"
                  borderRadius="xl"
                  borderWidth="2px"
                  _hover={{
                    bg: 'brand.50',
                    transform: 'translateY(-2px)',
                  }}
                  transition="all 0.2s"
                >
                  Watch Demo
                </Button>
              </Stack>

              {/* Proof Points */}
              <VStack spacing={4} align="start" pt={4}>
                <HStack spacing={6} flexWrap="wrap">
                  <HStack spacing={2}>
                    <Icon as={FaCheckCircle} color="green.500" />
                    <Text fontSize="sm" color="gray.600">
                      HIPAA Compliant
                    </Text>
                  </HStack>
                  <HStack spacing={2}>
                    <Icon as={FaCheckCircle} color="green.500" />
                    <Text fontSize="sm" color="gray.600">
                      SOC 2 Certified
                    </Text>
                  </HStack>
                  <HStack spacing={2}>
                    <Icon as={FaCheckCircle} color="green.500" />
                    <Text fontSize="sm" color="gray.600">
                      FDA Approved Data
                    </Text>
                  </HStack>
                </HStack>
              </VStack>
            </VStack>
          </GridItem>

          {/* Right Column - Hero Image */}
          <GridItem>
            <Box position="relative">
              {/* Main Hero Image */}
              <Image
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Healthcare professionals using digital platform"
                borderRadius="2xl"
                shadow="2xl"
                w="full"
                h="500px"
                objectFit="cover"
              />
              
              {/* Floating Stats Card */}
              <Box
                position="absolute"
                top="10%"
                right="-20px"
                bg="white"
                p={6}
                borderRadius="xl"
                shadow="xl"
                border="1px solid"
                borderColor="gray.200"
                maxW="280px"
              >
                <VStack spacing={3} align="start">
                  <HStack spacing={2}>
                    <Icon as={FaStar} color="yellow.400" />
                    <Text fontWeight="bold" color="gray.800">
                      4.9/5 Rating
                    </Text>
                  </HStack>
                  <Text fontSize="sm" color="gray.600">
                    "PharmGenius has transformed how we manage patient care and drug information."
                  </Text>
                  <Text fontSize="xs" color="gray.500" fontStyle="italic">
                    - Dr. Sarah Johnson, Chief Pharmacist
                  </Text>
                </VStack>
              </Box>

              {/* Floating Feature Card */}
              <Box
                position="absolute"
                bottom="10%"
                left="-20px"
                bg="brand.500"
                color="white"
                p={4}
                borderRadius="xl"
                shadow="xl"
                maxW="240px"
              >
                <HStack spacing={3}>
                  <Icon as={FaShieldAlt} boxSize={6} />
                  <VStack spacing={1} align="start">
                    <Text fontWeight="bold" fontSize="sm">
                      Secure & Compliant
                    </Text>
                    <Text fontSize="xs" opacity={0.9}>
                      Enterprise-grade security
                    </Text>
                  </VStack>
                </HStack>
              </Box>
            </Box>
          </GridItem>
        </Grid>
      </Container>

      {/* Stats Section */}
      <Box bg={useColorModeValue('gray.50', 'gray.800')} py={16}>
        <Container maxW="7xl">
          <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={8}>
            <Stat textAlign="center">
              <StatNumber fontSize="4xl" fontWeight="bold" color={accentColor}>
                50,000+
              </StatNumber>
              <StatLabel fontSize="lg" color={textColor}>
                Drug Database
              </StatLabel>
              <StatHelpText color="gray.500">
                Comprehensive drug information
              </StatHelpText>
            </Stat>
            
            <Stat textAlign="center">
              <StatNumber fontSize="4xl" fontWeight="bold" color={accentColor}>
                1,000+
              </StatNumber>
              <StatLabel fontSize="lg" color={textColor}>
                Expert Consultants
              </StatLabel>
              <StatHelpText color="gray.500">
                Available 24/7
              </StatHelpText>
            </Stat>
            
            <Stat textAlign="center">
              <StatNumber fontSize="4xl" fontWeight="bold" color={accentColor}>
                500+
              </StatNumber>
              <StatLabel fontSize="lg" color={textColor}>
                Learning Modules
              </StatLabel>
              <StatHelpText color="gray.500">
                CME accredited courses
              </StatHelpText>
            </Stat>
            
            <Stat textAlign="center">
              <StatNumber fontSize="4xl" fontWeight="bold" color={accentColor}>
                99.9%
              </StatNumber>
              <StatLabel fontSize="lg" color={textColor}>
                Uptime
              </StatLabel>
              <StatHelpText color="gray.500">
                Reliable platform
              </StatHelpText>
            </Stat>
          </Grid>
        </Container>
      </Box>

      {/* Features Preview */}
      <Box py={20} bg={bgColor}>
        <Container maxW="7xl">
          <VStack spacing={16}>
            {/* Section Header */}
            <VStack spacing={4} textAlign="center" maxW="3xl">
              <Heading
                as="h2"
                size="xl"
                fontWeight="bold"
                color={textColor}
                fontFamily="heading"
              >
                Everything You Need to Excel in Healthcare
              </Heading>
              <Text
                fontSize="lg"
                color={useColorModeValue('gray.600', 'gray.300')}
                lineHeight="1.6"
              >
                From drug interactions to patient consultations, we've got you covered
              </Text>
            </VStack>

            {/* Feature Grid */}
            <Grid
              templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
              gap={8}
              w="full"
            >
              {/* Drug Information Hub */}
              <Box
                bg={useColorModeValue('white', 'gray.800')}
                p={8}
                borderRadius="2xl"
                shadow="lg"
                border="1px solid"
                borderColor={useColorModeValue('gray.200', 'gray.700')}
                textAlign="center"
                _hover={{
                  transform: 'translateY(-4px)',
                  shadow: 'xl',
                }}
                transition="all 0.3s"
              >
                <Icon
                  as={FaShieldAlt}
                  boxSize={12}
                  color={accentColor}
                  mb={4}
                />
                <Heading as="h3" size="md" mb={3} fontFamily="heading">
                  Drug Information Hub
                </Heading>
                <Text color={useColorModeValue('gray.600', 'gray.300')} lineHeight="1.6">
                  Access comprehensive drug databases, interactions, side effects, and formulary information
                </Text>
              </Box>

              {/* Expert Consultations */}
              <Box
                bg={useColorModeValue('white', 'gray.800')}
                p={8}
                borderRadius="2xl"
                shadow="lg"
                border="1px solid"
                borderColor={useColorModeValue('gray.200', 'gray.700')}
                textAlign="center"
                _hover={{
                  transform: 'translateY(-4px)',
                  shadow: 'xl',
                }}
                transition="all 0.3s"
              >
                <Icon
                  as={FaUserMd}
                  boxSize={12}
                  color={accentColor}
                  mb={4}
                />
                <Heading as="h3" size="md" mb={3} fontFamily="heading">
                  Expert Consultations
                </Heading>
                <Text color={useColorModeValue('gray.600', 'gray.300')} lineHeight="1.6">
                  Connect with specialists for complex cases, second opinions, and treatment guidance
                </Text>
              </Box>

              {/* Learning Platform */}
              <Box
                bg={useColorModeValue('white', 'gray.800')}
                p={8}
                borderRadius="2xl"
                shadow="lg"
                border="1px solid"
                borderColor={useColorModeValue('gray.200', 'gray.700')}
                textAlign="center"
                _hover={{
                  transform: 'translateY(-4px)',
                  shadow: 'xl',
                }}
                transition="all 0.3s"
              >
                <Icon
                  as={FaGraduationCap}
                  boxSize={12}
                  color={accentColor}
                  mb={4}
                />
                <Heading as="h3" size="md" mb={3} fontFamily="heading">
                  Learning Platform
                </Heading>
                <Text color={useColorModeValue('gray.600', 'gray.300')} lineHeight="1.6">
                  Earn CME credits with interactive courses, case studies, and assessments
                </Text>
              </Box>
            </Grid>

            {/* CTA Section */}
            <Box textAlign="center" pt={8}>
              <Button
                size="lg"
                variant="outline"
                onClick={handleLearnMore}
                rightIcon={<FaArrowRight />}
                px={8}
                py={6}
                fontSize="lg"
                fontWeight="semibold"
                borderRadius="xl"
                borderWidth="2px"
                _hover={{
                  bg: 'brand.50',
                  transform: 'translateY(-2px)',
                }}
                transition="all 0.2s"
              >
                Explore All Features
              </Button>
            </Box>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
};

export default Hero;
