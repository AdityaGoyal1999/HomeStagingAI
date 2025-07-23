import React, { useState } from "react";
import { Box, Button, Center, Heading, Text, VStack, FileUpload, Card, Image, SimpleGrid, Dialog, Portal, createOverlay, Input } from "@chakra-ui/react";
import { HiUpload } from "react-icons/hi";
import axios from "axios";
import { auth } from "../firebase";

const dialog = createOverlay((props) => {
    const { title, description, handleFileUpload, handleFileChange, ...rest } = props
    return (
      <Dialog.Root {...rest}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              {title && (
                <Dialog.Header>
                  <Dialog.Title>{title}</Dialog.Title>
                </Dialog.Header>
              )}
              <Dialog.Body spaceY="4">
                {description && (
                  <Dialog.Description>{description}</Dialog.Description>
                )}
                <Input type="file" accept="image/*" onChange={handleFileChange} />
                <Button onClick={handleFileUpload}>Upload</Button>
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    )
  })
  

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
            <Center my={10}>
            <Button
                onClick={() => {
                dialog.open("a", {
                    title: "Upload Image",
                    description: "Upload an image and select an action",
                    handleFileUpload: handleFileUpload,
                    handleFileChange: handleFileChange,
                })
                }}
            >
                Upload Photo
            </Button>
            

            </Center>
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
            
            <dialog.Viewport />
        </Box>
    );
}