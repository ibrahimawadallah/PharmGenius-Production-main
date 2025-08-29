import React from 'react';
import { Box, Heading, Text, SimpleGrid, Card, CardBody, CardHeader, Button, VStack, HStack, Badge, Icon } from '@chakra-ui/react';
import { FaGraduationCap, FaClock, FaUserGraduate, FaStar } from 'react-icons/fa';

const Courses = () => {
  const courses = [
    {
      id: 1,
      title: "Pharmacy Fundamentals",
      description: "Learn the basics of pharmaceutical science and drug interactions",
      duration: "8 weeks",
      students: 1250,
      rating: 4.8,
      level: "Beginner",
      category: "Core"
    },
    {
      id: 2,
      title: "Clinical Pharmacology",
      description: "Advanced study of drug mechanisms and therapeutic applications",
      duration: "12 weeks",
      students: 890,
      rating: 4.9,
      level: "Advanced",
      category: "Specialized"
    },
    {
      id: 3,
      title: "Drug Safety & Regulations",
      description: "Understanding pharmaceutical regulations and safety protocols",
      duration: "6 weeks",
      students: 2100,
      rating: 4.7,
      level: "Intermediate",
      category: "Compliance"
    },
    {
      id: 4,
      title: "Patient Care & Communication",
      description: "Developing skills for effective patient interaction and care",
      duration: "10 weeks",
      students: 1560,
      rating: 4.6,
      level: "Intermediate",
      category: "Skills"
    }
  ];

  return (
    <Box p={6} maxW="1200px" mx="auto">
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading size="2xl" mb={4} color="blue.600">
            Professional Development Courses
          </Heading>
          <Text fontSize="lg" color="gray.600">
            Enhance your pharmaceutical knowledge with our comprehensive course offerings
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 2 }} spacing={6}>
          {courses.map((course) => (
            <Card key={course.id} shadow="md" _hover={{ shadow: "lg" }} transition="all 0.3s">
              <CardHeader>
                <HStack justify="space-between" align="start">
                  <VStack align="start" spacing={2}>
                    <Heading size="md" color="blue.600">
                      {course.title}
                    </Heading>
                    <Badge colorScheme={course.category === 'Core' ? 'blue' : course.category === 'Specialized' ? 'purple' : course.category === 'Compliance' ? 'green' : 'orange'}>
                      {course.category}
                    </Badge>
                  </VStack>
                  <Icon as={FaGraduationCap} color="blue.500" boxSize={6} />
                </HStack>
              </CardHeader>
              
              <CardBody>
                <VStack align="stretch" spacing={4}>
                  <Text color="gray.600">
                    {course.description}
                  </Text>
                  
                  <HStack justify="space-between" color="gray.500" fontSize="sm">
                    <HStack>
                      <Icon as={FaClock} />
                      <Text>{course.duration}</Text>
                    </HStack>
                    <HStack>
                      <Icon as={FaUserGraduate} />
                      <Text>{course.students} students</Text>
                    </HStack>
                    <HStack>
                      <Icon as={FaStar} color="yellow.400" />
                      <Text>{course.rating}</Text>
                    </HStack>
                  </HStack>
                  
                  <HStack justify="space-between">
                    <Badge colorScheme={course.level === 'Beginner' ? 'green' : course.level === 'Intermediate' ? 'yellow' : 'red'}>
                      {course.level}
                    </Badge>
                    <Button colorScheme="blue" size="sm">
                      Enroll Now
                    </Button>
                  </HStack>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>

        <Box textAlign="center" py={8}>
          <Text fontSize="lg" color="gray.600" mb={4}>
            Ready to advance your pharmaceutical career?
          </Text>
          <Button colorScheme="blue" size="lg">
            View All Courses
          </Button>
        </Box>
      </VStack>
    </Box>
  );
};

export default Courses;
