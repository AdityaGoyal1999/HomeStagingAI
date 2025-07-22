import { handleLogout } from "../auth/authentication";
import { useState, useEffect } from "react";
import axios from "axios"
import { auth } from "../firebase"
import { Box, Flex, Button, Text, Avatar } from "@chakra-ui/react"

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
                                <Avatar.Fallback name="Segun Adebayo" />
                                <Avatar.Image src="https://bit.ly/sage-adebayo" />
                            </Avatar.Root>
                        </Flex>
                        <Button colorScheme="blue" variant="outline" onClick={handleLogout}>
                            Sign Out
                        </Button>
                    </Box>
                </Flex>
            </Box>

            
            <Box pt={24} px={8}>
                <h2>You are logged in</h2>
                <p>User: {user.email}</p>
                <h3>Photos</h3>
                <div>
                    {photos.map((photo) => (
                        <img src={photo.photoURL} alt="Photo" />
                    ))}
                </div>
            </Box>
        </>
    )
}