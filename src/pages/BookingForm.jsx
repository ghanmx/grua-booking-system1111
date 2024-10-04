import React, { useState, useCallback, useEffect } from 'react';
import { Box, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import MapRoute from '../components/booking/MapRoute';
import FloatingForm from '../components/booking/FloatingForm';
import PaymentWindow from '../components/booking/PaymentWindow';
import { sendAdminNotification } from '../utils/adminNotification';
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { createBooking, getBookings } from '../server/db';
import { vehicleBrands, vehicleModels, vehicleSizes } from '../utils/vehicleData';
import { getTowTruckType, calculateTotalCost } from '../utils/towTruckSelection';
import { testPayment } from '../utils/testPayment';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const BookingForm = () => {
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem('bookingFormData');
    return savedData ? JSON.parse(savedData) : {
      serviceType: '',
      userName: '',
      phoneNumber: '',
      vehicleBrand: '',
      vehicleModel: '',
      vehicleColor: '',
      licensePlate: '',
      vehicleSize: '',
      pickupAddress: '',
      dropOffAddress: '',
      vehicleIssue: '',
      additionalDetails: '',
      wheelsStatus: '',
      pickupDateTime: new Date(),
      paymentMethod: 'card',
    };
  });
  const [distance, setDistance] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [selectedTowTruck, setSelectedTowTruck] = useState('');
  const [isPaymentWindowOpen, setIsPaymentWindowOpen] = useState(false);
  const navigate = useNavigate();
  const { session } = useSupabaseAuth();
  const toast = useToast();
  const queryClient = useQueryClient();

  // Query to fetch bookings
  const { data: bookings } = useQuery({
    queryKey: ['bookings'],
    queryFn: getBookings,
  });

  // Mutation to create a booking
  const createBookingMutation = useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries('bookings');
      toast({
        title: 'Booking created.',
        description: "We've created your booking for you.",
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      navigate('/confirmation');
    },
    onError: (error) => {
      toast({
        title: 'An error occurred.',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));

    if (name === 'vehicleBrand') {
      setFormData(prevData => ({
        ...prevData,
        vehicleModel: ''
      }));
    }

    if (name === 'vehicleModel') {
      const vehicleSize = getVehicleSize(value);
      const towTruckType = getTowTruckType(vehicleSize);
      setFormData(prevData => ({
        ...prevData,
        vehicleSize: vehicleSize
      }));
      setSelectedTowTruck(towTruckType);
      updateTotalCost(distance, towTruckType);
    }
  }, [distance]);

  const handleDateTimeChange = useCallback((date) => {
    setFormData(prevData => ({
      ...prevData,
      pickupDateTime: date
    }));
  }, []);

  const updateTotalCost = useCallback((distance, towTruckType) => {
    const cost = calculateTotalCost(distance, towTruckType);
    setTotalCost(cost);
  }, []);

  const handleBookingProcess = useCallback(async () => {
    if (!session && !testModeUser) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to create a booking.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    // Validate form data
    if (!formData.serviceType || !formData.userName || !formData.phoneNumber || !formData.vehicleBrand || !formData.vehicleModel) {
      toast({
        title: 'Incomplete Form',
        description: 'Please fill in all required fields.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    // Test payment
    const testResult = await testPayment(totalCost);
    if (!testResult.success) {
      toast({
        title: 'Payment Test Failed',
        description: testResult.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsPaymentWindowOpen(true);
  }, [session, toast, formData, totalCost]);

  const handlePaymentSubmit = useCallback(async (paymentMethod) => {
    setIsPaymentWindowOpen(false);

    try {
      const response = await fetch('/api/process-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          amount: totalCost * 100, // Convert to cents
        }),
      });
      const result = await response.json();

      if (result.success) {
        const bookingData = {
          ...formData,
          userId: session?.user?.id || 'test_user_id',
          totalCost,
          paymentIntentId: result.paymentIntentId,
          status: 'paid',
        };

        await createBookingMutation.mutateAsync(bookingData);
        await sendAdminNotification(bookingData, totalCost);

        toast({
          title: 'Payment Successful',
          description: 'Your payment has been processed successfully.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });

        // Auto-refresh bookings data
        queryClient.invalidateQueries('bookings');
      } else {
        throw new Error('Payment processing failed');
      }
    } catch (error) {
      toast({
        title: 'Payment Error',
        description: error.message || 'An unexpected error occurred during payment processing.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [formData, session, totalCost, createBookingMutation, toast, queryClient]);

  useEffect(() => {
    localStorage.setItem('bookingFormData', JSON.stringify(formData));
  }, [formData]);

  return (
    <Box position="relative" height="100vh" width="100vw">
      <MapRoute
        setPickupAddress={(address) => setFormData(prev => ({ ...prev, pickupAddress: address }))}
        setDropOffAddress={(address) => setFormData(prev => ({ ...prev, dropOffAddress: address }))}
        setDistance={setDistance}
        setTotalCost={setTotalCost}
        vehicleSize={formData.vehicleSize}
      />
      <FloatingForm
        formData={formData}
        setFormData={setFormData}
        handleChange={handleChange}
        handleDateTimeChange={handleDateTimeChange}
        handleBookingProcess={handleBookingProcess}
        isLoading={createBookingMutation.isLoading}
        selectedTowTruck={selectedTowTruck}
        totalCost={totalCost}
        vehicleBrands={vehicleBrands}
        vehicleModels={vehicleModels}
      />
      {isPaymentWindowOpen && (
        <Elements stripe={stripePromise}>
          <PaymentWindow
            isOpen={isPaymentWindowOpen}
            onClose={() => setIsPaymentWindowOpen(false)}
            onPaymentSubmit={handlePaymentSubmit}
            totalCost={totalCost}
          />
        </Elements>
      )}
    </Box>
  );
};

export default BookingForm;
