import { Box, Flex, Link, Spacer, Text } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

const Navbar = () => {
  return (
    <Box bg="blue.500" p={4} color="white">
      <Flex maxW="1200px" mx="auto" align="center">
        <Text fontSize="xl" fontWeight="bold">Tow Service</Text>
        <Spacer />
        <Flex>
          <Link as={RouterLink} to="/" p={2} mx={2} _hover={{ textDecoration: "none", bg: "blue.600" }}>Home</Link>
          <Link as={RouterLink} to="/about" p={2} mx={2} _hover={{ textDecoration: "none", bg: "blue.600" }}>About</Link>
          <Link as={RouterLink} to="/contact" p={2} mx={2} _hover={{ textDecoration: "none", bg: "blue.600" }}>Contact</Link>
          <Link as={RouterLink} to="/booking" p={2} mx={2} _hover={{ textDecoration: "none", bg: "blue.600" }}>Book Now</Link>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;