import React from 'react';
import {
  Box,
  VStack,
  Spinner,
  Text,
  useColorModeValue
} from '@chakra-ui/react';

const LoadingSpinner = ({ message = 'Loading...', size = 'xl' }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minH="200px"
      bg={bgColor}
      borderRadius="md"
      p={8}
    >
      <VStack spacing={4}>
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="pharmgenius.500"
          size={size}
        />
        <Text color="gray.600" fontSize="md" textAlign="center">
          {message}
        </Text>
      </VStack>
    </Box>
  );
};

export default LoadingSpinner;