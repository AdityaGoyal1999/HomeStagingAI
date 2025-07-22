import { handleLogout } from "../auth/authentication";
import { useState, useEffect } from "react";
import axios from "axios"
import { auth } from "../firebase"

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
            <h2>You are logged in</h2>
            <p>User: {user.email}</p>
            <button onClick={handleLogout}>Sign Out</button>
            <h3>Photos</h3>
            <div>
                {photos.map((photo) => (
                    <img src={photo.photoURL} alt="Photo" />
                ))}
            </div>
        </>
    )
}