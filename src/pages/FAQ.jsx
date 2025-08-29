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
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  useColorModeValue,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  HStack,
  Icon,
  Button
} from '@chakra-ui/react';
import { FaSearch, FaQuestionCircle, FaUser, FaCreditCard, FaShieldAlt, FaCog } from 'react-icons/fa';

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  const faqCategories = [
    {
      title: 'Getting Started',
      icon: FaUser,
      color: 'blue',
      questions: [
        {
          question: 'How do I create my first account?',
          answer: 'Click the "Sign Up" button in the top right corner, fill in your details, and verify your email address. You can start using the basic features immediately.'
        },
        {
          question: 'What are the system requirements?',
          answer: 'PharmGenius works on any modern web browser (Chrome, Firefox, Safari, Edge) and has mobile apps for iOS and Android devices.'
        },
        {
          question: 'Is there a free trial available?',
          answer: 'Yes, all paid plans come with a 14-day free trial. No credit card is required to start your trial.'
        }
      ]
    },
    {
      title: 'Account & Billing',
      icon: FaCreditCard,
      color: 'green',
      questions: [
        {
          question: 'How do I change my subscription plan?',
          answer: 'Go to your Account Settings > Subscription and select "Change Plan". You can upgrade or downgrade at any time.'
        },
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.'
        },
        {
          question: 'Can I cancel my subscription anytime?',
          answer: 'Yes, you can cancel your subscription at any time from your Account Settings. No cancellation fees apply.'
        }
      ]
    },
    {
      title: 'Security & Privacy',
      icon: FaShieldAlt,
      color: 'purple',
      questions: [
        {
          question: 'Is my data secure?',
          answer: 'Yes, we use enterprise-grade encryption and follow HIPAA compliance standards to ensure your data is always secure.'
        },
        {
          question: 'Who can access my health information?',
          answer: 'Only authorized healthcare professionals and staff members can access your health information, and all access is logged and monitored.'
        },
        {
          question: 'Do you share my data with third parties?',
          answer: 'No, we never sell or share your personal health information with third parties without your explicit consent.'
        }
      ]
    },
    {
      title: 'Technical Support',
      icon: FaCog,
      color: 'orange',
      questions: [
        {
          question: 'What should I do if I can\'t log in?',
          answer: 'First, try resetting your password. If that doesn\'t work, contact our support team for assistance.'
        },
        {
          question: 'How do I report a bug or issue?',
          answer: 'Use the "Report Issue" button in the Help menu, or contact our support team directly with details about the problem.'
        },
        {
          question: 'What are your support hours?',
          answer: 'Our support team is available 24/7 for urgent issues, and we typically respond to non-urgent inquiries within 24 hours.'
        }
      ]
    }
  ];

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(q =>
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <Container maxW="7xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <Box textAlign="center">
          <Heading size="2xl" color="blue.600" mb={6}>
            Frequently Asked Questions
          </Heading>
          <Text fontSize="xl" color={textColor} maxW="3xl" mx="auto">
            Find answers to common questions about PharmGenius. Can't find what you're looking for? 
            Contact our support team for personalized assistance.
          </Text>
        </Box>

        {/* Search */}
        <Box maxW="2xl" mx="auto" w="full">
          <InputGroup size="lg">
            <InputLeftElement>
              <FaSearch color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Search for questions or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              bg={bgColor}
              border="1px"
              borderColor={borderColor}
            />
          </InputGroup>
        </Box>

        {/* FAQ Categories */}
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
          {filteredCategories.map((category) => (
            <Card key={category.title} bg={bgColor} border="1px" borderColor={borderColor} shadow="lg">
              <CardHeader>
                <HStack spacing={4}>
                  <Box
                    p={3}
                    borderRadius="full"
                    bg={`${category.color}.100`}
                    color={`${category.color}.600`}
                  >
                    <Icon as={category.icon} w={6} h={6} />
                  </Box>
                  <Box>
                    <Heading size="lg" color="gray.800">
                      {category.title}
                    </Heading>
                    <Text color={textColor} mt={1}>
                      {category.questions.length} questions
                    </Text>
                  </Box>
                </HStack>
              </CardHeader>
              <CardBody pt={0}>
                <Accordion allowMultiple>
                  {category.questions.map((faq, index) => (
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
          ))}
        </SimpleGrid>

        {/* No Results */}
        {searchQuery && filteredCategories.length === 0 && (
          <Box textAlign="center" py={12}>
            <Icon as={FaQuestionCircle} w={16} h={16} color="gray.400" mb={4} />
            <Heading size="lg" color="gray.600" mb={4}>
              No results found
            </Heading>
            <Text color={textColor} mb={6}>
              Try searching with different terms or browse our FAQ categories above.
            </Text>
            <Button
              colorScheme="blue"
              onClick={() => setSearchQuery('')}
            >
              Clear Search
            </Button>
          </Box>
        )}

        {/* Contact Support */}
        <Box textAlign="center" py={12}>
          <Heading size="xl" color="gray.800" mb={6}>
            Still Need Help?
          </Heading>
          <Text fontSize="lg" color={textColor} mb={8} maxW="2xl" mx="auto">
            Our support team is here to help you with any questions or issues 
            that aren't covered in our FAQ.
          </Text>
          <Box>
            <Text color={textColor} mb={4}>
              Contact us via:
            </Text>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} maxW="2xl" mx="auto">
              <Box>
                <Text fontWeight="semibold" color="blue.600">Email</Text>
                <Text color={textColor}>support@pharmgenius.com</Text>
              </Box>
              <Box>
                <Text fontWeight="semibold" color="green.600">Phone</Text>
                <Text color={textColor}>+971-50-123-4567</Text>
              </Box>
              <Box>
                <Text fontWeight="semibold" color="purple.600">Live Chat</Text>
                <Text color={textColor}>Available in app</Text>
              </Box>
            </SimpleGrid>
          </Box>
        </Box>
      </VStack>
    </Container>
  );
};

export default FAQ;
