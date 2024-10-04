import { useQuery } from '@tanstack/react-query';
import { getPaidBookings } from '../server/db';
import { useToast } from '@chakra-ui/react';

export const useBookings = () => {
  const toast = useToast();

  return useQuery({
    queryKey: ['bookings'],
    queryFn: getPaidBookings,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
    onError: (error) => {
      console.error('Failed to fetch paid bookings:', error);
      toast({
        title: 'Error fetching bookings',
        description: 'Please try again later or contact support if the problem persists.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });
};