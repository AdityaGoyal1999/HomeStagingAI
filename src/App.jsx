import './App.css'

import React, { useEffect, useState } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { auth } from "./firebase"
import Login from "./page/Login"
import Home from "./page/Home"
import Page from "./page/page"
import LandingPage from "./page/LandingPage"
import Settings from "./components/Settings"
import HomeContent from "./components/HomeContent"
import Profile from "./components/Profile"
import PaymentSuccess from "./components/PaymentSuccess"
import PaymentCancelled from "./components/PaymentCancelled"

function App() {

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(u => {
      setUser(u);
      setLoading(false);
    })
    return unsubscribe;
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={user? <Home />: <Navigate to="/" />}>
          <Route index element={<HomeContent />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="/photo" element={user? <Page />: <Navigate to="/" />} />
        
        {/* Payment Result Routes */}
        <Route path="/payment-success" element={user? <PaymentSuccess />: <Navigate to="/" />} />
        <Route path="/payment-cancelled" element={user? <PaymentCancelled />: <Navigate to="/" />} />
        
      </Routes>
    </Router>
  )
}

export default App
