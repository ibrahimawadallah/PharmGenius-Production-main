import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Link,
  FormErrorMessage,
  useToast,
  Container,
  Card,
  CardBody,
  InputGroup,
  InputRightElement,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription
} from '@chakra-ui/react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isResetMode, setIsResetMode] = useState(!!token);
  const [resetRequested, setResetRequested] = useState(false);
  
  const { forgotPassword, resetPassword } = useAuth();
  const toast = useToast();

  const validateForm = () => {
    const newErrors = {};

    if (isResetMode) {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    } else {
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleRequestReset = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await forgotPassword(formData.email);
      setResetRequested(true);
      
      toast({
        title: 'Reset email sent!',
        description: 'Check your email for password reset instructions.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Reset request failed',
        description: error.message || 'An error occurred while sending reset email',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await resetPassword(token, formData.password);
      
      toast({
        title: 'Password reset successful!',
        description: 'You can now sign in with your new password.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      // Redirect to login after successful reset
      window.location.href = '/login';
    } catch (error) {
      toast({
        title: 'Password reset failed',
        description: error.message || 'An error occurred while resetting password',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (resetRequested && !isResetMode) {
    return (
      <Container maxW="lg" py={12}>
        <Card>
          <CardBody p={8}>
            <VStack spacing={6} align="stretch" textAlign="center">
              <Alert status="success">
                <AlertIcon />
                <Box>
                  <AlertTitle>Reset email sent!</AlertTitle>
                  <AlertDescription>
                    We've sent password reset instructions to your email address.
                    Please check your inbox and follow the link to reset your password.
                  </AlertDescription>
                </Box>
              </Alert>
              
              <Text color="gray.600">
                Didn't receive the email? Check your spam folder or{' '}
                <Button
                  variant="link"
                  color="blue.600"
                  onClick={() => setResetRequested(false)}
                >
                  try again
                </Button>
              </Text>
              
              <Link as={RouterLink} to="/login" color="blue.600" fontWeight="semibold">
                Back to Sign In
              </Link>
            </VStack>
          </CardBody>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxW="lg" py={12}>
      <Card>
        <CardBody p={8}>
          <VStack spacing={6} align="stretch">
            <Box textAlign="center">
              <Heading size="lg" color="blue.600">
                {isResetMode ? 'Reset Your Password' : 'Forgot Your Password?'}
              </Heading>
              <Text color="gray.600" mt={2}>
                {isResetMode 
                  ? 'Enter your new password below'
                  : 'Enter your email address and we\'ll send you a link to reset your password'
                }
              </Text>
            </Box>

            <form onSubmit={isResetMode ? handleResetPassword : handleRequestReset}>
              <VStack spacing={4} align="stretch">
                {!isResetMode && (
                  <FormControl isInvalid={!!errors.email}>
                    <FormLabel>Email Address</FormLabel>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Enter your email address"
                    />
                    <FormErrorMessage>{errors.email}</FormErrorMessage>
                  </FormControl>
                )}

                {isResetMode && (
                  <>
                    <FormControl isInvalid={!!errors.password}>
                      <FormLabel>New Password</FormLabel>
                      <InputGroup>
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          placeholder="Enter your new password"
                        />
                        <InputRightElement>
                          <Button
                            size="sm"
                            onClick={() => setShowPassword(!showPassword)}
                            variant="ghost"
                          >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                          </Button>
                        </InputRightElement>
                      </InputGroup>
                      <FormErrorMessage>{errors.password}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.confirmPassword}>
                      <FormLabel>Confirm New Password</FormLabel>
                      <InputGroup>
                        <Input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                          placeholder="Confirm your new password"
                        />
                        <InputRightElement>
                          <Button
                            size="sm"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            variant="ghost"
                          >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                          </Button>
                        </InputRightElement>
                      </InputGroup>
                      <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
                    </FormControl>
                  </>
                )}

                <Button
                  type="submit"
                  colorScheme="blue"
                  size="lg"
                  isLoading={isLoading}
                  loadingText={isResetMode ? "Resetting Password..." : "Sending Reset Email..."}
                >
                  {isResetMode ? 'Reset Password' : 'Send Reset Email'}
                </Button>
              </VStack>
            </form>

            <Box textAlign="center">
              <Text color="gray.600">
                Remember your password?{' '}
                <Link as={RouterLink} to="/login" color="blue.600" fontWeight="semibold">
                  Sign in
                </Link>
              </Text>
            </Box>
          </VStack>
        </CardBody>
      </Card>
    </Container>
  );
};

export default ResetPassword;
