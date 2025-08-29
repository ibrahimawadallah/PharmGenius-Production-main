import React, { useState } from 'react';
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
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  HStack,
  Icon,
  useColorModeValue,
  useToast,
  Select,
  Grid,
  GridItem
} from '@chakra-ui/react';
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaClock,
  FaPaperPlane
} from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: 'Message sent successfully!',
        description: 'We\'ll get back to you within 24 hours.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        subject: '',
        message: ''
      });
      setIsLoading(false);
    }, 2000);
  };

  const contactInfo = [
    {
      icon: FaEnvelope,
      title: 'Email',
      value: 'info@pharmgenius.com',
      description: 'Send us an email anytime'
    },
    {
      icon: FaPhone,
      title: 'Phone',
      value: '+971-50-123-4567',
      description: 'Mon-Fri from 8am to 6pm'
    },
    {
      icon: FaMapMarkerAlt,
      title: 'Office',
      value: 'Dubai Healthcare City',
      description: 'Dubai, United Arab Emirates'
    },
    {
      icon: FaClock,
      title: 'Business Hours',
      value: '8:00 AM - 6:00 PM',
      description: 'Sunday - Thursday (GMT+4)'
    }
  ];

  const subjects = [
    'General Inquiry',
    'Sales & Pricing',
    'Technical Support',
    'Partnership Opportunities',
    'Feature Request',
    'Other'
  ];

  return (
    <Box py={16} bg={useColorModeValue('gray.50', 'gray.900')}>
      <Container maxW="7xl">
        <VStack spacing={16} align="stretch">
          {/* Header */}
          <Box textAlign="center">
            <Heading size="2xl" color="blue.600" mb={6}>
              Get in Touch
            </Heading>
            <Text fontSize="xl" color={textColor} maxW="3xl" mx="auto">
              Have questions about our services? Want to learn more about how we can help? 
              We'd love to hear from you.
            </Text>
          </Box>

          {/* Contact Form and Info */}
          <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={12}>
            {/* Contact Form */}
            <GridItem>
              <Card bg={bgColor} border="1px" borderColor={borderColor} shadow="lg">
                <CardHeader>
                  <Heading size="lg" color="gray.800">
                    Send us a Message
                  </Heading>
                  <Text color={textColor}>
                    Fill out the form below and we'll get back to you as soon as possible.
                  </Text>
                </CardHeader>
                <CardBody>
                  <form onSubmit={handleSubmit}>
                    <VStack spacing={6} align="stretch">
                      <HStack spacing={4}>
                        <FormControl isRequired>
                          <FormLabel>First Name</FormLabel>
                          <Input
                            type="text"
                            value={formData.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            placeholder="Enter your first name"
                          />
                        </FormControl>
                        <FormControl isRequired>
                          <FormLabel>Last Name</FormLabel>
                          <Input
                            type="text"
                            value={formData.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            placeholder="Enter your last name"
                          />
                        </FormControl>
                      </HStack>

                      <HStack spacing={4}>
                        <FormControl isRequired>
                          <FormLabel>Email</FormLabel>
                          <Input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            placeholder="Enter your email address"
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel>Phone</FormLabel>
                          <Input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            placeholder="Enter your phone number"
                          />
                        </FormControl>
                      </HStack>

                      <FormControl>
                        <FormLabel>Company</FormLabel>
                        <Input
                          type="text"
                          value={formData.company}
                          onChange={(e) => handleInputChange('company', e.target.value)}
                          placeholder="Enter your company name"
                        />
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel>Subject</FormLabel>
                        <Select
                          value={formData.subject}
                          onChange={(e) => handleInputChange('subject', e.target.value)}
                          placeholder="Select a subject"
                        >
                          {subjects.map((subject, index) => (
                            <option key={index} value={subject}>
                              {subject}
                            </option>
                          ))}
                        </Select>
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel>Message</FormLabel>
                        <Textarea
                          value={formData.message}
                          onChange={(e) => handleInputChange('message', e.target.value)}
                          placeholder="Tell us how we can help you..."
                          rows={6}
                        />
                      </FormControl>

                      <Button
                        type="submit"
                        colorScheme="blue"
                        size="lg"
                        isLoading={isLoading}
                        loadingText="Sending..."
                        leftIcon={<FaPaperPlane />}
                      >
                        Send Message
                      </Button>
                    </VStack>
                  </form>
                </CardBody>
              </Card>
            </GridItem>

            {/* Contact Information */}
            <GridItem>
              <VStack spacing={6} align="stretch">
                {contactInfo.map((info, index) => (
                  <Card key={index} bg={bgColor} border="1px" borderColor={borderColor}>
                    <CardBody>
                      <HStack spacing={4}>
                        <Box
                          p={3}
                          borderRadius="full"
                          bg="blue.100"
                          color="blue.600"
                        >
                          <Icon as={info.icon} w={5} h={5} />
                        </Box>
                        <Box>
                          <Text fontWeight="semibold" color="gray.800">
                            {info.title}
                          </Text>
                          <Text color="blue.600" fontWeight="semibold">
                            {info.value}
                          </Text>
                          <Text color={textColor} fontSize="sm">
                            {info.description}
                          </Text>
                        </Box>
                      </HStack>
                    </CardBody>
                  </Card>
                ))}
              </VStack>
            </GridItem>
          </Grid>

          {/* Additional Information */}
          <Box>
            <Heading size="xl" textAlign="center" mb={12} color="gray.800">
              Why Choose PharmGenius?
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
              <Card bg={bgColor} border="1px" borderColor={borderColor} textAlign="center">
                <CardBody>
                  <Heading size="md" color="gray.800" mb={3}>
                    Expert Support
                  </Heading>
                  <Text color={textColor}>
                    Our team of healthcare professionals and technology experts 
                    are here to help you succeed.
                  </Text>
                </CardBody>
              </Card>
              <Card bg={bgColor} border="1px" borderColor={borderColor} textAlign="center">
                <CardBody>
                  <Heading size="md" color="gray.800" mb={3}>
                    Fast Response
                  </Heading>
                  <Text color={textColor}>
                    We typically respond to all inquiries within 24 hours, 
                    often much sooner.
                  </Text>
                </CardBody>
              </Card>
              <Card bg={bgColor} border="1px" borderColor={borderColor} textAlign="center">
                <CardBody>
                  <Heading size="md" color="gray.800" mb={3}>
                    Local Expertise
                  </Heading>
                  <Text color={textColor}>
                    Based in the UAE, we understand local healthcare needs 
                    and regulatory requirements.
                  </Text>
                </CardBody>
              </Card>
            </SimpleGrid>
          </Box>

          {/* CTA Section */}
          <Box textAlign="center" py={12}>
            <Heading size="xl" color="gray.800" mb={6}>
              Ready to Get Started?
            </Heading>
            <Text fontSize="lg" color={textColor} mb={8} maxW="2xl" mx="auto">
              Don't wait to improve your healthcare technology. Contact us today 
              to learn how PharmGenius can help transform your practice.
            </Text>
            <Button
              colorScheme="blue"
              size="lg"
              px={8}
              onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Start Your Journey
            </Button>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default Contact;
