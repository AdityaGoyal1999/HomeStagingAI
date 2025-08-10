import { Box, Text, Image, VStack, HStack, Heading, Badge } from "@chakra-ui/react";
import { useSearchParams } from "react-router-dom";

export default function Page() {
    const [searchParams] = useSearchParams();
    console.log('Search params:', Object.fromEntries(searchParams.entries()));
    console.log('Original URL:', searchParams.get('original'));
    console.log('Staged URL:', searchParams.get('staged'));
    console.log('Original URL:', searchParams.get('id'));
    
    const originalURL = searchParams.get('original');
    const stagedURL = searchParams.get('staged');

    return (
        <Box p={8}>
            <VStack spacing={8} align="center">
                <Heading size="lg">Before & After Comparison</Heading>
                
                {originalURL && stagedURL ? (
                    <HStack spacing={8} align="flex-start" w="full" maxW="1200px">
                        {/* Original Image */}
                        <VStack spacing={4} flex={1}>
                            <Badge colorScheme="blue" fontSize="md" p={2}>
                                Original Room
                            </Badge>
                            <Image 
                                src={originalURL} 
                                alt="Original Room" 
                                w="full"
                                maxH="500px"
                                objectFit="contain"
                                borderRadius="lg"
                                boxShadow="xl"
                                border="2px solid"
                                borderColor="blue.200"
                            />
                            <Text fontSize="sm" color="gray.500" textAlign="center">
                                Your original room photo
                            </Text>
                        </VStack>

                        {/* Divider */}
                        <VStack spacing={4} justify="center" h="500px">
                            <Box w="2px" h="full" bg="gray.300" />
                            <Text fontSize="lg" fontWeight="bold" color="gray.600">
                                →
                            </Text>
                        </VStack>

                        {/* Staged Image */}
                        <VStack spacing={4} flex={1}>
                            <Badge colorScheme="green" fontSize="md" p={2}>
                                AI Staged
                            </Badge>
                            <Image 
                                src={stagedURL} 
                                alt="Staged Room" 
                                w="full"
                                maxH="500px"
                                objectFit="contain"
                                borderRadius="lg"
                                boxShadow="xl"
                                border="2px solid"
                                borderColor="green.200"
                            />
                            <Text fontSize="sm" color="gray.500" textAlign="center">
                                Professionally staged by AI
                            </Text>
                        </VStack>
                    </HStack>
                ) : (
                    <VStack spacing={6} align="center">
                        <Text fontSize="lg" color="gray.600">
                            {originalURL ? 'Staged image not available' : 'Original image not available'}
                        </Text>
                        {originalURL && (
                            <Image 
                                src={originalURL} 
                                alt="Original Photo" 
                                maxW="600px" 
                                maxH="400px"
                                objectFit="contain"
                                borderRadius="md"
                                boxShadow="lg"
                            />
                        )}
                    </VStack>
                )}

                {/* Image URLs for debugging */}
                <VStack spacing={2} align="center" w="full" maxW="1200px">
                    <Box w="full" h="1px" bg="gray.300" />
                    <Text fontSize="xs" color="gray.400">
                        Original: {originalURL || 'Not provided'}
                    </Text>
                    <Text fontSize="xs" color="gray.400">
                        Staged: {stagedURL || 'Not provided'}
                    </Text>
                </VStack>
            </VStack>
        </Box>
    )
}