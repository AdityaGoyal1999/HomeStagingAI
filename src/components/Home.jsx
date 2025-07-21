import { handleLogout } from "../auth/authentication";

export default function Home() {
    return (
        <>
            <h2>You are logged in</h2>
            <button onClick={handleLogout}>Sign Out</button>
        </>
    )
}