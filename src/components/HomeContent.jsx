import React, { useState } from "react";
import { Box, Button, Center, Heading, Text, VStack, FileUpload, Card, Image, SimpleGrid } from "@chakra-ui/react";
import { HiUpload } from "react-icons/hi";
import axios from "axios";
import { auth } from "../firebase";

export default function HomeContent({ photos, setPhotos }) {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleFileUpload = async () => {
        console.log(selectedFile);
        if (!selectedFile) return;
        try {

            const userCredential = auth.currentUser
            if (!userCredential) return;
            
            const token = await userCredential.getIdToken();

            const formData = new FormData();
            formData.append("photo", selectedFile);

            const response = await axios.post(`${import.meta.env.VITE_BACKEND_BASE_URL}/uploadPhoto`, formData, {
                headers: {
                    // "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                setPhotos([...photos, response.data]);
            }
        } catch (error) {
            console.error("Error uploading photo:", error);
        }
    };

    const isEmpty = !photos || photos.length === 0;

    return (
        <Box w="100%">
            <Heading size="lg" mb={8} mt={2}>
                All photos
            </Heading>
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={8} mb={8} bg="gray.50">
                {photos.map((photo) => (
                    <Card.Root
                        key={photo.photoURL}
                        bg="white"
                        boxShadow="md"
                        borderRadius="md"
                        overflow="hidden"
                        // Optionally add margin for extra separation
                        // m={2}
                    >
                        <Card.Body p={0} w="100%" h="250px">
                            <Image
                                src={photo.photoURL}
                                alt="Photo"
                                width="100%"
                                height="100%"
                                objectFit="cover"
                                display="block"
                            />
                        </Card.Body>
                    </Card.Root>
                ))}
            </SimpleGrid>
            <Center minH="60vh">
                <VStack
                    spacing={6}
                    bg="white"
                    borderRadius="xl"
                    boxShadow="md"
                    p={12}
                    w={{ base: "100%", sm: "400px" }}
                >
                    <Text fontWeight="bold" fontSize="xl">
                        Add Photos Here
                    </Text>
                    <Box>
                        <FileUpload.Root>
                            <FileUpload.HiddenInput onChange={handleFileChange} />
                            <FileUpload.Trigger asChild>
                                <Button variant="outline" size="sm">
                                    <HiUpload /> Upload file
                                </Button>
                            </FileUpload.Trigger>
                            <FileUpload.List />
                        </FileUpload.Root>
                        
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleFileUpload}
                            leftIcon={<HiUpload />}
                            isDisabled={!selectedFile}
                        >
                            Submit
                        </Button>
                    </Box>
                </VStack>
            </Center>
        </Box>
    );
}