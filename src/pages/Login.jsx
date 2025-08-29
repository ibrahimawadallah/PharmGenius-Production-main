import React, { useState } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Heading,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  FormErrorMessage,
  Link as ChakraLink,
  useColorModeValue,
  Alert,
  AlertIcon,
  Divider,
  useToast
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const brandColor = useColorModeValue('pharmgenius.600', 'pharmgenius.400');

  // Get the intended destination from location state
  const from = location.state?.from?.pathname || '/dashboard';

  const validateForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await login(email, password);
      
      if (result.success) {
        toast({
          title: 'Login successful',
          description: `Welcome back, ${result.user.firstName}!`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        
        // Navigate to intended destination or dashboard
        navigate(from, { replace: true });
      } else {
        toast({
          title: 'Login failed',
          description: result.error,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Login failed',
        description: 'An unexpected error occurred. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: '' }));
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (errors.password) {
      setErrors(prev => ({ ...prev, password: '' }));
    }
  };

  return (
    <Box 
      bg={useColorModeValue('gray.50', 'gray.900')} 
      minH="100vh" 
      py={20}
      display="flex"
      alignItems="center"
    >
      <Container maxW="md">
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <VStack spacing={4} textAlign="center">
            <Box
              w="16"
              h="16"
              bg={brandColor}
              borderRadius="xl"
              display="flex"
              alignItems="center"
              justifyContent="center"
              mx="auto"
            >
              <Text fontSize="2xl" fontWeight="800" color="white">
                PG
              </Text>
            </Box>
            <Heading size="lg" color={textColor}>
              Welcome back
            </Heading>
            <Text color="gray.600">
              Sign in to your PharmGenius account
            </Text>
          </VStack>

          {/* Login Form */}
          <Box
            bg={bgColor}
            p={8}
            borderRadius="xl"
            border="1px"
            borderColor={borderColor}
            shadow="lg"
          >
            <form onSubmit={handleSubmit}>
              <VStack spacing={6}>
                {/* Email Field */}
                <FormControl isInvalid={!!errors.email}>
                  <FormLabel color={textColor}>Email address</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="Enter your email"
                    size="lg"
                    _focus={{
                      borderColor: brandColor,
                      boxShadow: `0 0 0 1px ${brandColor}`,
                    }}
                  />
                  <FormErrorMessage>{errors.email}</FormErrorMessage>
                </FormControl>

                {/* Password Field */}
                <FormControl isInvalid={!!errors.password}>
                  <FormLabel color={textColor}>Password</FormLabel>
                  <InputGroup size="lg">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={handlePasswordChange}
                      placeholder="Enter your password"
                      _focus={{
                        borderColor: brandColor,
                        boxShadow: `0 0 0 1px ${brandColor}`,
                      }}
                    />
                    <InputRightElement>
                      <IconButton
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                        variant="ghost"
                        onClick={() => setShowPassword(!showPassword)}
                        size="sm"
                      />
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>{errors.password}</FormErrorMessage>
                </FormControl>

                {/* Forgot Password Link */}
                // Inside the Login component render
                <Box w="full" textAlign="right">
                  <ChakraLink
                    as={RouterLink}
                    to="/reset-password"
                    color={brandColor}
                    fontSize="sm"
                    _hover={{ textDecoration: 'underline' }}
                  >
                    Forgot your password?
                  </ChakraLink>
                </Box>

                {/* Submit Button */}
                <Button
                  type="submit"
                  colorScheme="pharmgenius"
                  size="lg"
                  w="full"
                  isLoading={isLoading}
                  loadingText="Signing in..."
                  _hover={{
                    transform: 'translateY(-1px)',
                    boxShadow: 'lg'
                  }}
                  transition="all 0.2s"
                >
                  Sign in
                </Button>
              </VStack>
            </form>
          </Box>

          {/* Divider */}
          <HStack>
            <Divider />
            <Text fontSize="sm" color="gray.500" whiteSpace="nowrap">
              New to PharmGenius?
            </Text>
            <Divider />
          </HStack>

          {/* Sign Up Link */}
          <Button
            as={RouterLink}
            to="/register"
            variant="outline"
            colorScheme="pharmgenius"
            size="lg"
            w="full"
            _hover={{
              bg: useColorModeValue('pharmgenius.50', 'pharmgenius.900'),
              transform: 'translateY(-1px)'
            }}
            transition="all 0.2s"
          >
            Create an account
          </Button>

          {/* Additional Info */}
          <VStack spacing={4} textAlign="center">
            <Text fontSize="sm" color="gray.500">
              By signing in, you agree to our{' '}
              <ChakraLink color={brandColor} _hover={{ textDecoration: 'underline' }}>
                Terms of Service
              </ChakraLink>{' '}
              and{' '}
              <ChakraLink color={brandColor} _hover={{ textDecoration: 'underline' }}>
                Privacy Policy
              </ChakraLink>
            </Text>
            
            <Text fontSize="sm" color="gray.500">
              Need help?{' '}
              <ChakraLink color={brandColor} _hover={{ textDecoration: 'underline' }}>
                Contact support
              </ChakraLink>
            </Text>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
};

export default Login;
