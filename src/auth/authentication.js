import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebase"

const handleSignUp = async (email, password) => {
    try {
        console.log(email, password)
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        return userCredential.user;
    }
    catch(error) {
        console.error('Error', error.message)
        return false;
    }
}

const handleLogin = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        // console.log('Logged in:', userCredential.user);
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