import React, { useState } from 'react';
import { 
  Box, 
  Heading, 
  Text, 
  VStack, 
  HStack, 
  Button, 
  Card, 
  CardBody, 
  CardHeader, 
  Badge, 
  Avatar, 
  SimpleGrid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select
} from '@chakra-ui/react';
import { FaCalendar, FaClock, FaUserMd, FaVideo, FaPhone, FaComments } from 'react-icons/fa';

const Consultations = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedConsultation, setSelectedConsultation] = useState(null);

  const consultations = [
    {
      id: 1,
      type: 'Video Consultation',
      specialist: 'Dr. Sarah Johnson',
      specialty: 'Clinical Pharmacy',
      date: '2024-01-15',
      time: '10:00 AM',
      duration: '30 min',
      status: 'Scheduled',
      patient: 'John Doe',
      notes: 'Follow-up consultation for diabetes medication management'
    },
    {
      id: 2,
      type: 'Phone Consultation',
      specialist: 'Dr. Michael Chen',
      specialty: 'Drug Interactions',
      date: '2024-01-16',
      time: '2:00 PM',
      duration: '20 min',
      status: 'Completed',
      patient: 'Jane Smith',
      notes: 'Initial consultation for new prescription review'
    },
    {
      id: 3,
      type: 'Video Consultation',
      specialist: 'Dr. Emily Rodriguez',
      specialty: 'Pediatric Pharmacy',
      date: '2024-01-17',
      time: '11:30 AM',
      duration: '45 min',
      status: 'Pending',
      patient: 'Mike Wilson',
      notes: 'Consultation for child medication dosage adjustment'
    }
  ];

  const handleBookConsultation = () => {
    setSelectedConsultation(null);
    onOpen();
  };

  const handleViewDetails = (consultation) => {
    setSelectedConsultation(consultation);
    onOpen();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled': return 'blue';
      case 'Completed': return 'green';
      case 'Pending': return 'yellow';
      case 'Cancelled': return 'red';
      default: return 'gray';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Video Consultation': return FaVideo;
      case 'Phone Consultation': return FaPhone;
      case 'Chat Consultation': return FaComments;
      default: return FaComments;
    }
  };

  return (
    <Box p={6} maxW="1200px" mx="auto">
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading size="2xl" mb={4} color="blue.600">
            Professional Consultations
          </Heading>
          <Text fontSize="lg" color="gray.600">
            Get expert pharmaceutical advice from our certified specialists
          </Text>
        </Box>

        <HStack justify="space-between" align="center">
          <Text fontSize="lg" fontWeight="semibold">
            Your Consultations ({consultations.length})
          </Text>
          <Button colorScheme="blue" onClick={handleBookConsultation}>
            Book New Consultation
          </Button>
        </HStack>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {consultations.map((consultation) => (
            <Card key={consultation.id} shadow="md" _hover={{ shadow: "lg" }} transition="all 0.3s">
              <CardHeader>
                <VStack align="start" spacing={3}>
                  <HStack justify="space-between" w="100%">
                    <HStack>
                      <Icon as={getTypeIcon(consultation.type)} color="blue.500" />
                      <Text fontWeight="semibold" fontSize="sm">
                        {consultation.type}
                      </Text>
                    </HStack>
                    <Badge colorScheme={getStatusColor(consultation.status)}>
                      {consultation.status}
                    </Badge>
                  </HStack>
                  
                  <HStack>
                    <Avatar size="sm" name={consultation.specialist} />
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="semibold">{consultation.specialist}</Text>
                      <Text fontSize="sm" color="gray.600">{consultation.specialty}</Text>
                    </VStack>
                  </HStack>
                </VStack>
              </CardHeader>
              
              <CardBody>
                <VStack align="stretch" spacing={4}>
                  <HStack justify="space-between" fontSize="sm" color="gray.600">
                    <HStack>
                      <Icon as={FaCalendar} />
                      <Text>{consultation.date}</Text>
                    </HStack>
                    <HStack>
                      <Icon as={FaClock} />
                      <Text>{consultation.time}</Text>
                    </HStack>
                  </HStack>
                  
                  <Text fontSize="sm" color="gray.600">
                    <strong>Patient:</strong> {consultation.patient}
                  </Text>
                  
                  <Text fontSize="sm" color="gray.600">
                    <strong>Duration:</strong> {consultation.duration}
                  </Text>
                  
                  <Text fontSize="sm" color="gray.600" noOfLines={2}>
                    <strong>Notes:</strong> {consultation.notes}
                  </Text>
                  
                  <Button 
                    size="sm" 
                    variant="outline" 
                    colorScheme="blue"
                    onClick={() => handleViewDetails(consultation)}
                  >
                    View Details
                  </Button>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>

        {/* Consultation Details Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {selectedConsultation ? 'Consultation Details' : 'Book New Consultation'}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {selectedConsultation ? (
                <VStack spacing={4} align="stretch">
                  <HStack justify="space-between">
                    <Text fontWeight="semibold">Type:</Text>
                    <Text>{selectedConsultation.type}</Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontWeight="semibold">Specialist:</Text>
                    <Text>{selectedConsultation.specialist}</Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontWeight="semibold">Date & Time:</Text>
                    <Text>{selectedConsultation.date} at {selectedConsultation.time}</Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontWeight="semibold">Status:</Text>
                    <Badge colorScheme={getStatusColor(selectedConsultation.status)}>
                      {selectedConsultation.status}
                    </Badge>
                  </HStack>
                  <Text fontWeight="semibold">Notes:</Text>
                  <Text>{selectedConsultation.notes}</Text>
                </VStack>
              ) : (
                <VStack spacing={4}>
                  <FormControl>
                    <FormLabel>Consultation Type</FormLabel>
                    <Select placeholder="Select consultation type">
                      <option value="video">Video Consultation</option>
                      <option value="phone">Phone Consultation</option>
                      <option value="chat">Chat Consultation</option>
                    </Select>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Specialist</FormLabel>
                    <Select placeholder="Select specialist">
                      <option value="dr-johnson">Dr. Sarah Johnson - Clinical Pharmacy</option>
                      <option value="dr-chen">Dr. Michael Chen - Drug Interactions</option>
                      <option value="dr-rodriguez">Dr. Emily Rodriguez - Pediatric Pharmacy</option>
                    </Select>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Preferred Date</FormLabel>
                    <Input type="date" />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Preferred Time</FormLabel>
                    <Input type="time" />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Notes</FormLabel>
                    <Textarea placeholder="Describe your consultation needs..." />
                  </FormControl>
                </VStack>
              )}
            </ModalBody>
            
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Close
              </Button>
              {!selectedConsultation && (
                <Button colorScheme="blue">
                  Book Consultation
                </Button>
              )}
            </ModalFooter>
          </ModalContent>
        </Modal>
      </VStack>
    </Box>
  );
};

export default Consultations;
