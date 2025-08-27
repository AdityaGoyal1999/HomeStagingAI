import React, { useState } from "react";
import { Box, Button, CloseButton, HStack, Center, Heading, Text, VStack, FileUpload, Card, Image, SimpleGrid, Dialog, Portal, Input, Select, createListCollection, Progress } from "@chakra-ui/react";
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
    const [fileUploading, setFileUploading] = useState(false);
    const { user } = useOutletContext();
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

            setFileUploading(true);
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
            setFileUploading(false);
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
                // const originalURL = encodeURIComponent(response.data.original.url);
                // const stagedURL = encodeURIComponent(response.data.staged.url);
                const originalURL = response.data.original.url;
                const stagedURL = response.data.staged.url;
                
                navigate(`/photo`, {
                  state: {
                    originalURL: originalURL,
                    stagedURL: stagedURL
                  }
                });
            }
            
        } catch (error) {
            setFileUploading(false);
            console.error("Error uploading photo:", error);
        }
    };

    const isEmpty = !photos || photos.length === 0;

    return (
        <Box w="100%" position="relative" h="100%">
            {/* Full-screen loading overlay */}
            {fileUploading && (
                <Box
                    position="fixed"
                    top="0"
                    left="0"
                    right="0"
                    bottom="0"
                    zIndex="9999"
                    backdropFilter="blur(8px)"
                    backgroundColor="rgba(0, 0, 0, 0.3)"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Box
                        backgroundColor="white"
                        borderRadius="lg"
                        padding="8"
                        boxShadow="2xl"
                        textAlign="center"
                        maxW="sm"
                        mx="4"
                    >
                        <Box
                            className="animate-spin"
                            width="16"
                            height="16"
                            border="4px solid"
                            borderColor="blue.200"
                            borderTopColor="blue.500"
                            borderRadius="full"
                            mx="auto"
                            mb="4"
                        />
                        <Text fontSize="lg" fontWeight="semibold" color="gray.700" mb="2">
                            Processing Your Photo
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                            Uploading and generating AI staging... This may take a few minutes.
                        </Text>
                    </Box>
                </Box>
            )}

            <Box backgroundColor="white" p={4} className="w-full" mb={8} borderRadius="md">
              <Heading size="lg" mt={2}>Your Credits</Heading>
              <Box p={8} display="flex" justifyContent="space-around" alignItems="center" gap={8}>
                <Progress.Root value={user?.credits?100-user.credits:0} max={100} w="100%" h="20px" colorPalette="blue">
                  <Progress.Track>
                    <Progress.Range />
                  </Progress.Track>
                </Progress.Root>
                <Box display="flex-col" justifyContent="center" alignItems="center">
                  <Text mb={2}>Remaining: <Text fontWeight="bold">{user?.credits} credits</Text></Text> 
                  <Button
                    onClick={async () => {
                        try{
                        // Get the current authenticated user
                        const userCredential = auth.currentUser;
                        if (!userCredential) {
                          console.error("❌ No authenticated user found");
                          return;
                        }

                        // Get the ID token for authentication
                        const token = await userCredential.getIdToken();
                        
                        console.log("🔍 Full URL being called:", `${import.meta.env.VITE_BACKEND_BASE_URL}/payment/create-checkout-session`);
                        console.log("🔍 Backend base URL:", import.meta.env.VITE_BACKEND_BASE_URL);
                        
                        const response = await axios.post(`${import.meta.env.VITE_BACKEND_BASE_URL}/payment/create-checkout-session`, {
                          amount: 1000,
                          currency: "usd",
                          description: "Home staging service",
                          successUrl: `${window.location.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
                          cancelUrl: `${window.location.origin}/payment-cancelled`,
                        }, {
                          headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                          }
                        });
                        
                        console.log("🔍 Payment response:", response.data);

                        // Go the stripe checkout page
                        if (response.data && response.data.success && response.data.checkoutUrl) {
                          window.location.href = response.data.checkoutUrl;
                        }
                      } catch (error) {
                        console.error("🔍 Error:", error);
                      }
                    }}
                  >
                    Buy Credits
                  </Button>
                </Box>
              </Box>
            </Box>
            
            <Box 
              bg="white"
              borderRadius="md"
              // boxShadow="md"
              p={4} 
              className="w-full" 
              mb={8}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
              <Heading size="lg" mb={8} mt={2}>Your Photos</Heading>

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
              </Box>
              {
                photos.length > 0? (
                <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} rowGap={8} columnGap={8}>
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
                              console.log("🔍 Photo object:", photo);
                              console.log("🔍 Generated URLs:", generatedUrls);
                              console.log("🔍 Generated URLs type:", typeof generatedUrls);
                              console.log("🔍 Generated URLs is array:", Array.isArray(generatedUrls));
                              
                              if (!generatedUrls || !Array.isArray(generatedUrls) || generatedUrls.length === 0) {
                                  console.warn("❌ No generated URLs found, navigating with original only");
                                  navigate(`/photo?original=${originalURL}`);
                                  return;
                              }
                              
                              const stagedURL = generatedUrls[0];
                              console.log("🔍 Staged URL:", stagedURL);
                              
                              if (!stagedURL) {
                                  console.warn("❌ Staged URL is null/undefined, navigating with original only");
                                  navigate(`/photo?original=${originalURL}`);
                                  return;
                              }

                              // Use navigation state instead of search parameters to avoid URL encoding issues
                              const navigationState = {
                                originalURL: photo.photoURL,
                                stagedURL: stagedURL
                              };
                              
                              console.log("🚀 Navigating with state:", navigationState);
                              console.log("🚀 Original URL length:", photo.photoURL.length);
                              console.log("🚀 Staged URL length:", stagedURL?.length || 0);
                              
                              navigate('/photo', { state: navigationState });

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
                ) : (
                  <Box display="flex" justifyContent="center" alignItems="center" h="100%" pb={10}>
                    <Text>No photos found</Text>
                  </Box>
                )
              }
            </Box>
        </Box>
    );
}