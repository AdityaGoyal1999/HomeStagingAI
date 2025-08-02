import { Box, Text, Image, VStack, Heading } from "@chakra-ui/react";
import { useSearchParams } from "react-router-dom";

export default function Page() {
    const [searchParams] = useSearchParams();
    const photoURL = searchParams.get('id');

    return (
        <Box p={8}>
            <VStack spacing={6} align="center">
                <Heading size="lg">Photo Details</Heading>
                <Text fontSize="md" color="gray.600">
                    Photo URL: {photoURL}
                </Text>
                <Image 
                    src={photoURL} 
                    alt="Photo" 
                    maxW="600px" 
                    maxH="400px"
                    objectFit="contain"
                    borderRadius="md"
                    boxShadow="lg"
                />
            </VStack>
        </Box>
    )
}