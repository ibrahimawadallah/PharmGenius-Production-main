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
  Badge,
  List,
  ListItem,
  ListIcon,
  HStack,
  useColorModeValue,
  Divider
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import {
  FaCheckCircle,
  FaTimes,
  FaArrowRight,
  FaCrown
} from 'react-icons/fa';

const Pricing = () => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  const plans = [
    {
      name: 'Basic',
      price: 'Free',
      period: 'Forever',
      description: 'Perfect for individuals getting started with healthcare technology',
      features: [
        'Drug database access',
        'Basic consultations (2/month)',
        'Health articles and resources',
        'Mobile app access',
        'Email support'
      ],
      notIncluded: [
        'Advanced analytics',
        'Priority support',
        'Custom integrations'
      ],
      color: 'blue',
      popular: false
    },
    {
      name: 'Professional',
      price: '$29',
      period: 'per month',
      description: 'Ideal for healthcare professionals and small practices',
      features: [
        'All Basic features',
        'Unlimited consultations',
        'Learning modules access',
        'Progress tracking',
        'Priority support',
        'Analytics dashboard',
        'Custom reports'
      ],
      notIncluded: [
        'Organization management',
        'White-label options'
      ],
      color: 'green',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'Contact us',
      description: 'For large organizations and healthcare systems',
      features: [
        'All Professional features',
        'Organization management',
        'Custom integrations',
        'Dedicated support',
        'White-label options',
        'Advanced security',
        'Compliance reporting',
        'Custom training programs'
      ],
      notIncluded: [],
      color: 'purple',
      popular: false
    }
  ];

  const addOns = [
    {
      name: 'Additional Users',
      price: '$15',
      period: 'per user/month',
      description: 'Add more team members to your Professional or Enterprise plan'
    },
    {
      name: 'Custom Training',
      price: '$500',
      period: 'per session',
      description: 'Personalized training sessions for your team'
    },
    {
      name: 'API Access',
      price: '$100',
      period: 'per month',
      description: 'Integrate PharmGenius with your existing systems'
    }
  ];

  return (
    <Box py={16} bg={useColorModeValue('gray.50', 'gray.900')}>
      <Container maxW="7xl">
        <VStack spacing={16} align="stretch">
          {/* Header */}
          <Box textAlign="center">
            <Heading size="2xl" color="blue.600" mb={6}>
              Simple, Transparent Pricing
            </Heading>
            <Text fontSize="xl" color={textColor} maxW="3xl" mx="auto">
              Choose the plan that best fits your needs. All plans include our core features 
              with no hidden fees or surprises.
            </Text>
          </Box>

          {/* Pricing Plans */}
          <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={8}>
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                bg={bgColor} 
                border="1px" 
                borderColor={plan.popular ? `${plan.color}.500` : borderColor}
                shadow={plan.popular ? 'xl' : 'lg'}
                position="relative"
                transform={plan.popular ? 'scale(1.05)' : 'none'}
                zIndex={plan.popular ? 1 : 0}
              >
                {plan.popular && (
                  <Badge
                    position="absolute"
                    top={4}
                    right={4}
                    colorScheme={plan.color}
                    variant="solid"
                    leftIcon={<FaCrown />}
                  >
                    Most Popular
                  </Badge>
                )}
                
                <CardHeader textAlign="center">
                  <Heading size="lg" color={`${plan.color}.600`} mb={2}>
                    {plan.name}
                  </Heading>
                  <HStack justify="center" align="baseline" mb={2}>
                    <Text fontSize="4xl" fontWeight="bold" color="gray.800">
                      {plan.price}
                    </Text>
                    {plan.price !== 'Free' && plan.price !== 'Custom' && (
                      <Text fontSize="lg" color={textColor}>
                        {plan.period}
                      </Text>
                    )}
                  </HStack>
                  {plan.price === 'Free' && (
                    <Text fontSize="lg" color={textColor}>
                      {plan.period}
                    </Text>
                  )}
                  {plan.price === 'Custom' && (
                    <Text fontSize="lg" color={textColor}>
                      {plan.period}
                    </Text>
                  )}
                  <Text color={textColor} mt={3}>
                    {plan.description}
                  </Text>
                </CardHeader>

                <CardBody pt={0}>
                  <VStack spacing={4} align="stretch">
                    <Box>
                      <Text fontWeight="semibold" color="gray.800" mb={3}>
                        What's included:
                      </Text>
                      <List spacing={2}>
                        {plan.features.map((feature, idx) => (
                          <ListItem key={idx}>
                            <ListIcon as={FaCheckCircle} color="green.500" />
                            {feature}
                          </ListItem>
                        ))}
                      </List>
                    </Box>

                    {plan.notIncluded.length > 0 && (
                      <Box>
                        <Text fontWeight="semibold" color="gray.800" mb={3}>
                          Not included:
                        </Text>
                        <List spacing={2}>
                          {plan.notIncluded.map((feature, idx) => (
                            <ListItem key={idx}>
                              <ListIcon as={FaTimes} color="red.500" />
                              {feature}
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    )}

                    <Divider />

                    <Button
                      colorScheme={plan.color}
                      variant={plan.popular ? 'solid' : 'outline'}
                      size="lg"
                      w="full"
                      rightIcon={<FaArrowRight />}
                      as={plan.price === 'Custom' ? undefined : RouterLink}
                      to={plan.price === 'Custom' ? undefined : '/register'}
                      onClick={plan.price === 'Custom' ? () => window.location.href = '/contact' : undefined}
                    >
                      {plan.price === 'Custom' ? 'Contact Sales' : 'Get Started'}
                    </Button>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>

          {/* Add-ons */}
          <Box>
            <Heading size="xl" textAlign="center" mb={12} color="gray.800">
              Additional Services
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
              {addOns.map((addon, index) => (
                <Card key={index} bg={bgColor} border="1px" borderColor={borderColor}>
                  <CardBody textAlign="center">
                    <Heading size="md" color="gray.800" mb={3}>
                      {addon.name}
                    </Heading>
                    <HStack justify="center" align="baseline" mb={3}>
                      <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                        {addon.price}
                      </Text>
                      <Text fontSize="sm" color={textColor}>
                        {addon.period}
                      </Text>
                    </HStack>
                    <Text color={textColor} fontSize="sm" mb={4}>
                      {addon.description}
                    </Text>
                    <Button
                      colorScheme="blue"
                      variant="outline"
                      size="sm"
                      w="full"
                      as={RouterLink}
                      to="/contact"
                    >
                      Learn More
                    </Button>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </Box>

          {/* FAQ Section */}
          <Box>
            <Heading size="xl" textAlign="center" mb={12} color="gray.800">
              Frequently Asked Questions
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
              <VStack spacing={4} align="stretch">
                <Box>
                  <Heading size="md" color="gray.800" mb={2}>
                    Can I change my plan anytime?
                  </Heading>
                  <Text color={textColor}>
                    Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
                  </Text>
                </Box>
                <Box>
                  <Heading size="md" color="gray.800" mb={2}>
                    Is there a free trial?
                  </Heading>
                  <Text color={textColor}>
                    Yes, all paid plans come with a 14-day free trial. No credit card required to start.
                  </Text>
                </Box>
              </VStack>
              <VStack spacing={4} align="stretch">
                <Box>
                  <Heading size="md" color="gray.800" mb={2}>
                    What payment methods do you accept?
                  </Heading>
                  <Text color={textColor}>
                    We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.
                  </Text>
                </Box>
                <Box>
                  <Heading size="md" color="gray.800" mb={2}>
                    Can I cancel anytime?
                  </Heading>
                  <Text color={textColor}>
                    Yes, you can cancel your subscription at any time. No long-term contracts or cancellation fees.
                  </Text>
                </Box>
              </VStack>
            </SimpleGrid>
          </Box>

          {/* CTA Section */}
          <Box textAlign="center" py={12}>
            <Heading size="xl" color="gray.800" mb={6}>
              Ready to Get Started?
            </Heading>
            <Text fontSize="lg" color={textColor} mb={8} maxW="2xl" mx="auto">
              Join thousands of healthcare professionals who trust PharmGenius 
              to improve their practice and patient care.
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
                Contact Sales
              </Button>
            </HStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default Pricing;
