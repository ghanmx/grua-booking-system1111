import { Box, Text, VStack, Button } from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { formData, totalCost } = location.state || {};

  const handlePayment = () => {
    // Implement payment logic here
    console.log('Payment processed for:', totalCost);
    navigate('/confirmation', { state: { formData } });
  };

  return (
    <Box p={4}>
      <VStack spacing={4} align="stretch">
        <Text fontSize="2xl">Payment</Text>
        {formData ? (
          <>
            <Text>Service Type: {formData.serviceType}</Text>
            <Text>User Name: {formData.userName}</Text>
            <Text>Phone Number: {formData.phoneNumber}</Text>
            <Text>Vehicle Make: {formData.vehicleMake}</Text>
            <Text>Vehicle Model: {formData.vehicleModel}</Text>
            <Text>Vehicle Size: {formData.vehicleSize}</Text>
            <Text>Pickup Date: {formData.pickupDate}</Text>
            <Text>Pickup Time: {formData.pickupTime}</Text>
            <Text>Total Cost: ${totalCost}</Text>
            <Button colorScheme="blue" onClick={handlePayment}>Pay Now</Button>
          </>
        ) : (
          <Text>No payment details available.</Text>
        )}
      </VStack>
    </Box>
  );
};

export default Payment;