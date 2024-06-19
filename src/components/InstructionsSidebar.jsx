import { Box, Button, Heading, Input, List, ListIcon, ListItem } from "@chakra-ui/react";
import React, { useState } from "react";
import { FaRegLightbulb } from "react-icons/fa";

const InstructionsSidebar = () => {
  const [contactInput, setContactInput] = useState('');

  const handleInputChange = (event) => {
    setContactInput(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission here
  };

  return (
    <Box p={5} border="1px" borderColor="gray.200" borderRadius="md" bg="gray.50">
      <Heading size="md" mb={3}>
        How to Book a Service
      </Heading>
      <List spacing={3}>
        <ListItem>
          <ListIcon as={FaRegLightbulb} color="green.500" />
          Select the type of service you need.
        </ListItem>
        <ListItem>
          <ListIcon as={FaRegLightbulb} color="green.500" />
          Enter your current location and destination.
        </ListItem>
        <ListItem>
          <ListIcon as={FaRegLightbulb} color="green.500" />
          Choose a convenient date and time.
        </ListItem>
        <ListItem>
          <ListIcon as={FaRegLightbulb} color="green.500" />
          Enter your contact information <Input value={contactInput} onChange={handleInputChange} />
        </ListItem>
        <ListItem>
          <ListIcon as={FaRegLightbulb} color="green.500" />
          Confirm your booking and get instant assistance.
        </ListItem>
      </List>
      <Button mt={4} onClick={handleSubmit}>Next Step</Button>
    </Box>
  );
};

export default InstructionsSidebar;