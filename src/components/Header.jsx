import React, { useState } from 'react';
import {
  Box,
  Flex,
  HStack,
  VStack,
  Text,
  Button,
  Container,
  Heading,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  useColorMode,
  useColorModeValue,
  Divider,
  Badge,
  Link as ChakraLink
} from '@chakra-ui/react';
import { 
  HamburgerIcon,
  ChevronDownIcon,
  MoonIcon,
  SunIcon,
  BellIcon,
  SearchIcon
} from '@chakra-ui/icons';
import { 
  FaUserMd, 
  FaPills, 
  FaHome,
  FaDatabase,
  FaFileAlt,
  FaUsers,
  FaCog,
  FaSignOutAlt,
  FaHospital,
  FaFlask,
  FaGraduationCap,
  FaChartLine,
  FaTools
} from 'react-icons/fa';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = ({ onToggleColorMode }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const brandColor = useColorModeValue('pharmgenius.600', 'pharmgenius.400');

  const navigationItems = [
    { name: 'Home', path: '/', icon: FaHome },
    { name: 'Features', path: '/features', icon: FaFlask },
    { name: 'Services', path: '/services', icon: FaHospital },
    { name: 'Tools', path: '/tools', icon: FaTools },
    { name: 'About', path: '/about', icon: FaUsers },
    { name: 'Pricing', path: '/pricing', icon: FaChartLine },
    { name: 'Investors', path: '/investors', icon: FaDatabase },
    { name: 'Blog', path: '/blog', icon: FaFileAlt },
    { name: 'FAQ', path: '/faq', icon: FaFileAlt },
    { name: 'Contact', path: '/contact', icon: FaUsers },
  ];

  const authenticatedNavItems = [
    { name: 'Dashboard', path: '/dashboard', icon: FaHome, feature: 'basic_dashboard' },
    { name: 'Drug Search', path: '/drug-search', icon: FaPills, feature: 'drug_search' },
    { name: 'Consultations', path: '/consultations', icon: FaUserMd, feature: 'consultations' },
    { name: 'Courses', path: '/courses', icon: FaGraduationCap, feature: 'learning_modules' },
    { name: 'Profile', path: '/profile', icon: FaCog, feature: 'user_management' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
    onClose();
  };

  const isActiveRoute = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const canAccessFeature = (feature) => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    if (!user.subscription) return false;
    return user.subscription.features.includes(feature);
  };

  return (
    <Box 
      bg={bgColor} 
      borderBottom="1px" 
      borderColor={borderColor} 
      position="sticky" 
      top="0" 
      zIndex="1000"
      shadow="sm"
    >
      <Container maxW="full" px={6}>
        <Flex h="16" align="center" justify="space-between">
          {/* Logo and Brand */}
          <HStack spacing={4}>
            <IconButton
              icon={<HamburgerIcon />}
              variant="ghost"
              colorScheme="pharmgenius"
              aria-label="Open menu"
              onClick={onOpen}
              display={{ base: 'flex', lg: 'none' }}
            />
            
            <ChakraLink as={RouterLink} to="/" _hover={{ textDecoration: 'none' }}>
              <HStack spacing={2}>
                <Box 
                  w="8" 
                  h="8" 
                  bg={brandColor} 
                  borderRadius="lg" 
                  display="flex" 
                  alignItems="center" 
                  justifyContent="center"
                >
                  <FaPills color="white" size="16" />
                </Box>
                <VStack spacing={0} align="start">
                  <Heading size="md" color={brandColor} fontWeight="800">
                    PharmGenius
                  </Heading>
                  <Text fontSize="xs" color="gray.500" fontWeight="500">
                    Healthcare Portal
                  </Text>
                </VStack>
              </HStack>
            </ChakraLink>
          </HStack>

          {/* Desktop Navigation */}
          <HStack spacing={8} display={{ base: 'none', lg: 'flex' }}>
            {navigationItems.map((item) => (
              <ChakraLink
                key={item.path}
                as={RouterLink}
                to={item.path}
                px={3}
                py={2}
                borderRadius="md"
                fontWeight="500"
                color={isActiveRoute(item.path) ? brandColor : textColor}
                bg={isActiveRoute(item.path) ? useColorModeValue('pharmgenius.50', 'pharmgenius.900') : 'transparent'}
                _hover={{
                  textDecoration: 'none',
                  bg: useColorModeValue('pharmgenius.50', 'pharmgenius.900'),
                  color: brandColor
                }}
              >
                {item.name}
              </ChakraLink>
            ))}
          </HStack>

          {/* Right Side Actions */}
          <HStack spacing={3}>
            {/* Color Mode Toggle */}
            <IconButton
              icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              variant="ghost"
              colorScheme="pharmgenius"
              aria-label="Toggle color mode"
              onClick={toggleColorMode}
              size="sm"
            />

            {/* Search Button */}
            <IconButton
              icon={<SearchIcon />}
              variant="ghost"
              colorScheme="pharmgenius"
              aria-label="Search"
              size="sm"
              onClick={() => navigate('/drug-search')}
            />

            {/* Notifications */}
            {isAuthenticated && (
              <IconButton
                icon={<BellIcon />}
                variant="ghost"
                colorScheme="pharmgenius"
                aria-label="Notifications"
                size="sm"
              />
            )}

            {/* User Menu or Auth Buttons */}
            {isAuthenticated ? (
              <Menu>
                <MenuButton as={Button} variant="ghost" size="sm" rightIcon={<ChevronDownIcon />}>
                  <HStack spacing={2}>
                    <Avatar 
                      size="sm" 
                      name={`${user?.firstName} ${user?.lastName}`} 
                      bg={brandColor}
                      src={user?.profileImage}
                    />
                    <Box textAlign="left" display={{ base: 'none', md: 'block' }}>
                      <Text fontSize="sm" fontWeight="600">
                        {user?.firstName} {user?.lastName}
                      </Text>
                      <HStack spacing={1}>
                        <Text fontSize="xs" color="gray.500" textTransform="capitalize">
                          {user?.role}
                        </Text>
                        {user?.subscription && (
                          <Badge size="sm" colorScheme="green" variant="subtle">
                            {user.subscription.plan}
                          </Badge>
                        )}
                      </HStack>
                    </Box>
                  </HStack>
                </MenuButton>
                <MenuList>
                  <MenuItem icon={<FaHome />} onClick={() => navigate('/dashboard')}>
                    Dashboard
                  </MenuItem>
                  <MenuItem icon={<FaUserMd />} onClick={() => navigate('/profile')}>
                    My Profile
                  </MenuItem>
                  <MenuItem icon={<FaCog />} onClick={() => navigate('/profile')}>
                    Settings
                  </MenuItem>
                  <Divider />
                  <MenuItem icon={<FaSignOutAlt />} color="red.500" onClick={handleLogout}>
                    Sign Out
                  </MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <HStack spacing={2}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/login')}
                >
                  Sign In
                </Button>
                <Button
                  colorScheme="pharmgenius"
                  size="sm"
                  onClick={() => navigate('/register')}
                >
                  Get Started
                </Button>
              </HStack>
            )}
          </HStack>
        </Flex>
      </Container>

      {/* Mobile Navigation Drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px" color={brandColor}>
            <HStack spacing={2}>
              <Box 
                w="6" 
                h="6" 
                bg={brandColor} 
                borderRadius="md" 
                display="flex" 
                alignItems="center" 
                justifyContent="center"
              >
                <FaPills color="white" size="12" />
              </Box>
              <Text fontWeight="600">PharmGenius</Text>
            </HStack>
          </DrawerHeader>
          <DrawerBody p={0}>
            <VStack spacing={1} p={4} align="stretch">
              {/* Public Navigation */}
              {navigationItems.map((item) => (
                <Button
                  key={item.path}
                  variant={isActiveRoute(item.path) ? 'solid' : 'ghost'}
                  colorScheme="pharmgenius"
                  justifyContent="flex-start"
                  leftIcon={<item.icon />}
                  onClick={() => {
                    navigate(item.path);
                    onClose();
                  }}
                  size="md"
                  fontWeight="500"
                  borderRadius="12px"
                  py={6}
                >
                  {item.name}
                </Button>
              ))}

              {/* Divider for authenticated users */}
              {isAuthenticated && (
                <>
                  <Divider my={4} />
                  <Text fontSize="sm" fontWeight="600" color="gray.500" px={3} py={2}>
                    My Account
                  </Text>
                </>
              )}

              {/* Authenticated Navigation */}
              {isAuthenticated && authenticatedNavItems.map((item) => {
                if (!canAccessFeature(item.feature)) return null;
                
                return (
                  <Button
                    key={item.path}
                    variant={isActiveRoute(item.path) ? 'solid' : 'ghost'}
                    colorScheme="pharmgenius"
                    justifyContent="flex-start"
                    leftIcon={<item.icon />}
                    onClick={() => {
                      navigate(item.path);
                      onClose();
                    }}
                    size="md"
                    fontWeight="500"
                    borderRadius="12px"
                    py={6}
                  >
                    {item.name}
                  </Button>
                );
              })}

              {/* Logout for authenticated users */}
              {isAuthenticated && (
                <Button
                  variant="ghost"
                  colorScheme="red"
                  justifyContent="flex-start"
                  leftIcon={<FaSignOutAlt />}
                  onClick={handleLogout}
                  size="md"
                  fontWeight="500"
                  borderRadius="12px"
                  py={6}
                >
                  Sign Out
                </Button>
              )}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Header;
