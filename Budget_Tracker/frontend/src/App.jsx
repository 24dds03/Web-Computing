import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // State variables (variables jo change ho sakte hain)
  const [user, setUser] = useState(null);          // Current logged in user
  const [showRegister, setShowRegister] = useState(false);  // Register form dikhaye ya login form
  const [loading, setLoading] = useState(true);    // Loading screen ke liye

  // Component load hone pe ek baar chalega
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Check kare ki user pehle se logged in hai kya
  const checkAuthStatus = async () => {
    try {
      // Server se puchenge ki user logged in hai ya nahi
      const response = await fetch('http://localhost:5000/api/auth/check', {
        credentials: 'include'  // Cookies bhejne ke liye (session ke liye important)
      });
      
      // Agar response acha aaya toh user ko set kare
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      // Loading khatam kare, chahe success ho ya fail
      setLoading(false);
    }
  };

  // User login hone pe chalega
  const handleLogin = (userData) => {
    setUser(userData);  // User ko set kare
  };

  // User logout hone pe chalega
  const handleLogout = async () => {
    try {
      // Server ko logout ka message bheje
      await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        credentials: 'include'  // Cookies bhejne ke liye
      });
      setUser(null);  // User ko null kar de (logout)
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Agar abhi loading chal raha hai toh loading screen dikhaye
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // Main app return kare
  return (
    <div className="App">
      {/* Agar user nahi hai (not logged in) */}
      {!user ? (
        <div className="auth-container">
          {/* Agar register form dikhana hai */}
          {showRegister ? (
            <Register 
              onRegister={() => setShowRegister(false)}  // Register success pe login pe switch kare
              onSwitchToLogin={() => setShowRegister(false)}  // Login pe switch kare
            />
          ) : (
            /* Agar login form dikhana hai */
            <Login 
              onLogin={handleLogin}  // Login success pe handleLogin chalega
              onSwitchToRegister={() => setShowRegister(true)}  // Register pe switch kare
            />
          )}
        </div>
      ) : (
        /* Agar user hai (logged in) toh dashboard dikhaye */
        <Dashboard user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;