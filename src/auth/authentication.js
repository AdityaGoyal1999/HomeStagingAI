import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebase"

const handleSignUp = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const newUser = userCredential.user;

        // Get the ID token to authenticate with our backend
        const token = await newUser.getIdToken();
        
        // Create user profile through our backend API
        const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/user/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                email: newUser.email,
                name: newUser.displayName || email.split('@')[0], // Fallback name
                photoURL: newUser.photoURL || null
            })
        });

        if (!response.ok) {
            throw new Error('Failed to create user profile');
        }

        console.log('✅ User profile created successfully with credits');
        
        return newUser;
    }
    catch(error) {
        console.error('Error during signup:', error.message)
        return false;
    }
}

const handleLogin = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } 
    catch (error) {
        console.error('Error:', error.message);
        return false;
    }
}

const handleLogout = async () => {
    await signOut(auth);
    return true;
}

export {
    handleSignUp,
    handleLogin,
    handleLogout
}