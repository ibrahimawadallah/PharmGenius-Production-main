import React, { useState } from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  Card,
  CardBody,
  CardHeader,
  SimpleGrid,
  HStack,
  Badge,
  useColorModeValue,
  Avatar,
  Image
} from '@chakra-ui/react';
import { FaSearch, FaCalendar, FaUser, FaEye, FaHeart } from 'react-icons/fa';

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  const blogPosts = [
    {
      id: 1,
      title: 'The Future of Personalized Medicine',
      excerpt: 'How AI and genomics are revolutionizing healthcare treatment and improving patient outcomes.',
      author: 'Dr. Sarah Ahmed',
      authorAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
      category: 'Healthcare Technology',
      publishDate: '2024-01-15',
      readTime: '5 min read',
      views: 1247,
      likes: 89,
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=300&fit=crop'
    },
    {
      id: 2,
      title: 'Understanding Drug Interactions',
      excerpt: 'Essential guide for healthcare professionals and patients on managing medication interactions safely.',
      author: 'Dr. Ahmed Hassan',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      category: 'Pharmacology',
      publishDate: '2024-01-12',
      readTime: '7 min read',
      views: 892,
      likes: 67,
      image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=600&h=300&fit=crop'
    },
    {
      id: 3,
      title: 'Mental Health in the Digital Age',
      excerpt: 'Exploring the impact of technology on mental health and how digital tools can support wellness.',
      author: 'Dr. Fatima Al-Zahra',
      authorAvatar: 'https://images.unsplash.com/photo-1594824475542-9b0c4c0c0c0c?w=150&h=150&fit=crop&crop=face',
      category: 'Mental Health',
      publishDate: '2024-01-10',
      readTime: '6 min read',
      views: 1567,
      likes: 123,
      image: 'https://images.unsplash.com/photo-1576091160399-112c8f0dbf9e?w=600&h=300&fit=crop'
    }
  ];

  const filteredPosts = blogPosts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = ['All', 'Healthcare Technology', 'Pharmacology', 'Mental Health', 'Clinical Practice'];

  return (
    <Container maxW="7xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <Box textAlign="center">
          <Heading size="2xl" color="blue.600" mb={6}>
            Healthcare Blog
          </Heading>
          <Text fontSize="xl" color={textColor} maxW="3xl" mx="auto">
            Stay updated with the latest insights, research, and best practices in healthcare 
            from our team of medical professionals and industry experts.
          </Text>
        </Box>

        {/* Search and Categories */}
        <Box>
          <InputGroup size="lg" maxW="2xl" mx="auto" mb={6}>
            <InputLeftElement>
              <FaSearch color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Search articles by title, content, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              bg={bgColor}
              border="1px"
              borderColor={borderColor}
            />
          </InputGroup>
          
          <HStack spacing={4} justify="center" flexWrap="wrap">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === 'All' ? 'solid' : 'outline'}
                colorScheme="blue"
                size="sm"
              >
                {category}
              </Button>
            ))}
          </HStack>
        </Box>

        {/* Blog Posts */}
        <Box>
          <Heading size="lg" color="gray.800" mb={6}>
            Latest Articles
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
            {filteredPosts.map((post) => (
              <Card key={post.id} bg={bgColor} border="1px" borderColor={borderColor} shadow="lg">
                <Image
                  src={post.image}
                  alt={post.title}
                  height="200px"
                  objectFit="cover"
                />
                <CardHeader>
                  <VStack spacing={3} align="stretch">
                    <Badge colorScheme="blue" w="fit-content">
                      {post.category}
                    </Badge>
                    <Heading size="md" color="gray.800" noOfLines={2}>
                      {post.title}
                    </Heading>
                    <Text color={textColor} noOfLines={3}>
                      {post.excerpt}
                    </Text>
                  </VStack>
                </CardHeader>
                <CardBody pt={0}>
                  <VStack spacing={4} align="stretch">
                    <HStack spacing={4}>
                      <Avatar
                        size="sm"
                        src={post.authorAvatar}
                        name={post.author}
                      />
                      <Box>
                        <Text fontWeight="semibold" fontSize="sm">
                          {post.author}
                        </Text>
                        <Text fontSize="xs" color={textColor}>
                          {new Date(post.publishDate).toLocaleDateString()}
                        </Text>
                      </Box>
                    </HStack>
                    
                    <HStack spacing={4} color={textColor} fontSize="sm">
                      <HStack spacing={1}>
                        <FaCalendar />
                        <Text>{post.readTime}</Text>
                      </HStack>
                      <HStack spacing={1}>
                        <FaEye />
                        <Text>{post.views}</Text>
                      </HStack>
                      <HStack spacing={1}>
                        <FaHeart />
                        <Text>{post.likes}</Text>
                      </HStack>
                    </HStack>
                    
                    <Button
                      colorScheme="blue"
                      variant="outline"
                      size="sm"
                      w="full"
                    >
                      Read More
                    </Button>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </Box>

        {/* Newsletter Signup */}
        <Box textAlign="center" py={12}>
          <Heading size="xl" color="gray.800" mb={6}>
            Stay Updated
          </Heading>
          <Text fontSize="lg" color={textColor} mb={8} maxW="2xl" mx="auto">
            Subscribe to our newsletter to receive the latest healthcare insights, 
            research updates, and professional development tips.
          </Text>
          <HStack spacing={4} justify="center" maxW="md" mx="auto">
            <Input
              placeholder="Enter your email address"
              bg={bgColor}
              border="1px"
              borderColor={borderColor}
            />
            <Button colorScheme="blue" px={8}>
              Subscribe
            </Button>
          </HStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default Blog;
