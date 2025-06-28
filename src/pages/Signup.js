// src/pages/Signup.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";
import axios from "axios";

export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:8080/api/auth/signup", {
        email,
        username,
        password,
        role: "user",          // or "admin"
        authProvider: "local"  // if required
      });
      
      navigate("/verify-otp", { state: { email } }); // or userId, depends on backend
      

      navigate("/verify-otp", { state: { email } });
    } catch (err) {
      console.error("Signup error:", err.response?.data); // 🔍 Add this line to see backend error
      setError(err.response?.data?.message || "Signup failed");
    }
    
  };

  return (
    <Container className="my-5">
      <Card className="p-4 shadow-sm mx-auto" style={{ maxWidth: "500px" }}>
        <h3 className="text-center mb-4">📨 Signup</h3>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSignup}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Choose a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="success" type="submit" className="w-100">
            Signup & Get OTP
          </Button>
        </Form>
      </Card>
    </Container>
  );
}
