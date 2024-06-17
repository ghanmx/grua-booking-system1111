import { Box, Text, Heading, VStack, Flex } from '@chakra-ui/react';
import { FaCheckCircle } from 'react-icons/fa';

const About = () => (
  <Box p={4}>
    <Flex direction="column" align="center" justify="center" p={10}>
      <Heading mb={4}>About Our Tow Service</Heading>
      <Text fontSize="lg" mb={6}>We provide reliable and efficient tow services to get you back on the road quickly.</Text>
    </Flex>
    <Box bg="gray.100" p={10}>
      <Heading size="lg" textAlign="center" mb={4}>Our Features</Heading>
      <VStack spacing={5}>
        <Flex align="center">
          <FaCheckCircle size="24px" />
          <Text ml={2}>24/7 Availability</Text>
        </Flex>
        <Flex align="center">
          <FaCheckCircle size="24px" />
          <Text ml={2}>Professional Staff</Text>
        </Flex>
        <Flex align="center">
          <FaCheckCircle size="24px" />
          <Text ml={2}>Affordable Pricing</Text>
        </Flex>
      </VStack>
    </Box>
  </Box>
);

export default About;