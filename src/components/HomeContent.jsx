import React, { useState } from "react";
import { Box, Button, CloseButton, HStack, Center, Heading, Text, VStack, FileUpload, Card, Image, SimpleGrid, Dialog, Portal, createOverlay, Input } from "@chakra-ui/react";
import { HiUpload } from "react-icons/hi";
import axios from "axios";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";  

const UploadDialog = ({ handleFileUpload, handleFileChange }) => {
  return (
    <Portal>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Upload Image</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <Text mb={4}>Upload an image and select an action</Text>
            <Input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange}
              mb={4}
            />
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.ActionTrigger asChild>
              <Button variant="outline">Cancel</Button>
            </Dialog.ActionTrigger>
            <Button onClick={handleFileUpload}>Upload</Button>
          </Dialog.Footer>
          <Dialog.CloseTrigger asChild>
            <CloseButton size="sm" />
          </Dialog.CloseTrigger>
        </Dialog.Content>
      </Dialog.Positioner>
    </Portal>
  )
}
  

export default function HomeContent({ photos, setPhotos }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const navigate = useNavigate();

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleFileUpload = async () => {
        // console.log(selectedFile);
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
              <Dialog.Root placement="center" motionPreset="slide-in-bottom">
                <Dialog.Trigger asChild>
                  <Button leftIcon={<HiUpload />} colorScheme="blue">
                    Upload Photo
                  </Button>
                </Dialog.Trigger>
                <UploadDialog 
                  handleFileUpload={handleFileUpload}
                  handleFileChange={handleFileChange}
                />
              </Dialog.Root>
            </Center>
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={8} mb={8} bg="gray.50">
                {photos.map((photo) => (
                  
                  <Card.Root
                      bg="white"
                      boxShadow="md"
                      borderRadius="md"
                      overflow="hidden"
                      onClick={() => {
                          // navigate(`/photo/${photo.photoURL}`);
                          navigate(`/photo?id=${encodeURIComponent(photo.photoURL)}`);
                      }}
                      key={photo.photoURL}
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
        </Box>
    );
}