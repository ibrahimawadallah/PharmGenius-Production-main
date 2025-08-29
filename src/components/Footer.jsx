import React from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Heading,
  Link as ChakraLink,
  SimpleGrid,
  Icon,
  useColorModeValue,
  Divider,
  Badge
} from '@chakra-ui/react';
import { 
  FaPills, 
  FaTwitter, 
  FaLinkedin, 
  FaFacebook, 
  FaInstagram,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaHeart
} from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
  const bgColor = useColorModeValue('gray.900', 'gray.800');
  const textColor = useColorModeValue('gray.300', 'gray.400');
  const brandColor = useColorModeValue('pharmgenius.400', 'pharmgenius.300');
  const borderColor = useColorModeValue('gray.700', 'gray.600');

  const footerSections = [
    {
      title: 'Product',
      links: [
        { name: 'Features', path: '/features' },
        { name: 'Services', path: '/services' },
        { name: 'Pricing', path: '/pricing' },
        { name: 'API', path: '/api' },
        { name: 'Integrations', path: '/integrations' }
      ]
    },
    {
      title: 'Solutions',
      links: [
        { name: 'For Hospitals', path: '/solutions/hospitals' },
        { name: 'For Clinics', path: '/solutions/clinics' },
        { name: 'For Pharmacies', path: '/solutions/pharmacies' },
        { name: 'For Researchers', path: '/solutions/researchers' },
        { name: 'Enterprise', path: '/solutions/enterprise' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { name: 'Documentation', path: '/docs' },
        { name: 'Blog', path: '/blog' },
        { name: 'Help Center', path: '/help' },
        { name: 'Community', path: '/community' },
        { name: 'Webinars', path: '/webinars' }
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About', path: '/about' },
        { name: 'Careers', path: '/careers' },
        { name: 'Press', path: '/press' },
        { name: 'Partners', path: '/partners' },
        { name: 'Contact', path: '/contact' }
      ]
    }
  ];

  const socialLinks = [
    { name: 'Twitter', icon: FaTwitter, url: 'https://twitter.com/pharmgenius' },
    { name: 'LinkedIn', icon: FaLinkedin, url: 'https://linkedin.com/company/pharmgenius' },
    { name: 'Facebook', icon: FaFacebook, url: 'https://facebook.com/pharmgenius' },
    { name: 'Instagram', icon: FaInstagram, url: 'https://instagram.com/pharmgenius' }
  ];

  const contactInfo = [
    { icon: FaEnvelope, text: 'hello@pharmgenius.com' },
    { icon: FaPhone, text: '+971 4 123 4567' },
    { icon: FaMapMarkerAlt, text: 'Dubai, United Arab Emirates' }
  ];

  return (
    <Box bg={bgColor} color={textColor}>
      <Container maxW="full" px={6} py={16}>
        <VStack spacing={12} align="stretch">
          {/* Main Footer Content */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 5 }} spacing={8}>
            {/* Brand Section */}
            <VStack spacing={4} align="start">
              <HStack spacing={3}>
                <Box
                  w="10"
                  h="10"
                  bg={brandColor}
                  borderRadius="lg"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <FaPills color="white" size="20" />
                </Box>
                <VStack spacing={0} align="start">
                  <Heading size="md" color="white" fontWeight="800">
                    PharmGenius
                  </Heading>
                  <Text fontSize="xs" color={textColor}>
                    Healthcare Portal
                  </Text>
                </VStack>
              </HStack>
              
              <Text fontSize="sm" lineHeight="1.6" maxW="xs">
                Empowering healthcare professionals with AI-driven insights, 
                secure consultations, and continuous learning opportunities.
              </Text>

              {/* Social Links */}
              <HStack spacing={3}>
                {socialLinks.map((social) => (
                  <ChakraLink
                    key={social.name}
                    href={social.url}
                    isExternal
                    _hover={{ color: brandColor }}
                    transition="color 0.2s"
                  >
                    <Icon as={social.icon} boxSize={5} />
                  </ChakraLink>
                ))}
              </HStack>
            </VStack>

            {/* Footer Sections */}
            {footerSections.map((section) => (
              <VStack key={section.title} spacing={4} align="start">
                <Heading size="sm" color="white" fontWeight="600">
                  {section.title}
                </Heading>
                <VStack spacing={2} align="start">
                  {section.links.map((link) => (
                    <ChakraLink
                      key={link.name}
                      as={RouterLink}
                      to={link.path}
                      fontSize="sm"
                      _hover={{ color: brandColor }}
                      transition="color 0.2s"
                    >
                      {link.name}
                    </ChakraLink>
                  ))}
                </VStack>
              </VStack>
            ))}
          </SimpleGrid>

          {/* Contact Information */}
          <Box
            bg={useColorModeValue('gray.800', 'gray.700')}
            p={8}
            borderRadius="xl"
            border="1px"
            borderColor={borderColor}
          >
            <VStack spacing={6} align="stretch">
              <Heading size="md" color="white" textAlign="center">
                Get in Touch
              </Heading>
              
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                {contactInfo.map((contact, index) => (
                  <HStack key={index} spacing={3} justify="center">
                    <Icon as={contact.icon} color={brandColor} boxSize={5} />
                    <Text fontSize="sm">{contact.text}</Text>
                  </HStack>
                ))}
              </SimpleGrid>

              <HStack spacing={4} justify="center">
                <Badge colorScheme="green" variant="subtle">
                  UAE Health Authority Approved
                </Badge>
                <Badge colorScheme="blue" variant="subtle">
                  ISO 27001 Certified
                </Badge>
                <Badge colorScheme="purple" variant="subtle">
                  HIPAA Compliant
                </Badge>
              </HStack>
            </VStack>
          </Box>

          {/* Divider */}
          <Divider borderColor={borderColor} />

          {/* Bottom Footer */}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} align="center">
            <VStack spacing={2} align={{ base: 'center', md: 'start' }}>
              <Text fontSize="sm" color={textColor}>
                © 2024 PharmGenius. All rights reserved.
              </Text>
              <HStack spacing={4} fontSize="sm">
                <ChakraLink
                  as={RouterLink}
                  to="/privacy"
                  _hover={{ color: brandColor }}
                >
                  Privacy Policy
                </ChakraLink>
                <ChakraLink
                  as={RouterLink}
                  to="/terms"
                  _hover={{ color: brandColor }}
                >
                  Terms of Service
                </ChakraLink>
                <ChakraLink
                  as={RouterLink}
                  to="/cookies"
                  _hover={{ color: brandColor }}
                >
                  Cookie Policy
                </ChakraLink>
              </HStack>
            </VStack>

            <VStack spacing={2} align={{ base: 'center', md: 'end' }}>
              <Text fontSize="sm" color={textColor}>
                Made with <Icon as={FaHeart} color="red.400" /> in the UAE
              </Text>
              <Text fontSize="sm" color={textColor}>
                Version 1.0.0
              </Text>
            </VStack>
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
};

export default Footer;