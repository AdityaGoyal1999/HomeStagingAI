import { Box, Button, Text } from '@chakra-ui/react';
import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const navigate = useNavigate()
  

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">

      <Text fontSize="6xl" fontWeight="bold">Payment Successful!</Text>
      <Text fontSize="2xl">Thank you for your purchase. Your payment has been processed successfully.</Text>

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

        <Text fontSize="2xl" fontWeight="bold">✅Transaction Details</Text>
        <Box display="flex" flexDirection="column" gap={2} p={4}>
          {/* <Text fontSize="sm">Transaction ID: {sessionId}</Text> */}
          {/* <Text fontSize="sm">Amount: {searchParams.get('amount')}</Text> */}
          {/* <Text fontSize="sm">Payment Method: Credit Card</Text> */}
          <Text>You will receive an email with your receipt shortly.</Text>
        </Box>
        {/* <Text fontSize="sm">Date: {new Date().toLocaleDateString()}</Text> */}
        {/* <Text fontSize="sm">Email: {user?.email}</Text> */}
      </Box>
        
        
    </div>
  );
};

export default PaymentSuccess; 