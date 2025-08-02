import './App.css'

import React, { useEffect, useState } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { auth } from "./firebase"
import Login from "./page/Login"
import Home from "./page/Home"

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
        <Route path="/" element={user? <Navigate to="/home"/> : <Login />} />
        <Route path="/home" element={user? <Home />: <Navigate to="/" />} />
        <Route />
      </Routes>
    </Router>
  )
}

export default App
