// src/pages/VerifyOtp.js
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";
import axios from "axios";
import bgOtp from "../assets/coffee-otp-bg.png";

export default function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;
  const purpose = location.state?.purpose || "VERIFICATION";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Handle OTP verification
  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8080/api/auth/verify-otp", {
        email,
        otp,
        purpose
      });

      if (purpose === "PASSWORD_RESET") {
        navigate("/reset-password", {
          state: {
            token: res.data.token,
            email,
          },
        });
      } else {
        alert("✅ OTP verified! Please log in.");
        navigate("/login");
      }

    } catch (err) {
      const msg = err.response?.data?.message || "Invalid OTP";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Handle Resend OTP
  const handleResendOtp = async () => {
    setError("");
    setMessage("");
    setResendTimer(30); // start 30s cooldown

    try {
      const res = await axios.post("http://localhost:8080/api/auth/request-otp", {
        email,
        purpose
      });

      setMessage(res.data?.message || "OTP resent. Please check your email.");

    } catch (err) {
      const msg = err.response?.data?.message || "Failed to resend OTP";

      // Handle special backend responses
      if (msg.toLowerCase().includes("cooldown")) {
        const waitTime = msg.match(/\d+/g)?.[0] || 30;
        setResendTimer(parseInt(waitTime));
      }

      setError(msg);
    }
  };

  // Styling
  const backgroundStyle = {
    backgroundImage: `url(${bgOtp})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "100vh",
    paddingTop: "80px",
    paddingBottom: "80px",
  };

  const cardStyle = {
    backgroundColor: "#fdf6ee",
    border: "1px solid #d3bfa3",
    borderRadius: "12px",
    color: "#4b3621",
    fontFamily: "Georgia, serif",
  };

  const headingStyle = {
    color: "#6f4e37",
  };

  return (
    <div style={backgroundStyle}>
      <Container>
        <Card className="p-4 shadow-sm mx-auto" style={{ maxWidth: "500px", ...cardStyle }}>
          <h3 className="text-center mb-4" style={headingStyle}>🔑 Verify OTP</h3>

          {error && <Alert variant="danger">{error}</Alert>}
          {message && <Alert variant="success">{message}</Alert>}

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

            <Button variant="dark" type="submit" className="w-100 mb-2" disabled={loading}>
              {loading ? "Verifying..." : "Verify & Continue"}
            </Button>
          </Form>

          <div className="text-center mt-2">
            {resendTimer > 0 ? (
              <span className="text-muted">⏳ Resend available in {resendTimer}s</span>
            ) : (
              <Button variant="link" onClick={handleResendOtp}>
                🔁 Resend OTP
              </Button>
            )}
          </div>
        </Card>
      </Container>
    </div>
  );
}
