import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Box, VStack, Heading, Text, Spinner, useToast, Alert, AlertIcon, AlertTitle, AlertDescription, SimpleGrid, useMediaQuery } from "@chakra-ui/react";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useQuery } from '@tanstack/react-query';
import { getBookings } from '../server/db';
import { vehicleBrands, vehicleModels } from '../utils/vehicleData';
import { useBookingForm } from '../hooks/useBookingForm';
import { usePaymentSubmit } from '../hooks/usePaymentSubmit';

const MapRoute = lazy(() => import('../components/booking/MapRoute'));
const BookingForm = lazy(() => import('../components/booking/BookingForm'));
const PaymentWindow = lazy(() => import('../components/booking/PaymentWindow'));

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const BookingGuide = () => (
  <VStack spacing={4} align="start" p={6} bg="rgba(255,255,255,0.1)" borderRadius="md" backdropFilter="blur(10px)">
    <Heading size="md">Booking Guide</Heading>
    <Text>1. Enter your vehicle details</Text>
    <Text>2. Set pickup and drop-off locations</Text>
    <Text>3. Choose your service type</Text>
    <Text>4. Review and confirm your booking</Text>
    <Text>5. Complete the payment process</Text>
  </VStack>
);

const BookingPage = () => {
  const toast = useToast();
  const [mapError, setMapError] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [key, setKey] = useState(0);
  const [isMobile] = useMediaQuery("(max-width: 48em)");

  const {
    formData,
    setFormData,
    distance,
    setDistance,
    totalCost,
    setTotalCost,
    selectedTowTruck,
    isPaymentWindowOpen,
    setIsPaymentWindowOpen,
    handleChange,
    handleDateTimeChange,
    handleBookingProcess,
    createBookingMutation,
  } = useBookingForm();

  const handlePaymentSubmit = usePaymentSubmit(formData, totalCost, createBookingMutation, setIsPaymentWindowOpen);

  const { isLoading, error, data } = useQuery({
    queryKey: ['bookings'],
    queryFn: getBookings,
    retry: 3,
    retryDelay: (attempt) => Math.min(attempt * 1000, 3000),
    onError: (err) => {
      console.error('Error fetching bookings:', err);
      toast({
        title: 'Error fetching bookings',
        description: 'Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoaded(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleMapError = (error) => {
    console.error('Map error:', error);
    setMapError(true);
    toast({
      title: 'Error loading map',
      description: 'Unable to load the map. Please refresh the page.',
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
  };

  const refreshMap = () => {
    setKey(prevKey => prevKey + 1);
  };

  const handleAddressUpdate = (address, isPickup) => {
    if (isPickup) {
      setFormData(prevData => ({ ...prevData, pickupAddress: address }));
    } else {
      setFormData(prevData => ({ ...prevData, dropOffAddress: address }));
    }
  };

  if (isLoading || !isPageLoaded) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4}>
        <Alert status="error">
          <AlertIcon />
          <AlertTitle mr={2}>Error loading bookings</AlertTitle>
          <AlertDescription>Please try again later. If the problem persists, contact support.</AlertDescription>
        </Alert>
      </Box>
    );
  }

  return (
    <Box position="relative" minHeight="100vh" width="100%" overflow="hidden">
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8} p={4}>
        <VStack spacing={8} align="stretch">
          <Heading as="h1" size="xl">Book Your Tow</Heading>
          <BookingGuide />
          <Suspense fallback={<Spinner />}>
            <BookingForm
              formData={formData}
              setFormData={setFormData}
              handleChange={handleChange}
              handleDateTimeChange={handleDateTimeChange}
              handleBookingProcess={handleBookingProcess}
              isLoading={createBookingMutation?.isLoading || false}
              selectedTowTruck={selectedTowTruck}
              totalCost={totalCost}
              setTotalCost={setTotalCost}
              distance={distance}
              vehicleBrands={vehicleBrands}
              vehicleModels={vehicleModels}
              setIsPaymentWindowOpen={setIsPaymentWindowOpen}
              mapError={mapError}
              refreshMap={refreshMap}
            />
          </Suspense>
        </VStack>
        <Box height={{ base: "300px", md: "600px" }} position="relative">
          <Suspense fallback={<Spinner />}>
            <MapRoute
              key={key}
              setPickupAddress={(address) => handleAddressUpdate(address, true)}
              setDropOffAddress={(address) => handleAddressUpdate(address, false)}
              setDistance={setDistance}
              setTotalCost={setTotalCost}
              vehicleSize={formData.vehicleSize}
              onError={handleMapError}
            />
          </Suspense>
        </Box>
      </SimpleGrid>
      {isPaymentWindowOpen && (
        <Suspense fallback={<Spinner />}>
          <Elements stripe={stripePromise}>
            <PaymentWindow
              isOpen={isPaymentWindowOpen}
              onClose={() => setIsPaymentWindowOpen(false)}
              onPaymentSubmit={handlePaymentSubmit}
              totalCost={totalCost}
            />
          </Elements>
        </Suspense>
      )}
    </Box>
  );
};

export default BookingPage;