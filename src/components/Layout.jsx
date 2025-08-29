import React from 'react';
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
  useColorModeValue,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Divider,
  Icon
} from '@chakra-ui/react';
import { 
  HamburgerIcon,
  ChevronDownIcon,
  BellIcon,
  SettingsIcon,
  ChevronRightIcon
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
  FaFlask
} from 'react-icons/fa';

const Layout = ({ user, onLogout, activeSection, setActiveSection, availableFeatures, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  const getSectionTitle = (section) => {
    const feature = availableFeatures.find(f => f.id === section);
    return feature ? feature.name : section.replace('-', ' ');
  };

  return (
    <Box minH="100vh" bg={bgColor}>
      {/* Top Navigation Bar */}
      <Box bg="white" borderBottom="2px" borderColor="pharmgenius.100" shadow="sm" position="sticky" top="0" zIndex="1000">
        <Container maxW="full" px={6}>
          <Flex h="16" align="center" justify="space-between">
            {/* Left Side - Logo & Menu */}
            <HStack spacing={4}>
              <IconButton
                icon={<HamburgerIcon />}
                variant="ghost"
                colorScheme="pharmgenius"
                aria-label="Open menu"
                onClick={onOpen}
                display={{ base: 'flex', lg: 'none' }}
              />
              <Box>
                <Heading size="lg" color="pharmgenius.600" fontWeight="800">
                  PharmGenius
                </Heading>
                <Text fontSize="xs" color="gray.500" mt="-1" fontWeight="500">
                  Healthcare Portal • UAE Health Authority
                </Text>
              </Box>
            </HStack>
            
            {/* Center - Breadcrumb */}
            <Box display={{ base: 'none', md: 'block' }}>
              <Breadcrumb spacing="8px" separator={<ChevronRightIcon color="gray.400" />}>
                <BreadcrumbItem>
                  <BreadcrumbLink color="pharmgenius.600" fontWeight="500">Healthcare</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem isCurrentPage>
                  <BreadcrumbLink color="gray.600" fontWeight="500" textTransform="capitalize">
                    {getSectionTitle(activeSection)}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </Breadcrumb>
            </Box>
            
            {/* Right Side - Actions & Profile */}
            <HStack spacing={3}>
              <IconButton
                icon={<BellIcon />}
                variant="ghost"
                colorScheme="pharmgenius"
                aria-label="Notifications"
                size="sm"
              />
              <IconButton
                icon={<SettingsIcon />}
                variant="ghost"
                colorScheme="pharmgenius"
                aria-label="Settings"
                size="sm"
              />
              <Menu>
                <MenuButton as={Button} variant="ghost" size="sm" rightIcon={<ChevronDownIcon />}>
                  <HStack spacing={2}>
                    <Avatar size="sm" name={user?.name} bg="pharmgenius.500" />
                    <Box textAlign="left" display={{ base: 'none', md: 'block' }}>
                      <Text fontSize="sm" fontWeight="600">{user?.name}</Text>
                      <Text fontSize="xs" color="gray.500">{user?.role}</Text>
                    </Box>
                  </HStack>
                </MenuButton>
                <MenuList>
                  <MenuItem icon={<Icon as={FaUserMd} />}>My Profile</MenuItem>
                  <MenuItem icon={<Icon as={FaCog} />}>Settings</MenuItem>
                  <MenuItem icon={<Icon as={FaFileAlt} />}>My Reports</MenuItem>
                  <Divider />
                  <MenuItem icon={<Icon as={FaSignOutAlt} />} color="red.500" onClick={onLogout}>
                    Sign Out
                  </MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          </Flex>
        </Container>
      </Box>

      <Flex>
        {/* Sidebar Navigation - Desktop */}
        <Box
          w="280px"
          bg="white"
          borderRight="2px"
          borderColor="gray.100"
          minH="calc(100vh - 64px)"
          display={{ base: 'none', lg: 'block' }}
          position="sticky"
          top="64px"
        >
          <VStack spacing={1} p={4} align="stretch">
            {availableFeatures.map((feature) => {
              const IconComponent = {
                'FaHome': FaHome,
                'FaPills': FaPills,
                'FaDatabase': FaDatabase,
                'FaHospital': FaHospital,
                'FaFileAlt': FaFileAlt,
                'FaFlask': FaFlask,
                'FaUsers': FaUsers
              }[feature.icon] || FaHome;

              return (
                <Button
                  key={feature.id}
                  variant={activeSection === feature.id ? 'solid' : 'ghost'}
                  colorScheme="pharmgenius"
                  justifyContent="flex-start"
                  leftIcon={<Icon as={IconComponent} />}
                  onClick={() => setActiveSection(feature.id)}
                  size="md"
                  fontWeight="500"
                  borderRadius="12px"
                  py={6}
                >
                  {feature.name}
                </Button>
              );
            })}
          </VStack>
        </Box>

        {/* Mobile Sidebar Drawer */}
        <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader borderBottomWidth="1px" color="pharmgenius.700">
              <Icon as={FaHospital} mr={2} />
              PharmGenius Portal
            </DrawerHeader>
            <DrawerBody p={0}>
              <VStack spacing={1} p={4} align="stretch">
                {availableFeatures.map((feature) => {
                  const IconComponent = {
                    'FaHome': FaHome,
                    'FaPills': FaPills,
                    'FaDatabase': FaDatabase,
                    'FaHospital': FaHospital,
                    'FaFileAlt': FaFileAlt,
                    'FaFlask': FaFlask,
                    'FaUsers': FaUsers
                  }[feature.icon] || FaHome;

                  return (
                    <Button
                      key={feature.id}
                      variant={activeSection === feature.id ? 'solid' : 'ghost'}
                      colorScheme="pharmgenius"
                      justifyContent="flex-start"
                      leftIcon={<Icon as={IconComponent} />}
                      onClick={() => {
                        setActiveSection(feature.id);
                        onClose();
                      }}
                      size="md"
                      fontWeight="500"
                      borderRadius="12px"
                      py={6}
                    >
                      {feature.name}
                    </Button>
                  );
                })}
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>

        {/* Main Content Area */}
        <Box flex="1" p={6}>
          <Container maxW="full">
            {children}
          </Container>
        </Box>
      </Flex>
    </Box>
  );
};

export default Layout;