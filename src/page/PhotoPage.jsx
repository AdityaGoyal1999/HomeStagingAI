import { Box, Text, Image, VStack, HStack, Heading, Badge, Tabs } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';
import { useEffect, useState } from 'react';


const SliderComponent = ({originalURL, stagedURL}) => {
    return (
        <Box w="full" maxW="800px" mb={8} position="relative">
            <ReactCompareSlider
                itemOne={
                    <Box position="relative">
                        <ReactCompareSliderImage src={originalURL} srcSet={originalURL} alt="Original Image" />
                        <Text
                            position="absolute"
                            top="4"
                            left="4"
                            bg="blue.500"
                            color="white"
                            px="3"
                            py="1"
                            borderRadius="md"
                            fontSize="sm"
                            fontWeight="bold"
                            zIndex="10"
                        >
                            Original
                        </Text>
                    </Box>
                }
                itemTwo={
                    <Box position="relative">
                        <ReactCompareSliderImage src={stagedURL} srcSet={stagedURL} alt="AI Staged Image" />
                        <Text
                            position="absolute"
                            top="4"
                            right="4"
                            bg="green.500"
                            color="white"
                            px="3"
                            py="1"
                            borderRadius="md"
                            fontSize="sm"
                            fontWeight="bold"
                            zIndex="10"
                        >
                            AI Staged
                        </Text>
                    </Box>
                }
                style={{
                    width: '100%',
                    height: '500px',
                    borderRadius: '12px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                }}
                sliderLineWidth={4}
                sliderLineColor="#3182ce"
                handleSize={40}
                handleBackgroundColor="#3182ce"
            />
        </Box>
    )
}

const SideBySideComponent = ({originalURL, stagedURL}) => {
    return (
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
    )
}

export default function PhotoPage() {
    const location = useLocation();
    const [isSafari, setIsSafari] = useState(false);
    
    // Get URLs from navigation state instead of search parameters
    const originalURL = location.state?.originalURL;
    const stagedURL = location.state?.stagedURL;

    // Detect Safari browser
    useEffect(() => {
        const userAgent = navigator.userAgent.toLowerCase();
        const isSafariBrowser = /safari/.test(userAgent) && !/chrome/.test(userAgent);
        setIsSafari(isSafariBrowser);
        console.log("🔍 Browser detection:", { isSafari: isSafariBrowser, userAgent });
    }, []);

    console.log("🔍 Location state:", location.state);
    console.log("🔍 Original URL:", originalURL);
    console.log("🔍 Staged URL:", stagedURL);
    console.log("🔍 Staged URL length:", stagedURL?.length || 0);
    console.log("🔍 Staged URL includes '...':", stagedURL?.includes('...') || false);

    return (
        <Box p={8}>
            <VStack spacing={8} align="center">
                <Heading size="lg">AI Staged</Heading>
                
                {originalURL && stagedURL ? (
                    <>
                        {/* <SliderComponent originalURL={originalURL} stagedURL={stagedURL} />

                        <SideBySideComponent originalURL={originalURL} stagedURL={stagedURL} /> */}
                        <Tabs.Root justify="center" defaultValue="slider">
                            <Tabs.List>
                                <Tabs.Trigger value="slider">
                                {/* <LuUser /> */}
                                Slider View
                                </Tabs.Trigger>
                                <Tabs.Trigger value="sideBySide">
                                {/* <LuFolder /> */}
                                Side by Side View
                                </Tabs.Trigger>
                            </Tabs.List>
                            <Tabs.Content value="slider" >
                                <SliderComponent originalURL={originalURL} stagedURL={stagedURL} />
                            </Tabs.Content>
                            <Tabs.Content value="sideBySide">
                                <SideBySideComponent originalURL={originalURL} stagedURL={stagedURL} />
                            </Tabs.Content>
                        </Tabs.Root>
                    </>
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
                        {!originalURL && !stagedURL && (
                            <Text fontSize="md" color="red.500">
                                No image data provided. Please navigate from the home page.
                            </Text>
                        )}
                    </VStack>
                )}

            </VStack>
        </Box>
    )
}