import { handleLogout } from "../auth/authentication";
import { useState, useEffect } from "react";
import axios from "axios"
import { auth } from "../firebase"
import { Box, Flex, Button, Text, Avatar } from "@chakra-ui/react"
import Sidebar from "./Sidebar";
import HomeContent from "./HomeContent";

export default function Home() {

    const [user, setUser] = useState({}) 
    const [photos, setPhotos] = useState([])

    useEffect(() => {
        const getProfile = async () => {
            const userCredential = auth.currentUser
            if (!userCredential) return;

            try {
                const token = await userCredential.getIdToken();
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/getProfile`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUser(res.data.user);
            } catch (error) {
                // Handle error (e.g., show a message, log out user, etc.)
                console.error("Failed to fetch profile:", error);
                // Optionally, set an error state here to show in your UI
            }
        };

        const getPhotos = async () => {
            const userCredential = auth.currentUser
            if (!userCredential) return;
            
            try {
                const token = await userCredential.getIdToken();
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/getPhotos`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setPhotos(res.data.photos);
            } catch (error) {
                console.error("Failed to fetch photos:", error);
            }
        }


        getProfile();
        getPhotos();

    }, []);
    return (
        <>
            {/* Top Navbar */}
            <Box
                position="fixed"
                top={0}
                left={0}
                width="100%"
                zIndex={100}
                bg="rgba(255, 255, 255, 0.2)"
                style={{
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                    borderBottom: "1px solid rgba(255,255,255,0.3)"
                }}
                boxShadow="sm"
            >
                <Flex align="center" justify="space-between" px={8} py={4}>
                    <Text fontWeight="bold" fontSize="xl" letterSpacing="wide">
                        HomeStaging
                    </Text>
                    <Box display="flex" alignItems="center" gap={4}>
                        <Flex align="center" gap={4}>
                            <Avatar.Root size="sm" key="sm">
                                <Avatar.Fallback name={user.name} />
                                <Avatar.Image src={user.photoURL} />
                            </Avatar.Root>
                        </Flex>
                        <Button colorScheme="blue" variant="outline" onClick={handleLogout}>
                            Sign Out
                        </Button>
                    </Box>
                </Flex>
            </Box>

            {/* Content Section */}
            <Flex pt={24} px={0}>
                <Sidebar />
                <Box flex={1} px={{ base: 4, md: 8 }} ml={{ base: 0, md: 60 }}>
                    <HomeContent user={user} photos={photos} setPhotos={setPhotos} />
                </Box>
            </Flex>
        </>
    )
}