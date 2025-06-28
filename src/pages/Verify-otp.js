// src/pages/VerifyOtp.js
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const email = location.state?.email;

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
  
    try {
      const res = await axios.post("http://localhost:8080/api/auth/verify-otp", {
        email: location.state?.email,
        otp,
        purpose: "VERIFICATION",
      });
  
      // Show a success alert and redirect to login
      alert("✅ OTP verified! Please log in.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Container className="my-5">
      <Card className="p-4 shadow-sm mx-auto" style={{ maxWidth: "500px" }}>
        <h3 className="text-center mb-4">🔑 Verify OTP</h3>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleVerify}>
          <Form.Group className="mb-3">
            <Form.Label>Enter OTP</Form.Label>
            <Form.Control
              type="text"
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100" disabled={loading}>
            {loading ? "Verifying..." : "Verify & Continue"}
          </Button>
        </Form>
      </Card>
    </Container>
  );
}
