import { useState, useEffect } from 'react';
import { Box, Button } from '@chakra-ui/react';
import { GoogleMap, LoadScript, Marker, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: -3.745,
  lng: -38.523
};

const GoogleMapsRoute = () => {
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [response, setResponse] = useState(null);
  const navigate = useNavigate();

  const directionsCallback = (response) => {
    if (response === null) {
      console.error('Directions response is null');
      return;
    }
    if (response.status === 'OK') {
      setResponse(response);
    } else {
      console.error('Directions response error: ', response);
    }
  };

  const handleMapClick = (event) => {
    try {
      if (!origin) {
        setOrigin({ lat: event.latLng.lat(), lng: event.latLng.lng() });
        console.log('Origin set to:', { lat: event.latLng.lat(), lng: event.latLng.lng() });
      } else if (!destination) {
        setDestination({ lat: event.latLng.lat(), lng: event.latLng.lng() });
        console.log('Destination set to:', { lat: event.latLng.lat(), lng: event.latLng.lng() });
      }
    } catch (error) {
      console.error('Error handling map click: ', error);
    }
  };

  const handleReset = () => {
    try {
      setOrigin(null);
      setDestination(null);
      setResponse(null);
      console.log('Map reset');
    } catch (error) {
      console.error('Error resetting map: ', error);
    }
  };

  const handleConfirm = () => {
    try {
      navigate('/booking', { state: { origin, destination } });
      console.log('Navigating to booking with:', { origin, destination });
    } catch (error) {
      console.error('Error navigating to booking: ', error);
    }
  };

  return (
    <Box>
      <LoadScript
        googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
        onLoad={() => console.log('Google Maps API script loaded successfully')}
        onError={(error) => console.error('Error loading Google Maps API script: ', error)}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={10}
          onClick={handleMapClick}
        >
          {origin && <Marker position={origin} />}
          {destination && <Marker position={destination} />}
          {origin && destination && !response && (
            <DirectionsService
              options={{ destination, origin, travelMode: 'DRIVING' }}
              callback={(response) => {
                try {
                  directionsCallback(response);
                } catch (error) {
                  console.error('Error in DirectionsService callback: ', error);
                }
              }}
            />
          )}
          {response && (
            <DirectionsRenderer
              options={{
                directions: response
              }}
            />
          )}
        </GoogleMap>
      </LoadScript>
      <Button onClick={handleReset} mt={4}>Reset</Button>
      <Button onClick={handleConfirm} mt={4} ml={4} colorScheme="blue">Confirm</Button>
    </Box>
  );
};

export default GoogleMapsRoute;