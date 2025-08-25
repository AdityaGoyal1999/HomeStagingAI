import { Box, Button, Text } from '@chakra-ui/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentCancelled = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">

      <Text fontSize="6xl" fontWeight="bold">Payment Cancelled</Text>
      <Text fontSize="2xl">Your payment was cancelled. No charges were made to your account.</Text>

      <Button
        colorPalette="blue"
        onClick={() => {
          navigate('/home')
        }}
      >
        Return Home
      </Button>

      <Box 
      backgroundColor="white" 
      display="flex-col" 
      justifyContent="center" 
      alignItems="center" gap={8} 
      border="1px solid" 
      borderColor="gray.200" 
      borderRadius="md" p={8}
      shadow="md"
      >

        <Text fontSize="2xl" fontWeight="bold">❌ Payment Cancelled</Text>
        <Box display="flex" flexDirection="column" gap={2} p={4}>
          <Text>No charges were made to your account. You can try again anytime.</Text>
        </Box>
        
      </Box>
      
    </div>
  );
};

export default PaymentCancelled; 