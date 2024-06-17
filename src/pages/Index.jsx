import { Container, Text, VStack } from "@chakra-ui/react";

const Index = () => {
  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4}>
        <Text fontSize="2xl">Welcome to Tow Service Booking</Text>
        <Text>Start by selecting a service or navigating through the menu.</Text>
      </VStack>
    </Container>
  );
};

export default Index;