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
  Avatar,
  HStack,
  useColorModeValue,
  Button,
  Image,
  Grid,
  GridItem,
  Badge,
  List,
  ListItem,
  ListIcon
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import {
  FaCheckCircle,
  FaArrowRight,
  FaHeart,
  FaShieldAlt,
  FaGlobe,
  FaUsers
} from 'react-icons/fa';

const About = () => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  const values = [
    {
      icon: FaHeart,
      title: 'Patient-Centered Care',
      description: 'Every decision we make is focused on improving patient outcomes and experiences.'
    },
    {
      icon: FaShieldAlt,
      title: 'Quality & Safety',
      description: 'We maintain the highest standards of quality and safety in all our services.'
    },
    {
      icon: FaGlobe,
      title: 'Innovation',
      description: 'We continuously innovate to bring cutting-edge healthcare technology to our users.'
    },
    {
      icon: FaUsers,
      title: 'Collaboration',
      description: 'We believe in the power of collaboration between healthcare professionals and patients.'
    }
  ];

  const team = [
    {
      name: 'Dr. Sarah Ahmed',
      role: 'Chief Medical Officer',
      bio: 'Board-certified pharmacist with 15+ years of experience in clinical pharmacy and healthcare technology.',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Ahmed Hassan',
      role: 'Chief Technology Officer',
      bio: 'Technology leader with expertise in healthcare systems, AI, and scalable software solutions.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Dr. Fatima Al-Zahra',
      role: 'Head of Clinical Services',
      bio: 'Experienced healthcare administrator specializing in quality improvement and patient safety.',
      avatar: 'https://images.unsplash.com/photo-1594824475542-9b0c4c0c0c0c?w=150&h=150&fit=crop&crop=face'
    }
  ];

  const milestones = [
    { year: '2020', title: 'Company Founded', description: 'PharmGenius was established with a vision to revolutionize healthcare technology.' },
    { year: '2021', title: 'First Product Launch', description: 'Launched our comprehensive drug database and consultation platform.' },
    { year: '2022', title: 'UAE Health Authority Approval', description: 'Received official approval from UAE health authorities.' },
    { year: '2023', title: '10,000+ Users', description: 'Reached milestone of serving over 10,000 healthcare professionals and patients.' },
    { year: '2024', title: 'Regional Expansion', description: 'Expanding services across the GCC region with local partnerships.' }
  ];

  return (
    <Box py={16} bg={useColorModeValue('gray.50', 'gray.900')}>
      <Container maxW="7xl">
        <VStack spacing={16} align="stretch">
          {/* Header */}
          <Box textAlign="center">
            <Heading size="2xl" color="blue.600" mb={6}>
              About PharmGenius
            </Heading>
            <Text fontSize="xl" color={textColor} maxW="3xl" mx="auto">
              We're on a mission to transform healthcare delivery through innovative technology, 
              making quality healthcare accessible to everyone in the UAE and beyond.
            </Text>
          </Box>

          {/* Mission & Vision */}
          <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={12} alignItems="center">
            <GridItem>
              <VStack spacing={6} align="stretch">
                <Box>
                  <Heading size="lg" color="gray.800" mb={4}>
                    Our Mission
                  </Heading>
                  <Text color={textColor} fontSize="lg">
                    To empower healthcare professionals and patients with cutting-edge technology 
                    that improves health outcomes, enhances patient safety, and makes healthcare 
                    more accessible and efficient.
                  </Text>
                </Box>
                
                <Box>
                  <Heading size="lg" color="gray.800" mb={4}>
                    Our Vision
                  </Heading>
                  <Text color={textColor} fontSize="lg">
                    To become the leading healthcare technology platform in the Middle East, 
                    setting new standards for digital health innovation and patient care excellence.
                  </Text>
                </Box>
              </VStack>
            </GridItem>
            <GridItem>
              <Box textAlign="center">
                <Image
                  src="https://images.unsplash.com/photo-1576091160399-112c8f0dbf9e?w=600&h=400&fit=crop"
                  alt="Healthcare Team"
                  borderRadius="lg"
                  shadow="xl"
                />
              </Box>
            </GridItem>
          </Grid>

          {/* Values */}
          <Box>
            <Heading size="xl" textAlign="center" mb={12} color="gray.800">
              Our Core Values
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
              {values.map((value, index) => (
                <Card key={index} bg={bgColor} border="1px" borderColor={borderColor} textAlign="center">
                  <CardBody>
                    <Box
                      p={4}
                      borderRadius="full"
                      bg="blue.100"
                      color="blue.600"
                      w="fit-content"
                      mx="auto"
                      mb={4}
                    >
                      <value.icon size={24} />
                    </Box>
                    <Heading size="md" color="gray.800" mb={3}>
                      {value.title}
                    </Heading>
                    <Text color={textColor} fontSize="sm">
                      {value.description}
                    </Text>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </Box>

          {/* Story */}
          <Box>
            <Heading size="xl" textAlign="center" mb={12} color="gray.800">
              Our Story
            </Heading>
            <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={12} alignItems="center">
              <GridItem>
                <VStack spacing={6} align="stretch">
                  <Text color={textColor} fontSize="lg">
                    PharmGenius was born from a simple observation: healthcare professionals and patients 
                    needed better tools to manage medications, access information, and coordinate care.
                  </Text>
                  <Text color={textColor} fontSize="lg">
                    Founded in 2020 by a team of healthcare professionals and technology experts, 
                    we set out to create a comprehensive platform that would address these challenges 
                    while maintaining the highest standards of quality and safety.
                  </Text>
                  <Text color={textColor} fontSize="lg">
                    Today, we serve thousands of healthcare professionals and patients across the UAE, 
                    providing them with the tools they need to deliver and receive better care.
                  </Text>
                </VStack>
              </GridItem>
              <GridItem>
                <Box textAlign="center">
                  <Image
                    src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop"
                    alt="Healthcare Innovation"
                    borderRadius="lg"
                    shadow="xl"
                  />
                </Box>
              </GridItem>
            </Grid>
          </Box>

          {/* Milestones */}
          <Box>
            <Heading size="xl" textAlign="center" mb={12} color="gray.800">
              Our Journey
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 5 }} spacing={6}>
              {milestones.map((milestone, index) => (
                <Card key={index} bg={bgColor} border="1px" borderColor={borderColor} textAlign="center">
                  <CardBody>
                    <Badge colorScheme="blue" mb={3} fontSize="lg">
                      {milestone.year}
                    </Badge>
                    <Heading size="md" color="gray.800" mb={3}>
                      {milestone.title}
                    </Heading>
                    <Text color={textColor} fontSize="sm">
                      {milestone.description}
                    </Text>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </Box>

          {/* Team */}
          <Box>
            <Heading size="xl" textAlign="center" mb={12} color="gray.800">
              Leadership Team
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
              {team.map((member, index) => (
                <Card key={index} bg={bgColor} border="1px" borderColor={borderColor} textAlign="center">
                  <CardBody>
                    <Avatar
                      size="xl"
                      src={member.avatar}
                      name={member.name}
                      mb={4}
                    />
                    <Heading size="md" color="gray.800" mb={2}>
                      {member.name}
                    </Heading>
                    <Badge colorScheme="blue" mb={3}>
                      {member.role}
                    </Badge>
                    <Text color={textColor} fontSize="sm">
                      {member.bio}
                    </Text>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </Box>

          {/* CTA Section */}
          <Box textAlign="center" py={12}>
            <Heading size="xl" color="gray.800" mb={6}>
              Join Us in Transforming Healthcare
            </Heading>
            <Text fontSize="lg" color={textColor} mb={8} maxW="2xl" mx="auto">
              Whether you're a healthcare professional looking to enhance your practice, 
              a patient seeking better care, or an organization wanting to improve outcomes, 
              we're here to help.
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
                Get Started
              </Button>
              <Button
                as={RouterLink}
                to="/contact"
                variant="outline"
                size="lg"
                px={8}
              >
                Contact Us
              </Button>
            </HStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default About;
