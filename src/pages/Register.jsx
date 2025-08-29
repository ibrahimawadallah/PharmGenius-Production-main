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
  Select,
  FormErrorMessage,
  useToast,
  Container,
  Card,
  CardBody,
  HStack,
  Divider,
  Icon,
  InputGroup,
  InputRightElement
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaUserMd, FaUser, FaBuilding } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'basic',
    organizationName: '',
    specialization: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (formData.role === 'provider' && !formData.specialization.trim()) {
      newErrors.specialization = 'Specialization is required for healthcare providers';
    }

    if (formData.role === 'admin' && !formData.organizationName.trim()) {
      newErrors.organizationName = 'Organization name is required for administrators';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const registrationData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        ...(formData.organizationName && { organizationName: formData.organizationName }),
        ...(formData.specialization && { specialization: formData.specialization })
      };

      await register(registrationData);
      
      toast({
        title: 'Registration successful!',
        description: 'Welcome to PharmGenius. Please check your email to verify your account.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Registration failed',
        description: error.message || 'An error occurred during registration',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleDescription = (role) => {
    switch (role) {
      case 'basic':
        return 'Access to drug database and basic consultations';
      case 'provider':
        return 'Full access including patient consultations and learning modules';
      case 'admin':
        return 'Complete system access with organization management';
      default:
        return '';
    }
  };

  return (
    <Container maxW="lg" py={12}>
      <Card>
        <CardBody p={8}>
          <VStack spacing={6} align="stretch">
            <Box textAlign="center">
              <Heading size="lg" color="blue.600">
                Join PharmGenius
              </Heading>
              <Text color="gray.600" mt={2}>
                Start your healthcare journey today
              </Text>
            </Box>

            <form onSubmit={handleSubmit}>
              <VStack spacing={4} align="stretch">
                <HStack spacing={4}>
                  <FormControl isInvalid={!!errors.firstName}>
                    <FormLabel>First Name</FormLabel>
                    <Input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      placeholder="Enter your first name"
                    />
                    <FormErrorMessage>{errors.firstName}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.lastName}>
                    <FormLabel>Last Name</FormLabel>
                    <Input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      placeholder="Enter your last name"
                    />
                    <FormErrorMessage>{errors.lastName}</FormErrorMessage>
                  </FormControl>
                </HStack>

                <FormControl isInvalid={!!errors.email}>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter your email address"
                  />
                  <FormErrorMessage>{errors.email}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.role}>
                  <FormLabel>Account Type</FormLabel>
                  <Select
                    value={formData.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                  >
                    <option value="basic">
                      <Icon as={FaUser} mr={2} />
                      Basic User
                    </option>
                    <option value="provider">
                      <Icon as={FaUserMd} mr={2} />
                      Healthcare Provider
                    </option>
                    <option value="admin">
                      <Icon as={FaBuilding} mr={2} />
                      Administrator
                    </option>
                  </Select>
                  <Text fontSize="sm" color="gray.600" mt={1}>
                    {getRoleDescription(formData.role)}
                  </Text>
                </FormControl>

                {formData.role === 'provider' && (
                  <FormControl isInvalid={!!errors.specialization}>
                    <FormLabel>Specialization</FormLabel>
                    <Input
                      type="text"
                      value={formData.specialization}
                      onChange={(e) => handleInputChange('specialization', e.target.value)}
                      placeholder="e.g., Clinical Pharmacy, Mental Health, Pediatrics"
                    />
                    <FormErrorMessage>{errors.specialization}</FormErrorMessage>
                  </FormControl>
                )}

                {formData.role === 'admin' && (
                  <FormControl isInvalid={!!errors.organizationName}>
                    <FormLabel>Organization Name</FormLabel>
                    <Input
                      type="text"
                      value={formData.organizationName}
                      onChange={(e) => handleInputChange('organizationName', e.target.value)}
                      placeholder="Enter your organization name"
                    />
                    <FormErrorMessage>{errors.organizationName}</FormErrorMessage>
                  </FormControl>
                )}

                <FormControl isInvalid={!!errors.password}>
                  <FormLabel>Password</FormLabel>
                  <InputGroup>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="Create a strong password"
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
                  <FormLabel>Confirm Password</FormLabel>
                  <InputGroup>
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      placeholder="Confirm your password"
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

                <Button
                  type="submit"
                  colorScheme="blue"
                  size="lg"
                  isLoading={isLoading}
                  loadingText="Creating Account..."
                >
                  Create Account
                </Button>
              </VStack>
            </form>

            <Divider />

            <Box textAlign="center">
              <Text color="gray.600">
                Already have an account?{' '}
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

export default Register;
