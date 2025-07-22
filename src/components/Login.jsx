import React, { useState } from "react"
import { auth } from "../firebase"
import { handleLogin, handleSignUp } from "../auth/authentication"
import { useNavigate } from "react-router-dom"

export default function Login() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [signIn, setSignIn] = useState(false);
    // const navigate = useNavigate()

    const manageLogin = async () => {
        // e.preventDefault()
        setError("")
        if (email && password) {
            const user = await handleLogin(email, password)
            if (user) {
                console.log(user)
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
            } else {
                setError("Invalid email or password")
            }
        } else {
            setError("Please enter an email and password")
        }
    }

    return (
        <div>
            {
                signIn?
                    <h2>Sign In</h2> :
                    <h2>Sign Up</h2>
            }
            <p style={{ color: "red" }}>{error}</p>
            <input 
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
            />
            <br />
            <input 
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
            />
            <br />
            {
                signIn?
                    <button onClick={manageLogin}>Sign In</button> :
                    <button onClick={manageSignUp}>Sign Up</button>
            }
            <br />
            <button onClick={() => setSignIn(prev => !prev)}>Switch to {signIn ? "Sign Up" : "Sign In"}</button>
        </div>
    )
}