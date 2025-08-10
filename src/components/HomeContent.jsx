import React, { useState } from "react";
import { Box, Button, CloseButton, HStack, Center, Heading, Text, VStack, FileUpload, Card, Image, SimpleGrid, Dialog, Portal, Input, Select, createListCollection } from "@chakra-ui/react";
import { HiUpload } from "react-icons/hi";
import axios from "axios";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";  
import { useOutletContext } from "react-router-dom";
import { AiOutlineConsoleSql } from "react-icons/ai";


const roomStyles = createListCollection({
  items: [
    { label: "Minimalist", value: "minimalist" },
    { label: "Scandinavian", value: "scandinavian" },
    { label: "Modern", value: "modern" },
    { label: "Bohemian", value: "bohemian" },
    { label: "Vintage", value: "vintage" },
    { label: "Industrial", value: "industrial" },
    { label: "Rustic", value: "rustic" },
    { label: "Coastal", value: "coastal" },
    { label: "Tropical", value: "tropical" },
    { label: "Mid-Century Modern", value: "mid-century-modern" },
  ],
})

const UploadDialog = ({ handleFileUpload, handleFileChange, selectedStyle, onStyleChange }) => {
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
            <Box mb={4}>
              <Text mb={2} fontSize="sm" fontWeight="medium">Select a style</Text>
              <select 
                value={selectedStyle}
                onChange={(e) => onStyleChange(e.target.value)}
                style={{
                  width: "320px",
                  padding: "8px 12px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "6px",
                  fontSize: "14px"
                }}
              >
                <option value="">Select style</option>
                {roomStyles.items.map((roomStyle) => (
                  <option key={roomStyle.value} value={roomStyle.value}>
                    {roomStyle.label}
                  </option>
                ))}
              </select>
            </Box>

            
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
  

export default function HomeContent() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedStyle, setSelectedStyle] = useState("");
    const { photos, setPhotos } = useOutletContext();
    const navigate = useNavigate();

    // console.log("This is the photos", photos);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleStyleChange = (value) => {
        setSelectedStyle(value);
    };

    const handleFileUpload = async () => {
        // console.log(selectedFile);
        if (!selectedFile) {
            alert("Please select a file to upload");
            return;
        }
        if (!selectedStyle) {
            alert("Please select a room style");
            return;
        }
        try {

            const userCredential = auth.currentUser
            if (!userCredential) return;
            
            const token = await userCredential.getIdToken();

            const formData = new FormData();
            formData.append("photo", selectedFile);
            formData.append("style", selectedStyle);

            const response = await axios.post(`${import.meta.env.VITE_BACKEND_BASE_URL}/uploadPhoto`, formData, {
                headers: {
                    // "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                console.log('Upload response:', response.data);
                
                // Add both original and staged photos to the photos array
                setPhotos([...photos, {
                  photoURL: response.data.original.url,
                  type: 'original'
                }, 
                
                // {
                //   photoURL: response.data.staged.url,
                //   type: 'staged'
                // }
              
              ]);
                
                // Navigate to comparison page with both URLs
                const originalURL = encodeURIComponent(response.data.original.url);
                const stagedURL = encodeURIComponent(response.data.staged.url);
                navigate(`/photo?original=${originalURL}&staged=${stagedURL}`);
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
                  selectedStyle={selectedStyle}
                  onStyleChange={handleStyleChange}
                />
              </Dialog.Root>
            </Center>
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={8} mb={8}>
                {photos.map((photo) => (
                  
                  <Card.Root
                      bg="white"
                      boxShadow="md"
                      borderRadius="md"
                      overflow="hidden"
                      onClick={() => {
                          // navigate(`/photo/${photo.photoURL}`);
                          const originalURL = encodeURIComponent(photo.photoURL);

                          // get the generated URLS and attach them to the image
                          const generatedUrls = photo.generatedUrls;
                          // TODO: can pass more than 2 images
                          const stagedURL = generatedUrls[0];

                          navigate(`/photo?original=${originalURL}&staged=${stagedURL}`);

                          // TODO: will have to fetch the staged URL from backend
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