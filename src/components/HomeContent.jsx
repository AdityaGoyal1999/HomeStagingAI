import { Box, Button, Center, Heading, Text, VStack } from "@chakra-ui/react";

export default function HomeContent({ user, photos }) {
    const isEmpty = !photos || photos.length === 0;
    console.log(user, photos);
    return (
        <Box w="100%">
            <Heading size="lg" mb={8} mt={2}>
                All photos
            </Heading>
            {isEmpty ? (
                <Center minH="60vh">
                    <VStack
                        spacing={6}
                        bg="white"
                        borderRadius="xl"
                        boxShadow="md"
                        p={12}
                        w={{ base: "100%", sm: "400px" }}
                    >
                        <Box
                            bg="gray.100"
                            borderRadius="full"
                            p={4}
                            mb={2}
                        >
                            {/* <AddIcon boxSize={8} color="gray.400" /> */}
                            <p>Upload Photo</p>
                        </Box>
                        <Text fontWeight="bold" fontSize="xl">
                            No photos yet
                        </Text>
                        <Text color="gray.500" textAlign="center">
                            You don't have any photos yet. Click the button below to upload your first one.
                        </Text>
                        <Button colorScheme="blue" size="lg">
                            Upload photo
                        </Button>
                    </VStack>
                </Center>
            ) : (
                <Box>
                    {/* Photo grid or list here */}
                    {photos.map((photo) => (
                        <img src={photo.photoURL} alt="Photo" />
                    ))}
                </Box>
            )}
        </Box>
    );
}