import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";
import axios from "../utils/axiosConfig";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("/api/auth/signin", {
        loginId: email,
        password,
      });

      const { token, role, email: userEmail, userId } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("userId", userId);
      localStorage.setItem("email", userEmail);

      login({ email: userEmail }, role);

      if (role.toUpperCase() === "ADMIN") {
        navigate("/admin");
      } else {
        try {
          const profileRes = await axios.get("/student/dashboard");
          if (profileRes?.data?.fullName) {
            navigate("/user-dashboard");
          } else {
            navigate("/register");
          }
        } catch (err) {
          if (err.response?.status === 403) {
            navigate("/register");
          } else {
            throw err;
          }
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      const msg = err.response?.data?.message || "Invalid credentials";

      if (msg.toLowerCase().includes("not verified")) {
        alert("🔁 Email not verified. Sending OTP again...");

        try {
          await axios.post("/api/auth/request-otp", {
            email,
            purpose: "VERIFICATION"
          });

          navigate("/verify-otp", { state: { email } });
        } catch (otpErr) {
          console.error("Failed to resend OTP:", otpErr);
          setError("Failed to resend OTP. Please try again.");
        }

      } else {
        setError(msg);
      }
    }
  };

  return (
    <Container className="my-5">
      <Card className="p-4 shadow-sm mx-auto" style={{ maxWidth: "500px" }}>
        <h3 className="text-center mb-4">🔐 Login</h3>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Login as</Form.Label>
            <Form.Select
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="user">User</option>
              <option value="admin">Administrator</option>
            </Form.Select>
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100">
            Login
          </Button>

          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <p>Don't have an account? <a href="/signup">Sign up here</a></p>
          </div>
        </Form>
      </Card>
    </Container>
  );
}
