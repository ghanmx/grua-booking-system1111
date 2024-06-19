import { useState, useEffect, useRef } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Select, Textarea, VStack, useToast } from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import GoogleMapsRoute from '../components/GoogleMapsRoute';
import UserLocationMarker from '../components/UserLocationMarker';

const BookingForm = () => {
  const [formData, setFormData] = useState({
    serviceType: '',
    userName: '',
    phoneNumber: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleSize: '',
    additionalInfo: '',
    pickupDate: '',
    pickupTime: '',
    origin: { lat: 26.509672, lng: -100.0095504 },
    pickupLocation: null,
    destinationLocation: null,
    distance: 0,
  });

  const [origin, setOrigin] = useState({ lat: 26.509672, lng: -100.0095504 });
  const [pickupLocation, setPickupLocation] = useState(null);
  const [destinationLocation, setDestinationLocation] = useState(null);

  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const mapRef = useRef(null);

  useEffect(() => {
    if (location.state) {
      const { origin, pickupLocation, destinationLocation } = location.state;
      setFormData((prevData) => ({ ...prevData, origin, pickupLocation, destinationLocation }));
      console.log('Origin, Pickup, and Destination set from location state:', { origin, pickupLocation, destinationLocation });
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    console.log('Form data updated:', { [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { serviceType, userName, phoneNumber, vehicleMake, vehicleModel, vehicleSize, pickupDate, pickupTime, origin, pickupLocation, destinationLocation, distance } = formData;

    if (!serviceType || !userName || !phoneNumber || !vehicleMake || !vehicleModel || !vehicleSize || !pickupDate || !pickupTime || !origin || !pickupLocation || !destinationLocation) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    console.log('Form submitted with data:', formData);

    // Calculate total cost
    const baseCost = 558;
    const costPerKm = 19;
    const totalCost = baseCost + (distance * costPerKm);

    // Send booking request to the backend
    fetch('https://your-backend-api.com/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...formData, totalCost }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Booking successful:', data);
        // Redirect to payment page with calculated cost and additional details
        navigate('/payment', { state: { formData, totalCost, serviceDetails: { serviceType, distance, pickupLocation, destinationLocation } } });
      })
      .catch((error) => {
        console.error('There was a problem with the booking request:', error);
        toast({
          title: 'Error',
          description: 'There was a problem processing your booking. Please try again later.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      });
  };

  const handleMapClick = (event) => {
    if (!pickupLocation) {
      setPickupLocation({ lat: event.latLng.lat(), lng: event.latLng.lng() });
      console.log('Pickup location set to:', { lat: event.latLng.lat(), lng: event.latLng.lng() });
    } else if (!destinationLocation) {
      setDestinationLocation({ lat: event.latLng.lat(), lng: event.latLng.lng() });
      console.log('Destination location set to:', { lat: event.latLng.lat(), lng: event.latLng.lng() });
    }
  };

  const handleReset = () => {
    setPickupLocation(null);
    setDestinationLocation(null);
    console.log('Map reset');
  };

  const handleConfirm = () => {
    if (pickupLocation && mapRef.current) {
      centerPickupMarker();
    }
    setFormData((prevData) => ({ ...prevData, origin, pickupLocation, destinationLocation }));
    console.log('Origin, Pickup, and Destination confirmed:', { origin, pickupLocation, destinationLocation });
  };

  const centerPickupMarker = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setPickupLocation(userLocation);
          if (mapRef.current) {
            mapRef.current.panTo(userLocation);
          }
          console.log('Pickup marker centered to user location:', userLocation);
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  return (
    <Box p={4}>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
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
          <FormControl id="phoneNumber" isRequired>
            <FormLabel>Phone Number</FormLabel>
            <Input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
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
          <GoogleMapsRoute setDistance={(distance) => setFormData({ ...formData, distance })} />
          <Button onClick={handleReset} mt={4}>Reset</Button>
          <Button onClick={handleConfirm} mt={4} ml={4} colorScheme="blue">Confirm</Button>
          <Button colorScheme="blue" type="submit">Book Now</Button>
        </VStack>
      </form>
    </Box>
  );
};

export default BookingForm;