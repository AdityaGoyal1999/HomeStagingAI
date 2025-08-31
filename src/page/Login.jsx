import React, { useState, useEffect } from "react"
import { auth } from "../firebase"
import { handleLogin, handleSignUp } from "../auth/authentication"
import { useNavigate } from "react-router-dom"
import { Button, HStack, Box, Input } from "@chakra-ui/react"
import logo from "../assets/logo.png"

export default function Login() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [signIn, setSignIn] = useState(false);
    const navigate = useNavigate()

    // Disable scrolling when component mounts
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        
        // Re-enable scrolling when component unmounts
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const manageLogin = async () => {
        // e.preventDefault()
        setError("")
        if (email && password) {
            const user = await handleLogin(email, password)
            if (user) {
                console.log(user)
                navigate("/home")
            } else {
                setError("Invalid email or password")
            }
        } else {
            setError("Please enter an email and password")
        }
    }

    const manageSignUp = async () => {
        // e.preventDefault()
        setError("")
        if (email && password) {
            const user = await handleSignUp(email, password)
            if (user) {
                console.log(user)
                navigate("/home")
            } else {
                setError("Invalid email or password")
            }
        } else {
            setError("Please enter an email and password")
        }
    }

    return (
        <Box
            display="grid"
            gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }}
            width="100vw"
            height="100vh"
            overflow="hidden"
        >
            {/* Image Section */}
            <Box
                bgImage="url('/src/assets/staged-living-room.jpg')"
                bgSize="cover"
                bgPosition="center"
                bgRepeat="no-repeat"
                position="relative"
                minHeight={{ base: "50vh", md: "100vh" }}
            >
                {/* Optional overlay for better text readability */}
                <Box
                    position="absolute"
                    top="0"
                    left="0"
                    right="0"
                    bottom="0"
                    bg="blackAlpha.400"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Box textAlign="center" color="white" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                        <img src={logo}
                         alt="StageAI Logo" className="h-16 w-16 md:h-20 md:w-20 lg:h-24 lg:w-24"
                         style={{
                            objectFit: 'cover',
                            objectPosition: 'center',
                            transform: 'scale(5)' 
                         }}
                        />
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                            Home Staging AI
                        </h1>
                        <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>
                            Transform your space with AI-powered home staging
                        </p>
                    </Box>
                </Box>
            </Box>

            {/* Login Form Section */}
            <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                bg="gray.50"
                p={8}
                minHeight={{ base: "50vh", md: "100vh" }}
            >
                <Box
                    bg="white"
                    boxShadow="lg"
                    borderRadius="lg"
                    p={8}
                    maxW="sm"
                    width="100%"
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                >
                    {
                        signIn?
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Sign In</h2> :
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Sign Up</h2>
                    }
                    <p style={{ color: "red", marginBottom: '1rem' }}>{error}</p>
                    <Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        bg="white"
                        width="100%"
                        mb={3}
                        size="lg"
                    />
                    <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        bg="white"
                        width="100%"
                        mb={3}
                        size="lg"
                    />
                    {
                        signIn?
                            <Button colorScheme="blue" width="100%" mt={2} size="lg" onClick={manageLogin}>Sign In</Button> :
                            <Button colorScheme="blue" width="100%" mt={2} size="lg" onClick={manageSignUp}>Sign Up</Button>
                    }
                    <br />
                    <Button variant="outline" colorScheme="blue" width="100%" mt={2} size="lg" onClick={() => setSignIn(prev => !prev)}>
                        Switch to {signIn ? "Sign Up" : "Sign In"}
                    </Button>
                </Box>
            </Box>
        </Box>
    )
}