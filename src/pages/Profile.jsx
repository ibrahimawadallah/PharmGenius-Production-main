import React, { useState } from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Card,
  CardBody,
  CardHeader,
  FormControl,
  FormLabel,
  Input,
  Button,
  HStack,
  Avatar,
  useColorModeValue,
  useToast,
  Divider,
  Badge,
  SimpleGrid
} from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';
import { FaUser, FaEnvelope, FaPhone, FaBuilding, FaGraduationCap } from 'react-icons/fa';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.profile?.phone || '',
    specialization: user?.profile?.specialization || '',
    bio: user?.profile?.bio || ''
  });

  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateProfile(formData);
      setIsEditing(false);
      toast({
        title: 'Profile updated successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Failed to update profile',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.profile?.phone || '',
      specialization: user?.profile?.specialization || '',
      bio: user?.profile?.bio || ''
    });
    setIsEditing(false);
  };

  return (
    <Container maxW="4xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <Box textAlign="center">
          <Heading size="2xl" color="blue.600" mb={4}>
            Profile
          </Heading>
          <Text fontSize="lg" color={textColor}>
            Manage your account information and preferences
          </Text>
        </Box>

        {/* Profile Card */}
        <Card bg={bgColor} border="1px" borderColor={borderColor} shadow="lg">
          <CardHeader>
            <HStack spacing={4} align="center">
              <Avatar
                size="xl"
                src={user?.profile?.avatar}
                name={`${user?.firstName} ${user?.lastName}`}
              />
              <Box>
                <Heading size="lg" color="gray.800">
                  {user?.firstName} {user?.lastName}
                </Heading>
                <Text color={textColor}>
                  {user?.profile?.specialization || user?.role}
                </Text>
                <Badge colorScheme="blue" mt={2}>
                  {user?.subscription?.plan} Plan
                </Badge>
              </Box>
            </HStack>
          </CardHeader>
          <CardBody>
            <VStack spacing={6} align="stretch">
              {/* Basic Information */}
              <Box>
                <Heading size="md" color="gray.800" mb={4}>
                  Basic Information
                </Heading>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl>
                    <FormLabel>First Name</FormLabel>
                    <Input
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      isDisabled={!isEditing}
                      leftIcon={<FaUser />}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Last Name</FormLabel>
                    <Input
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      isDisabled={!isEditing}
                      leftIcon={<FaUser />}
                    />
                  </FormControl>
                </SimpleGrid>
              </Box>

              <Divider />

              {/* Contact Information */}
              <Box>
                <Heading size="md" color="gray.800" mb={4}>
                  Contact Information
                </Heading>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      isDisabled={!isEditing}
                      leftIcon={<FaEnvelope />}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Phone</FormLabel>
                    <Input
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      isDisabled={!isEditing}
                      leftIcon={<FaPhone />}
                    />
                  </FormControl>
                </SimpleGrid>
              </Box>

              <Divider />

              {/* Professional Information */}
              <Box>
                <Heading size="md" color="gray.800" mb={4}>
                  Professional Information
                </Heading>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl>
                    <FormLabel>Specialization</FormLabel>
                    <Input
                      value={formData.specialization}
                      onChange={(e) => handleInputChange('specialization', e.target.value)}
                      isDisabled={!isEditing}
                      leftIcon={<FaGraduationCap />}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Organization</FormLabel>
                    <Input
                      value={user?.organization?.name || 'N/A'}
                      isDisabled
                      leftIcon={<FaBuilding />}
                    />
                  </FormControl>
                </SimpleGrid>
                <FormControl mt={4}>
                  <FormLabel>Bio</FormLabel>
                  <Input
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    isDisabled={!isEditing}
                    placeholder="Tell us about yourself..."
                  />
                </FormControl>
              </Box>

              {/* Action Buttons */}
              <HStack spacing={4} justify="flex-end">
                {!isEditing ? (
                  <Button
                    colorScheme="blue"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                    <Button
                      colorScheme="blue"
                      onClick={handleSave}
                      isLoading={isLoading}
                      loadingText="Saving..."
                    >
                      Save Changes
                    </Button>
                  </>
                )}
              </HStack>
            </VStack>
          </CardBody>
        </Card>

        {/* Account Information */}
        <Card bg={bgColor} border="1px" borderColor={borderColor}>
          <CardHeader>
            <Heading size="lg" color="gray.800">
              Account Information
            </Heading>
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <Box>
                <Text fontWeight="semibold" color="gray.700">Account Type</Text>
                <Text color={textColor}>{user?.role}</Text>
              </Box>
              <Box>
                <Text fontWeight="semibold" color="gray.700">Subscription Plan</Text>
                <Text color={textColor}>{user?.subscription?.plan}</Text>
              </Box>
              <Box>
                <Text fontWeight="semibold" color="gray.700">Member Since</Text>
                <Text color={textColor}>
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </Text>
              </Box>
              <Box>
                <Text fontWeight="semibold" color="gray.700">Email Verified</Text>
                <Text color={textColor}>
                  {user?.emailVerified ? 'Yes' : 'No'}
                </Text>
              </Box>
            </SimpleGrid>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
};

export default Profile;
