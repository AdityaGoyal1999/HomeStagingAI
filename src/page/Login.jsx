import React, { useState } from "react"
import { auth } from "../firebase"
import { handleLogin, handleSignUp } from "../auth/authentication"
import { useNavigate } from "react-router-dom"
import { Button, HStack, Box, Input } from "@chakra-ui/react"

export default function Login() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [signIn, setSignIn] = useState(false);
    const navigate = useNavigate()

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
            bg="gray.100"
            boxShadow="lg"
            borderRadius="lg"
            p={8}
            maxW="sm"
            mx="auto"
            mt={24}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
        >
            {
                signIn?
                    <h2>Sign In</h2> :
                    <h2>Sign Up</h2>
            }
            <p style={{ color: "red" }}>{error}</p>
            <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                bg="white"
                width="100%"
                mb={3}
            />
            <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                bg="white"
                width="100%"
                mb={3}
            />
            {
                signIn?
                    <Button colorScheme="blue" width="100%" mt={2} onClick={manageLogin}>Sign In</Button> :
                    <Button colorScheme="blue" width="100%" mt={2} onClick={manageSignUp}>Sign Up</Button>
            }
            <br />
            <Button variant="outline" colorScheme="blue" width="100%" mt={2} onClick={() => setSignIn(prev => !prev)}>
                Switch to {signIn ? "Sign Up" : "Sign In"}
            </Button>
        </Box>
    )
}