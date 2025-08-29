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
  Icon,
  useColorModeValue,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import {
  FaQuestionCircle,
  FaEnvelope,
  FaPhone,
  FaComments
} from 'react-icons/fa';

const Support = () => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  const faqs = [
    {
      question: 'How do I create my first account?',
      answer: 'Click the "Sign Up" button in the top right corner, fill in your details, and verify your email address.'
    },
    {
      question: 'What are the system requirements?',
      answer: 'PharmGenius works on any modern web browser and has mobile apps for iOS and Android devices.'
    },
    {
      question: 'Is there a free trial available?',
      answer: 'Yes, all paid plans come with a 14-day free trial. No credit card is required to start your trial.'
    },
    {
      question: 'How do I change my subscription plan?',
      answer: 'Go to your Account Settings > Subscription and select "Change Plan". You can upgrade or downgrade at any time.'
    },
    {
      question: 'How do I search for drug information?',
      answer: 'Use the search bar at the top of the page. You can search by drug name, generic name, or active ingredient.'
    },
    {
      question: 'How do I book a consultation?',
      answer: 'Navigate to Consultations > Book Appointment, select your preferred provider and time slot, and confirm your booking.'
    }
  ];

  const supportChannels = [
    {
      icon: FaEnvelope,
      title: 'Email Support',
      description: 'Get help via email within 24 hours',
      contact: 'support@pharmgenius.com',
      color: 'blue'
    },
    {
      icon: FaPhone,
      title: 'Phone Support',
      description: 'Speak directly with our support team',
      contact: '+971-50-123-4567',
      color: 'green'
    },
    {
      icon: FaComments,
      title: 'Live Chat',
      description: 'Real-time chat support during business hours',
      contact: 'Available in app',
      color: 'purple'
    }
  ];

  return (
    <Box py={16} bg={useColorModeValue('gray.50', 'gray.900')}>
      <Container maxW="7xl">
        <VStack spacing={16} align="stretch">
          {/* Header */}
          <Box textAlign="center">
            <Heading size="2xl" color="blue.600" mb={6}>
              Support Center
            </Heading>
            <Text fontSize="xl" color={textColor} maxW="3xl" mx="auto">
              Need help? We're here to support you every step of the way. 
              Find answers and get in touch with our support team.
            </Text>
          </Box>

          {/* FAQ Section */}
          <Box>
            <Heading size="xl" textAlign="center" mb={12} color="gray.800">
              Frequently Asked Questions
            </Heading>
            <Card bg={bgColor} border="1px" borderColor={borderColor}>
              <CardBody>
                <Accordion allowMultiple>
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} border="none">
                      <AccordionButton
                        py={4}
                        _hover={{ bg: 'gray.50' }}
                        borderRadius="md"
                      >
                        <Box flex="1" textAlign="left" fontWeight="semibold">
                          {faq.question}
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                      <AccordionPanel pb={4} color={textColor}>
                        {faq.answer}
                      </AccordionPanel>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardBody>
            </Card>
          </Box>

          {/* Support Channels */}
          <Box>
            <Heading size="xl" textAlign="center" mb={12} color="gray.800">
              Get in Touch
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
              {supportChannels.map((channel, index) => (
                <Card key={index} bg={bgColor} border="1px" borderColor={borderColor} shadow="lg">
                  <CardBody textAlign="center">
                    <Box
                      p={4}
                      borderRadius="full"
                      bg={`${channel.color}.100`}
                      color={`${channel.color}.600`}
                      w="fit-content"
                      mx="auto"
                      mb={4}
                    >
                      <Icon as={channel.icon} w={8} h={8} />
                    </Box>
                    <Heading size="md" color="gray.800" mb={3}>
                      {channel.title}
                    </Heading>
                    <Text color={textColor} fontSize="sm" mb={4}>
                      {channel.description}
                    </Text>
                    <Text fontWeight="semibold" color={`${channel.color}.600`}>
                      {channel.contact}
                    </Text>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </Box>

          {/* CTA Section */}
          <Box textAlign="center" py={12}>
            <Heading size="xl" color="gray.800" mb={6}>
              Still Need Help?
            </Heading>
            <Text fontSize="lg" color={textColor} mb={8} maxW="2xl" mx="auto">
              Our support team is here to help you succeed with PharmGenius.
            </Text>
            <HStack spacing={4} justify="center" flexWrap="wrap">
              <Button
                as={RouterLink}
                to="/contact"
                colorScheme="blue"
                size="lg"
                px={8}
              >
                Contact Support
              </Button>
              <Button
                as={RouterLink}
                to="/register"
                variant="outline"
                size="lg"
                px={8}
              >
                Start Free Trial
              </Button>
            </HStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default Support;
