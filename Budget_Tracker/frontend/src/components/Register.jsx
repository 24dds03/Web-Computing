import React, { useState } from 'react';

const Register = ({ onRegister, onSwitchToLogin }) => {
  // Form data ko store karne ke liye state
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');      // Error messages ke liye
  const [loading, setLoading] = useState(false);  // Loading state ke liye

  // Input fields mein change hone pe chalega
  const handleChange = (e) => {
    setFormData({
      ...formData,  // Purani values rakh de
      [e.target.name]: e.target.value  // Nayi value update kare
    });
  };

  // Form submit hone pe chalega
  const handleSubmit = async (e) => {
    e.preventDefault();  // Page reload hone se bachaye
    setLoading(true);    // Loading start kare
    setError('');        // Purani errors clear kare

    // Check kare ki dono passwords match karte hain kya
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // Server ko register request bheje
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',  // JSON data bhej rahe hain
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        })
      });

      // Server se response le
      const data = await response.json();

      // Agar response acha hai (200-299)
      if (response.ok) {
        onRegister();  // Parent component ko bataye registration successful
      } else {
        // Agar error hai toh error message dikhaye
        setError(data.message || 'Registration failed');
      }
    } catch (error) {
      // Network error ya koi aur problem
      setError('Network error. Please try again.');
    } finally {
      // Success ya fail dono mein loading stop kare
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Create Account</h2>
      
      {/* Agar error hai toh error message dikhaye */}
      {error && (
        <div style={{ 
          color: 'red', 
          marginBottom: '1rem', 
          textAlign: 'center' 
        }}>
          {error}
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleSubmit}>
        {/* Username Input */}
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        {/* Email Input */}
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Password Input */}
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="6"  // Minimum 6 characters
          />
        </div>

        {/* Confirm Password Input */}
        <div className="form-group">
          <label>Confirm Password:</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            minLength="6"
          />
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          className="btn" 
          disabled={loading}  // Loading time pe button disable
        >
          {loading ? 'Creating Account...' : 'Register'}
        </button>
      </form>

      {/* Login page pe switch karne ka option */}
      <p className="switch-text">
        Already have an account?{' '}
        <span 
          className="switch-link" 
          onClick={onSwitchToLogin}  // Click pe login page pe jaye
        >
          Login here
        </span>
      </p>
    </div>
  );
};

export default Register;