import { Box, Button, FormControl, FormLabel, Heading, Input, Text } from '@chakra-ui/react';
import { GoogleMap, LoadScript, Marker, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

const GoogleMapsRoute = ({ setDistance }) => {
  const [pickup, setPickup] = useState(null);
  const [destination, setDestination] = useState(null);
  const [error, setError] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [directions, setDirections] = useState(null);
  const [map, setMap] = useState(null);
  const [tollCost, setTollCost] = useState(0);
  const origin = { lng: -100.0095504, lat: 26.509672 }; // Updated starting point
  const pricePerKm = 19;

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setPickup(userLocation);
          if (map) {
            map.panTo(userLocation);
          }
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, [map]);

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
          fetchTollData(pickup, destination);
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
    return distance * pricePerKm + 558 + tollCost; // Tarifa base de $558 más $19 por kilómetro más el costo de las casetas
  };

  const fetchTollData = async (origin, destination) => {
    try {
      const response = await fetch(`https://api.tollguru.com/v1/calc/route?source=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}`);
      const data = await response.json();
      const tolls = data.tolls || 0;
      setTollCost(tolls);
    } catch (error) {
      console.error('Error fetching toll data:', error);
    }
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
          maxZoom={20} // Allow more zoom
          mapContainerStyle={{ height: '400px', width: '100%', marginTop: '20px' }}
          onLoad={(map) => setMap(map)}
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
          {pickup && <Marker position={pickup} draggable={true} onDragEnd={(e) => setPickup(e.latLng.toJSON())} />}
          {destination && <Marker position={destination} draggable={true} onDragEnd={(e) => setDestination(e.latLng.toJSON())} />}
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