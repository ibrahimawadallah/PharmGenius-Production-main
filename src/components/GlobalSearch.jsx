import { useState } from 'react';
import {
  Box,
  Input,
  Button,
  VStack,
  Heading,
  Tabs,
  TabList,
  Tab,
  useToast,
  InputGroup,
  InputLeftElement
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// Controlled GlobalSearch component: relies on parent state and callbacks
const GlobalSearch = ({
  searchQuery,
  onSearchQueryChange,
  activeTab,
  onActiveTabChange,
}) => {
  const toast = useToast();

  const handleInputChange = (e) => {
    onSearchQueryChange?.(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (!searchQuery?.trim()) {
        toast({
          title: 'Search query cannot be empty.',
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      // Trigger a minor change to ensure react-query refetches if user presses Enter with same text
      onSearchQueryChange?.(searchQuery.trim());
    }
  };

  return (
    <Box p={6} borderWidth="1px" borderRadius="lg" boxShadow="md" bg="white" w="100%">
      <VStack spacing={4} align="stretch">
        <Heading as="h2" size="lg" textAlign="center">
          Pharmaceutical Search
        </Heading>

        <Tabs isFitted variant="enclosed" index={activeTab} onChange={(index) => onActiveTabChange?.(index)}>
          <TabList>
            <Tab>Drug Lookup</Tab>
            <Tab>ICD-10 Codes</Tab>
            <Tab>Daman Formulary</Tab>
          </TabList>
        </Tabs>

        <InputGroup size="lg">
          <InputLeftElement pointerEvents="none" children={<SearchIcon color="gray.300" />} />
          <Input
            placeholder={`Search for ${['drugs', 'ICD-10 codes', 'formulary items'][activeTab]}...`}
            value={searchQuery}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
          />
        </InputGroup>

        <Button colorScheme="teal" size="lg" onClick={() => onSearchQueryChange?.(searchQuery?.trim() || '')} rightIcon={<SearchIcon />}>
          Search
        </Button>
      </VStack>
    </Box>
  );
};

export default GlobalSearch;