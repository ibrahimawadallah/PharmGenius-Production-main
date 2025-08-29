import React from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Button,
  HStack,
  Icon,
  useColorModeValue
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FaHome, FaSearch, FaArrowLeft, FaExclamationTriangle } from 'react-icons/fa';

const NotFound = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <Box bg={bgColor} minH="100vh" py={20}>
      <Container maxW="lg">
        <VStack spacing={8} textAlign="center">
          {/* 404 Icon */}
          <Box position="relative">
            <Icon
              as={FaExclamationTriangle}
              w={24}
              h={24}
              color="orange.400"
            />
            <Box
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              fontSize="6xl"
              fontWeight="bold"
              color="orange.500"
            >
              4
            </Box>
            <Box
              position="absolute"
              top="50%"
              right="0"
              transform="translateY(-50%)"
              fontSize="6xl"
              fontWeight="bold"
              color="orange.500"
            >
              4
            </Box>
          </Box>

          {/* Main Content */}
          <VStack spacing={4}>
            <Heading size="2xl" color="gray.800">
              Page Not Found
            </Heading>
            <Text fontSize="lg" color={textColor} maxW="md">
              Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
            </Text>
          </VStack>

          {/* Action Buttons */}
          <VStack spacing={4} w="full">
            <HStack spacing={4} justify="center" flexWrap="wrap">
              <Button
                as={RouterLink}
                to="/"
                leftIcon={<FaHome />}
                colorScheme="blue"
                size="lg"
                px={8}
              >
                Go Home
              </Button>
              <Button
                onClick={() => window.history.back()}
                leftIcon={<FaArrowLeft />}
                variant="outline"
                size="lg"
                px={8}
              >
                Go Back
              </Button>
            </HStack>
            
            <Button
              as={RouterLink}
              to="/drug-search"
              leftIcon={<FaSearch />}
              variant="ghost"
              size="md"
            >
              Search for Drugs
            </Button>
          </VStack>

          {/* Helpful Links */}
          <VStack spacing={3} pt={8}>
            <Text fontSize="sm" color={textColor}>
              You might also be looking for:
            </Text>
            <HStack spacing={6} flexWrap="wrap" justify="center">
              <Button
                as={RouterLink}
                to="/features"
                variant="link"
                color="blue.500"
                size="sm"
              >
                Features
              </Button>
              <Button
                as={RouterLink}
                to="/services"
                variant="link"
                color="blue.500"
                size="sm"
              >
                Services
              </Button>
              <Button
                as={RouterLink}
                to="/contact"
                variant="link"
                color="blue.500"
                size="sm"
              >
                Contact
              </Button>
              <Button
                as={RouterLink}
                to="/support"
                variant="link"
                color="blue.500"
                size="sm"
              >
                Support
              </Button>
            </HStack>
          </VStack>

          {/* Contact Support */}
          <Box
            bg={useColorModeValue('white', 'gray.800')}
            p={6}
            borderRadius="lg"
            border="1px"
            borderColor={useColorModeValue('gray.200', 'gray.700')}
            w="full"
          >
            <VStack spacing={3}>
              <Text fontSize="sm" color={textColor}>
                Still having trouble?
              </Text>
              <Button
                as={RouterLink}
                to="/contact"
                variant="outline"
                colorScheme="blue"
                size="sm"
              >
                Contact Support
              </Button>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default NotFound;
