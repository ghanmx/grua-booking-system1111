import { useEffect } from 'react';

const UserLocationMarker = ({ map, setPickupLocation }) => {
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setPickupLocation(userLocation);
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
  }, [map, setPickupLocation]);

  return null;
};

export default UserLocationMarker;