import { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Select, Textarea, VStack, useToast, Heading, Checkbox, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../integrations/supabase';
import GoogleMapsRoute from '../components/GoogleMapsRoute';

const BookingForm = () => {
  const [formData, setFormData] = useState({
    serviceType: '',
    userName: '',
    age: '',
    phoneNumber: '',
    carBrand: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleSize: '',
    additionalInfo: '',
    pickupDate: '',
    pickupTime: '',
    streetLevel: '',
    neutralPossible: '',
    adaptations: '',
    passengers: '',
  });

  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [distance, setDistance] = useState(0);
  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBookingProcess = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      // Calculate the total cost
      const baseCost = 558;
      const costPerKm = 19;
      const totalCost = baseCost + (costPerKm * distance);

      // Prepare the data to be sent to Supabase
      const bookingData = {
        ...formData,
        distance,
        totalCost,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      // Send the booking data to Supabase
      const { data, error } = await supabase.from('bookings').insert([bookingData]);

      if (error) throw error;

      // Show success message
      toast({
        title: 'Booking Successful',
        description: 'Your tow service has been booked successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Navigate to the confirmation page
      navigate('/confirmation', { state: { bookingData } });
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: 'Booking Failed',
        description: error.message || 'An unexpected error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const validateForm = () => {
    const requiredFields = ['serviceType', 'userName', 'age', 'phoneNumber', 'carBrand', 'vehicleMake', 'vehicleModel', 'vehicleSize', 'pickupDate', 'pickupTime'];
    for (let field of requiredFields) {
      if (!formData[field]) {
        toast({
          title: 'Error',
          description: `Please fill in all required fields. Missing: ${field}`,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return false;
      }
    }
    return true;
  };

  return (
    <Box p={4}>
      <VStack spacing={4} align="stretch">
        <Heading as="h1" mb={4}>Booking Form</Heading>
        <form onSubmit={handleBookingProcess}>
          <FormControl id="serviceType" isRequired>
            <FormLabel>Service Type</FormLabel>
            <Select name="serviceType" value={formData.serviceType} onChange={handleChange}>
              <option value="">Select Service Type</option>
              <option value="Tow">Tow</option>
              <option value="Platform">Platform</option>
              <option value="Roadside Assistance">Roadside Assistance</option>
            </Select>
          </FormControl>
          <FormControl id="userName" isRequired>
            <FormLabel>User Name</FormLabel>
            <Input type="text" name="userName" value={formData.userName} onChange={handleChange} />
          </FormControl>
          <FormControl id="age" isRequired>
            <FormLabel>Age</FormLabel>
            <Input type="number" name="age" value={formData.age} onChange={handleChange} />
          </FormControl>
          <FormControl id="phoneNumber" isRequired>
            <FormLabel>Phone Number</FormLabel>
            <Input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
          </FormControl>
          <FormControl id="carBrand" isRequired>
            <FormLabel>Car Brand</FormLabel>
            <Input type="text" name="carBrand" value={formData.carBrand} onChange={handleChange} />
          </FormControl>
          <FormControl id="vehicleMake" isRequired>
            <FormLabel>Vehicle Make</FormLabel>
            <Input type="text" name="vehicleMake" value={formData.vehicleMake} onChange={handleChange} />
          </FormControl>
          <FormControl id="vehicleModel" isRequired>
            <FormLabel>Vehicle Model</FormLabel>
            <Input type="text" name="vehicleModel" value={formData.vehicleModel} onChange={handleChange} />
          </FormControl>
          <FormControl id="vehicleSize" isRequired>
            <FormLabel>Vehicle Size</FormLabel>
            <Select name="vehicleSize" value={formData.vehicleSize} onChange={handleChange}>
              <option value="">Select Vehicle Size</option>
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
            </Select>
          </FormControl>
          <FormControl id="additionalInfo">
            <FormLabel>Additional Information</FormLabel>
            <Textarea name="additionalInfo" value={formData.additionalInfo} onChange={handleChange} />
          </FormControl>
          <FormControl id="pickupDate" isRequired>
            <FormLabel>Pickup Date</FormLabel>
            <Input type="date" name="pickupDate" value={formData.pickupDate} onChange={handleChange} />
          </FormControl>
          <FormControl id="pickupTime" isRequired>
            <FormLabel>Pickup Time</FormLabel>
            <Input type="time" name="pickupTime" value={formData.pickupTime} onChange={handleChange} />
          </FormControl>
          <FormControl id="terms" isRequired>
            <Checkbox onChange={() => setIsTermsOpen(true)}>I accept terms and conditions</Checkbox>
          </FormControl>
          <Button colorScheme="blue" type="submit" mt={4}>Book Now</Button>
        </form>
      </VStack>
      <GoogleMapsRoute setDistance={setDistance} />
      <Modal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Terms and Conditions</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p>The services may have a higher cost which must be paid when arriving at the destination, otherwise the vehicle will not leave the platform and will be taken to the corralon.</p>
            <p>Remember that only two passengers can go in the tow truck, if you require a taxi we can provide it.</p>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default BookingForm;
