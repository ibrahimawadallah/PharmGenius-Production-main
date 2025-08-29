import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  GridItem,
  Heading,
  Text,
  Card,
  CardBody,
  CardHeader,
  VStack,
  HStack,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Button,
  Badge,
  Avatar,
  Divider,
  SimpleGrid,
  Icon,
  useColorModeValue,
  Flex,
  Spacer,
  Progress,
  List,
  ListItem,
  ListIcon
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  FaUserMd, 
  FaGraduationCap, 
  FaCalendarAlt, 
  FaChartLine,
  FaPills,
  FaComments,
  FaBook,
  FaBell,
  FaCog,
  FaPlus,
  FaArrowRight,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user, hasRole } = useAuth();
  const [stats, setStats] = useState({
    consultations: { total: 0, upcoming: 0, completed: 0 },
    courses: { enrolled: 0, completed: 0, inProgress: 0 },
    drugs: { searched: 0, saved: 0 },
    notifications: { unread: 0, total: 0 }
  });
  
  const [recentActivities, setRecentActivities] = useState([]);
  const [quickActions, setQuickActions] = useState([]);
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    // Simulate loading dashboard data
    // In a real app, this would fetch from your API
    setStats({
      consultations: { total: 12, upcoming: 2, completed: 10 },
      courses: { enrolled: 5, completed: 2, inProgress: 3 },
      drugs: { searched: 45, saved: 8 },
      notifications: { unread: 3, total: 15 }
    });

    setRecentActivities([
      {
        id: 1,
        type: 'consultation',
        title: 'Medication Review Completed',
        description: 'Dr. Sarah completed your medication review',
        timestamp: '2 hours ago',
        status: 'completed'
      },
      {
        id: 2,
        type: 'course',
        title: 'Course Progress Updated',
        description: 'Completed Module 2 of Clinical Pharmacology',
        timestamp: '1 day ago',
        status: 'completed'
      },
      {
        id: 3,
        type: 'drug',
        title: 'Drug Interaction Alert',
        description: 'New interaction found for your medications',
        timestamp: '2 days ago',
        status: 'alert'
      }
    ]);

    setQuickActions([
      {
        title: 'Book Consultation',
        description: 'Schedule a new consultation',
        icon: FaCalendarAlt,
        color: 'blue',
        link: '/consultations/book'
      },
      {
        title: 'Search Drugs',
        description: 'Look up medication information',
        icon: FaPills,
        color: 'green',
        link: '/drug-search'
      },
      {
        title: 'Browse Courses',
        description: 'Explore learning modules',
        icon: FaGraduationCap,
        color: 'purple',
        link: '/courses'
      }
    ]);
  }, []);

  const getRoleBasedStats = () => {
    if (hasRole('admin')) {
      return [
        { label: 'Total Users', value: '1,247', change: '+12%', changeType: 'increase' },
        { label: 'Active Organizations', value: '89', change: '+5%', changeType: 'increase' },
        { label: 'Revenue (Monthly)', value: '$45,230', change: '+18%', changeType: 'increase' },
        { label: 'System Health', value: '99.9%', change: '0%', changeType: 'neutral' }
      ];
    } else if (hasRole('provider')) {
      return [
        { label: 'Active Patients', value: '156', change: '+8%', changeType: 'increase' },
        { label: 'Consultations (This Month)', value: '89', change: '+15%', changeType: 'increase' },
        { label: 'Course Completions', value: '23', change: '+12%', changeType: 'increase' },
        { label: 'Patient Satisfaction', value: '4.8/5', change: '+0.2', changeType: 'increase' }
      ];
    } else {
      return [
        { label: 'Consultations', value: stats.consultations.total.toString(), change: '+2', changeType: 'increase' },
        { label: 'Courses Enrolled', value: stats.courses.enrolled.toString(), change: '+1', changeType: 'increase' },
        { label: 'Drugs Searched', value: stats.drugs.searched.toString(), change: '+5', changeType: 'increase' },
        { label: 'Health Score', value: '85%', change: '+3%', changeType: 'increase' }
      ];
    }
  };

  const getRoleBasedQuickActions = () => {
    if (hasRole('admin')) {
      return [
        ...quickActions,
        {
          title: 'User Management',
          description: 'Manage users and permissions',
          icon: FaUserMd,
          color: 'orange',
          link: '/admin/users'
        },
        {
          title: 'Analytics',
          description: 'View system analytics',
          icon: FaChartLine,
          color: 'teal',
          link: '/admin/analytics'
        }
      ];
    } else if (hasRole('provider')) {
      return [
        ...quickActions,
        {
          title: 'Patient Records',
          description: 'Access patient information',
          icon: FaUserMd,
          color: 'orange',
          link: '/patients'
        },
        {
          title: 'Schedule Management',
          description: 'Manage your availability',
          icon: FaCog,
          color: 'gray',
          link: '/schedule'
        }
      ];
    }
    return quickActions;
  };

  return (
    <Container maxW="7xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <Box>
          <HStack justify="space-between" align="center">
            <Box>
              <Heading size="lg" color="blue.600">
                Welcome back, {user?.firstName || 'User'}!
              </Heading>
              <Text color="gray.600" mt={2}>
                Here's what's happening with your healthcare journey today
              </Text>
            </Box>
            <HStack spacing={4}>
              <Button
                leftIcon={<FaBell />}
                variant="outline"
                colorScheme="blue"
                size="sm"
              >
                Notifications ({stats.notifications.unread})
              </Button>
              <Button
                leftIcon={<FaCog />}
                variant="ghost"
                size="sm"
                as={RouterLink}
                to="/profile"
              >
                Settings
              </Button>
            </HStack>
          </HStack>
        </Box>

        {/* Stats Grid */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
          {getRoleBasedStats().map((stat, index) => (
            <Card key={index} bg={bgColor} border="1px" borderColor={borderColor}>
              <CardBody>
                <Stat>
                  <StatLabel color="gray.600" fontSize="sm">
                    {stat.label}
                  </StatLabel>
                  <StatNumber fontSize="2xl" fontWeight="bold">
                    {stat.value}
                  </StatNumber>
                  <StatHelpText>
                    <StatArrow 
                      type={stat.changeType === 'increase' ? 'increase' : 'decrease'} 
                    />
                    {stat.change}
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>

        {/* Main Content Grid */}
        <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={8}>
          {/* Left Column - Main Content */}
          <GridItem>
            <VStack spacing={6} align="stretch">
              {/* Quick Actions */}
              <Card bg={bgColor} border="1px" borderColor={borderColor}>
                <CardHeader>
                  <Heading size="md">Quick Actions</Heading>
                </CardHeader>
                <CardBody>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    {getRoleBasedQuickActions().map((action, index) => (
                      <Button
                        key={index}
                        as={RouterLink}
                        to={action.link}
                        variant="outline"
                        size="lg"
                        height="auto"
                        p={4}
                        textAlign="left"
                        justifyContent="flex-start"
                        leftIcon={<Icon as={action.icon} color={`${action.color}.500`} />}
                        rightIcon={<FaArrowRight />}
                        _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
                        transition="all 0.2s"
                      >
                        <Box>
                          <Text fontWeight="semibold">{action.title}</Text>
                          <Text fontSize="sm" color="gray.600">
                            {action.description}
                          </Text>
                        </Box>
                      </Button>
                    ))}
                  </SimpleGrid>
                </CardBody>
              </Card>

              {/* Recent Activities */}
              <Card bg={bgColor} border="1px" borderColor={borderColor}>
                <CardHeader>
                  <Heading size="md">Recent Activities</Heading>
                </CardHeader>
                <CardBody>
                  <VStack spacing={4} align="stretch">
                    {recentActivities.map((activity) => (
                      <Box key={activity.id} p={4} border="1px" borderColor="gray.200" borderRadius="md">
                        <HStack spacing={3} align="flex-start">
                          <Icon
                            as={
                              activity.type === 'consultation' ? FaComments :
                              activity.type === 'course' ? FaGraduationCap :
                              FaPills
                            }
                            color={
                              activity.status === 'completed' ? 'green.500' :
                              activity.status === 'alert' ? 'red.500' :
                              'blue.500'
                            }
                            mt={1}
                          />
                          <Box flex={1}>
                            <Text fontWeight="semibold">{activity.title}</Text>
                            <Text fontSize="sm" color="gray.600">
                              {activity.description}
                            </Text>
                            <Text fontSize="xs" color="gray.500" mt={1}>
                              {activity.timestamp}
                            </Text>
                          </Box>
                          <Badge
                            colorScheme={
                              activity.status === 'completed' ? 'green' :
                              activity.status === 'alert' ? 'red' :
                              'blue'
                            }
                            size="sm"
                          >
                            {activity.status}
                          </Badge>
                        </HStack>
                      </Box>
                    ))}
                  </VStack>
                </CardBody>
              </Card>
            </VStack>
          </GridItem>

          {/* Right Column - Sidebar */}
          <GridItem>
            <VStack spacing={6} align="stretch">
              {/* Profile Summary */}
              <Card bg={bgColor} border="1px" borderColor={borderColor}>
                <CardBody textAlign="center">
                  <Avatar
                    size="xl"
                    src={user?.profile?.avatar}
                    name={`${user?.firstName} ${user?.lastName}`}
                    mb={4}
                  />
                  <Heading size="md">{user?.firstName} {user?.lastName}</Heading>
                  <Text color="gray.600" mb={3}>
                    {user?.profile?.specialization || user?.role}
                  </Text>
                  <Badge colorScheme="blue" mb={4}>
                    {user?.subscription?.plan} Plan
                  </Badge>
                  <Button
                    as={RouterLink}
                    to="/profile"
                    size="sm"
                    variant="outline"
                    colorScheme="blue"
                    leftIcon={<FaCog />}
                  >
                    Edit Profile
                  </Button>
                </CardBody>
              </Card>

              {/* Progress Summary */}
              <Card bg={bgColor} border="1px" borderColor={borderColor}>
                <CardHeader>
                  <Heading size="md">Your Progress</Heading>
                </CardHeader>
                <CardBody>
                  <VStack spacing={4} align="stretch">
                    <Box>
                      <HStack justify="space-between" mb={2}>
                        <Text fontSize="sm">Courses</Text>
                        <Text fontSize="sm" fontWeight="semibold">
                          {stats.courses.completed}/{stats.courses.enrolled}
                        </Text>
                      </HStack>
                      <Progress
                        value={(stats.courses.completed / stats.courses.enrolled) * 100}
                        colorScheme="blue"
                        size="sm"
                      />
                    </Box>
                    
                    <Box>
                      <HStack justify="space-between" mb={2}>
                        <Text fontSize="sm">Consultations</Text>
                        <Text fontSize="sm" fontWeight="semibold">
                          {stats.consultations.completed}/{stats.consultations.total}
                        </Text>
                      </HStack>
                      <Progress
                        value={(stats.consultations.completed / stats.consultations.total) * 100}
                        colorScheme="green"
                        size="sm"
                      />
                    </Box>
                  </VStack>
                </CardBody>
              </Card>

              {/* Upcoming Appointments */}
              {stats.consultations.upcoming > 0 && (
                <Card bg={bgColor} border="1px" borderColor={borderColor}>
                  <CardHeader>
                    <Heading size="md">Upcoming</Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={3} align="stretch">
                      <HStack spacing={3}>
                        <Icon as={FaClock} color="blue.500" />
                        <Box>
                          <Text fontWeight="semibold">Medication Review</Text>
                          <Text fontSize="sm" color="gray.600">
                            Tomorrow at 2:00 PM
                          </Text>
                        </Box>
                      </HStack>
                      <Button
                        size="sm"
                        variant="outline"
                        colorScheme="blue"
                        leftIcon={<FaCalendarAlt />}
                      >
                        View Details
                      </Button>
                    </VStack>
                  </CardBody>
                </Card>
              )}
            </VStack>
          </GridItem>
        </Grid>
      </VStack>
    </Container>
  );
};

export default Dashboard;
