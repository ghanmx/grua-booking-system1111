import { Box, Button, FormControl, FormLabel, Heading, Input, Text } from '@chakra-ui/react';
import { GoogleMap, LoadScript, Marker, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

const GoogleMapsRoute = ({ setDistance }) => {
  const [pickup, setPickup] = useState(null);
  const [destination, setDestination] = useState(null);
  const [error, setError] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [directions, setDirections] = useState(null);
  const origin = { lng: -100.17996883208497, lat: 26.528281587203573 };
  const pricePerKm = 19;

  const calculateRoute = () => {
    setError(null);
    if (!pickup || !destination) {
      setError('Please fill in all required fields.');
      return;
    }

    const service = new window.google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins: [pickup],
        destinations: [destination],
        travelMode: 'DRIVING',
      },
      (response, status) => {
        if (status === 'OK') {
          const distanceToDestination = response.rows[0].elements[0].distance.value / 1000; // Distancia en kilómetros al destino
          setDistance(distanceToDestination);
          const price = calculatePrice(distanceToDestination);
          setTotalPrice(price);
        } else if (status === 'REQUEST_DENIED') {
          setError('Request denied. Please check your API key and permissions.');
          console.error('Error calculating the route:', status, response);
        } else {
          setError('Error calculating the route: ' + status);
          console.error('Error calculating the route:', status, response);
        }
      }
    );
  };

  const calculatePrice = (distance) => {
    return distance * pricePerKm + 558; // Tarifa base de $558 más $19 por kilómetro
  };

  return (
    <Box>
      <Heading as="h1" mb={4}>
        Selecciona recogida y destino
      </Heading>
      {error && <Text color="red.500">Error: {error}</Text>}
      <FormControl mb={4}>
        <FormLabel htmlFor="pickup">Punto de recogida:</FormLabel>
        <Input type="text" id="pickup" value={pickup ? `${pickup.lat}, ${pickup.lng}` : ''} readOnly />
      </FormControl>
      <FormControl mb={4}>
        <FormLabel htmlFor="destination">Destino:</FormLabel>
        <Input type="text" id="destination" value={destination ? `${destination.lat}, ${destination.lng}` : ''} readOnly />
      </FormControl>
      <Button onClick={calculateRoute} colorScheme="blue" disabled={!pickup || !destination}>
        Calcular Ruta
      </Button>
      <Text mt={4} fontSize="xl">
        Precio total: ${totalPrice.toFixed(2)}
      </Text>
      <LoadScript googleMapsApiKey="AIzaSyDortki8ly1t1-bjY5ZuLNRQBpdfSc1Q0I">
        <GoogleMap
          center={{ lat: origin.lat, lng: origin.lng }}
          zoom={7}
          mapContainerStyle={{ height: '400px', width: '100%', marginTop: '20px' }}
          onClick={(event) => {
            try {
              if (!pickup) {
                setPickup(event.latLng.toJSON());
              } else if (!destination) {
                setDestination(event.latLng.toJSON());
              }
            } catch (err) {
              setError('Error setting location: ' + err.message);
              console.error('Error setting location:', err);
            }
          }}
        >
          {pickup && <Marker position={pickup} />}
          {destination && <Marker position={destination} />}
          {pickup && destination && (
            <DirectionsService
              options={{
                origin: pickup,
                destination: destination,
                travelMode: 'DRIVING',
              }}
              callback={(response, status) => {
                if (status === 'OK') {
                  setDirections(response);
                } else {
                  setError('Error fetching directions: ' + status);
                  console.error('Error fetching directions:', status, response);
                }
              }}
            />
          )}
          {directions && (
            <DirectionsRenderer
              options={{
                directions: directions,
              }}
            />
          )}
        </GoogleMap>
      </LoadScript>
    </Box>
  );
};

GoogleMapsRoute.propTypes = {
  setDistance: PropTypes.func.isRequired,
};

export default GoogleMapsRoute;