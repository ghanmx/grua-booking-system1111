import { useState, useEffect } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Select, Textarea, VStack, useToast } from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import { LoadScript, GoogleMap, Marker, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';

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
    origin: null,
    destination: null,
  });

  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [directions, setDirections] = useState(null);

  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state) {
      const { origin, destination } = location.state;
      setFormData((prevData) => ({ ...prevData, origin, destination }));
      console.log('Origin and Destination set from location state:', { origin, destination });
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    console.log('Form data updated:', { [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { serviceType, userName, phoneNumber, vehicleMake, vehicleModel, vehicleSize, pickupDate, pickupTime, origin, destination } = formData;

    if (!serviceType || !userName || !phoneNumber || !vehicleMake || !vehicleModel || !vehicleSize || !pickupDate || !pickupTime || !origin || !destination) {
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

    // Redirect to confirmation page
    navigate('/confirmation', { state: { formData } });
  };

  const handleDirectionsCallback = (response) => {
    if (response !== null) {
      if (response.status === 'OK') {
        setDirections(response);
        console.log('Directions response:', response);
      } else {
        console.error('Directions request failed due to:', response.status);
      }
    } else {
      console.error('Directions response is null');
    }
  };

  const handleMapClick = (event) => {
    if (!origin) {
      setOrigin({ lat: event.latLng.lat(), lng: event.latLng.lng() });
      console.log('Origin set to:', { lat: event.latLng.lat(), lng: event.latLng.lng() });
    } else if (!destination) {
      setDestination({ lat: event.latLng.lat(), lng: event.latLng.lng() });
      console.log('Destination set to:', { lat: event.latLng.lat(), lng: event.latLng.lng() });
    }
  };

  const handleReset = () => {
    setOrigin(null);
    setDestination(null);
    setDirections(null);
    console.log('Map reset');
  };

  const handleConfirm = () => {
    setFormData((prevData) => ({ ...prevData, origin, destination }));
    console.log('Origin and Destination confirmed:', { origin, destination });
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
          <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
            <GoogleMap
              mapContainerStyle={{ height: "400px", width: "100%" }}
              zoom={7}
              center={origin || { lat: -3.745, lng: -38.523 }}
              onClick={handleMapClick}
            >
              {origin && <Marker position={origin} />}
              {destination && <Marker position={destination} />}
              {origin && destination && !directions && (
                <DirectionsService
                  options={{
                    destination: destination,
                    origin: origin,
                    travelMode: 'DRIVING'
                  }}
                  callback={handleDirectionsCallback}
                />
              )}
              {directions && (
                <DirectionsRenderer
                  options={{
                    directions: directions
                  }}
                />
              )}
            </GoogleMap>
          </LoadScript>
          <Button onClick={handleReset} mt={4}>Reset</Button>
          <Button onClick={handleConfirm} mt={4} ml={4} colorScheme="blue">Confirm</Button>
          <Button colorScheme="blue" type="submit">Book Now</Button>
        </VStack>
      </form>
    </Box>
  );
};

export default BookingForm;