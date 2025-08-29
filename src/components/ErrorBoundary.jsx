import React from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Container
} from '@chakra-ui/react';
import { FaExclamationTriangle } from 'react-icons/fa';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container maxW="lg" py={10}>
          <VStack spacing={6} align="center">
            <Box textAlign="center">
              <FaExclamationTriangle size="48" color="var(--chakra-colors-red-500)" />
            </Box>
            
            <VStack spacing={4} textAlign="center">
              <Heading size="lg" color="red.600">
                Something went wrong
              </Heading>
              <Text color="gray.600">
                We're sorry, but something unexpected happened. Please try refreshing the page.
              </Text>
            </VStack>

            <Alert status="error" borderRadius="md">
              <AlertIcon />
              <Box>
                <AlertTitle>Error Details:</AlertTitle>
                <AlertDescription>
                  {this.state.error && this.state.error.toString()}
                </AlertDescription>
              </Box>
            </Alert>

            <Button
              colorScheme="pharmgenius"
              onClick={() => window.location.reload()}
              size="lg"
            >
              Refresh Page
            </Button>

            {process.env.NODE_ENV === 'development' && (
              <Box
                as="pre"
                bg="gray.100"
                p={4}
                borderRadius="md"
                fontSize="sm"
                overflow="auto"
                maxW="full"
                textAlign="left"
              >
                {this.state.errorInfo.componentStack}
              </Box>
            )}
          </VStack>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;