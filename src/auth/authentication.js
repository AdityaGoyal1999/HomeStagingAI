import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebase"
import { db } from "../firebase"
import { setDoc, doc } from "firebase/firestore"

const handleSignUp = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const newUser = userCredential.user;

        // create user profile in firestore
        await setDoc(doc(db, "users", newUser.uid), {
            email: newUser.email,
            name: newUser.displayName,
            photoURL: newUser.photoURL,
            createdAt: new Date(),
            updatedAt: new Date()
        })
        
        return newUser;
    }
    catch(error) {
        console.error('Error', error.message)
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