// LoginPage component
import React, { useState } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Input,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Alert,
  AlertIcon,
  Image,
  Divider,
  useColorModeValue,
  InputGroup,
  InputRightElement,
  IconButton,
  Card,
  CardBody
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { FaPills } from 'react-icons/fa';
import authService from '../services/authService';

const LoginPage = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    setLoginError('');
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setLoginError('');
    
    try {
      const result = await authService.login(formData.email, formData.password);
      if (result.success) {
        onLogin(result.user);
      } else {
        setLoginError(result.error || 'Login failed. Please try again.');
      }
    } catch (error) {
      setLoginError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (role) => {
    setIsLoading(true);
    setLoginError('');
    
    const demoCredentials = {
      admin: { email: 'admin@pharmgenius.ae', password: 'admin123' },
      pharmacist: { email: 'pharmacist@pharmgenius.ae', password: 'pharma123' },
      clinical: { email: 'clinical@pharmgenius.ae', password: 'clinical123' }
    };
    
    try {
      const creds = demoCredentials[role];
      const result = await authService.login(creds.email, creds.password);
      if (result.success) {
        onLogin(result.user);
      }
    } catch (error) {
      setLoginError('Demo login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box bg={bgColor} minH="100vh" py={12}>
      <Container maxW="lg">
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <VStack spacing={4} textAlign="center">
            <HStack spacing={3} justify="center">
              <Box
                p={3}
                bg="pharmgenius.500"
                borderRadius="xl"
                color="white"
              >
                <FaPills size="32" />
              </Box>
              <VStack spacing={0} align="start">
                <Heading size="xl" color="pharmgenius.600">
                  PharmGenius
                </Heading>
                <Text fontSize="sm" color="gray.600">
                  UAE Healthcare Portal
                </Text>
              </VStack>
            </HStack>
            
            <VStack spacing={2}>
              <Heading size="lg" color="gray.700">
                Welcome Back
              </Heading>
              <Text color="gray.600">
                Sign in to access the pharmaceutical database and management system
              </Text>
            </VStack>
          </VStack>

          {/* Login Form */}
          <Card bg={cardBg} borderColor={borderColor} shadow="lg">
            <CardBody p={8}>
              <form onSubmit={handleSubmit}>
                <VStack spacing={6}>
                  {loginError && (
                    <Alert status="error" borderRadius="md">
                      <AlertIcon />
                      {loginError}
                    </Alert>
                  )}

                  <FormControl isInvalid={errors.email}>
                    <FormLabel color="gray.700">Email Address</FormLabel>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email address"
                      size="lg"
                      focusBorderColor="pharmgenius.500"
                    />
                    <FormErrorMessage>{errors.email}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={errors.password}>
                    <FormLabel color="gray.700">Password</FormLabel>
                    <InputGroup size="lg">
                      <Input
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Enter your password"
                        focusBorderColor="pharmgenius.500"
                      />
                      <InputRightElement>
                        <IconButton
                          variant="ghost"
                          icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        />
                      </InputRightElement>
                    </InputGroup>
                    <FormErrorMessage>{errors.password}</FormErrorMessage>
                  </FormControl>

                  <Button
                    type="submit"
                    colorScheme="pharmgenius"
                    size="lg"
                    width="full"
                    isLoading={isLoading}
                    loadingText="Signing in..."
                  >
                    Sign In
                  </Button>
                </VStack>
              </form>
            </CardBody>
          </Card>

          {/* Note: Demo Access section removed to eliminate hardcoded credentials */}
        </VStack>
      </Container>
    </Box>
  );
};

export default LoginPage;