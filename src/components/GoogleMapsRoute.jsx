import React, { useState, useEffect, useCallback } from 'react';
import { Box, Button, Text, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from '@chakra-ui/react';
import { GoogleMap, LoadScript, Marker, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';

const GoogleMapsRoute = ({ setDistance, setTotalCost }) => {
  const [pickup, setPickup] = useState(null);
  const [destination, setDestination] = useState(null);
  const [directions, setDirections] = useState(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  const companyLocation = { lat: 26.509672, lng: -100.0095504 }; // Example company location

  const calculateRoute = useCallback(() => {
    if (pickup && destination) {
      const directionsService = new window.google.maps.DirectionsService();
      const distanceMatrixService = new window.google.maps.DistanceMatrixService();

      // Calculate route from company to pickup
      distanceMatrixService.getDistanceMatrix(
        {
          origins: [companyLocation],
          destinations: [pickup],
          travelMode: 'DRIVING',
        },
        (response, status) => {
          if (status === 'OK') {
            const distanceToPickup = response.rows[0].elements[0].distance.value / 1000; // Convert to km

            // Calculate route from pickup to destination
            directionsService.route(
              {
                origin: pickup,
                destination: destination,
                travelMode: window.google.maps.TravelMode.DRIVING,
              },
              (result, status) => {
                if (status === window.google.maps.DirectionsStatus.OK) {
                  setDirections(result);
                  const pickupToDestinationDistance = result.routes[0].legs[0].distance.value / 1000; // Convert to km

                  // Calculate route from destination back to company
                  distanceMatrixService.getDistanceMatrix(
                    {
                      origins: [destination],
                      destinations: [companyLocation],
                      travelMode: 'DRIVING',
                    },
                    (response, status) => {
                      if (status === 'OK') {
                        const distanceFromDestination = response.rows[0].elements[0].distance.value / 1000; // Convert to km

                        const totalDistance = distanceToPickup + pickupToDestinationDistance + distanceFromDestination;
                        setDistance(totalDistance);

                        // You'll need to implement getTowTruckPricing and calculate the total price here
                        // const { perKm, basePrice } = getTowTruckPricing(selectedTowTruck);
                        // const price = basePrice + (totalDistance * perKm);
                        // setTotalPrice(price);
                        // setTotalCost(price);

                        setIsConfirmationOpen(true);
                      }
                    }
                  );
                }
              }
            );
          }
        }
      );
    }
  }, [pickup, destination, setDistance, setTotalCost]);

  useEffect(() => {
    if (pickup && destination) {
      calculateRoute();
    }
  }, [pickup, destination, calculateRoute]);

  const handleMapClick = (event) => {
    const clickedLocation = event.latLng.toJSON();
    if (!pickup) {
      setPickup(clickedLocation);
    } else if (!destination) {
      setDestination(clickedLocation);
    }
  };

  return (
    <Box height="400px" width="100%" my={4}>
      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={{ height: "100%", width: "100%" }}
          center={companyLocation}
          zoom={10}
          onClick={handleMapClick}
        >
          {pickup && <Marker position={pickup} />}
          {destination && <Marker position={destination} />}
          {directions && (
            <DirectionsRenderer
              directions={directions}
              options={{
                polylineOptions: {
                  strokeColor: "blue",
                  strokeWeight: 6,
                },
              }}
            />
          )}
        </GoogleMap>
      </LoadScript>

      <Modal isOpen={isConfirmationOpen} onClose={() => setIsConfirmationOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Route</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Total estimated price: ${totalPrice.toFixed(2)}</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={() => setIsConfirmationOpen(false)}>
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default GoogleMapsRoute;
