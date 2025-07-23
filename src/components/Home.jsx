import { handleLogout } from "../auth/authentication";
import { useState, useEffect } from "react";
import axios from "axios"
import { auth } from "../firebase"
import { Box, Flex, Button, Text, Avatar, Drawer } from "@chakra-ui/react"
import Sidebar from "./Sidebar";
import HomeContent from "./HomeContent";


export default function Home() {

    const [user, setUser] = useState({}) 
    const [photos, setPhotos] = useState([])


    useEffect(() => {
        // Disable scroll
        document.body.style.overflow = "hidden";
        return () => {
          // Re-enable scroll on cleanup
          document.body.style.overflow = "";
        };
      }, []);

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
        <Box h="100vh" bg="rgb(243, 244, 247)">
            <Flex>
                <Sidebar />
            
                {/* Content Section */}
                <Box
                    ml={{ base: "60px", md: "220px" }} // or pt={24} if using Chakra's spacing
                    mt="20px"
                    height="calc(100vh - 20px)"
                    overflowY="auto"
                >
                    <Box flex={1} px={{ base: 4, md: 8 }}>
                        <HomeContent user={user} photos={photos} setPhotos={setPhotos} />
                    </Box>
                </Box>
            </Flex>
        </Box>
    )
}