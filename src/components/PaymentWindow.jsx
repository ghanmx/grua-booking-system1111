import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  Switch,
} from '@chakra-ui/react';

const PaymentWindow = ({ isOpen, onClose, onPaymentSubmit, totalCost, isTestMode }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isTestMode) {
      setCardNumber('4111111111111111');
      setExpiryDate('12/25');
      setCvv('123');
    } else {
      setCardNumber('');
      setExpiryDate('');
      setCvv('');
    }
  }, [isTestMode]);

  const handleSubmit = () => {
    if (isTestMode) {
      onPaymentSubmit({ cardNumber, expiryDate, cvv, isTestMode });
    } else {
      if (cardNumber.length < 16) {
        setError('Payment Failed: El número de tarjeta está incompleto.');
      } else {
        setError('');
        onPaymentSubmit({ cardNumber, expiryDate, cvv, isTestMode });
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Payment Information</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl display="flex" alignItems="center">
              <FormLabel htmlFor="test-mode" mb="0">
                Test Mode
              </FormLabel>
              <Switch
                id="test-mode"
                isChecked={isTestMode}
                isReadOnly
              />
            </FormControl>
            <FormControl>
              <FormLabel>Card Number</FormLabel>
              <Input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="1234 5678 9012 3456"
                isDisabled={isTestMode}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Expiry Date</FormLabel>
              <Input
                type="text"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                placeholder="MM/YY"
                isDisabled={isTestMode}
              />
            </FormControl>
            <FormControl>
              <FormLabel>CVV</FormLabel>
              <Input
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                placeholder="123"
                isDisabled={isTestMode}
              />
            </FormControl>
            <Text fontWeight="bold">Total Cost: ${totalCost.toFixed(2)}</Text>
            {error && <Text color="red.500">{error}</Text>}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
            {isTestMode ? 'Submit Test Payment' : 'Submit Payment'}
          </Button>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PaymentWindow;