import React, { useEffect, useState } from "react";
import axios from "../utils/axiosConfig";
import { Card, Container, Row, Col, Spinner, Alert } from "react-bootstrap";

export default function UserDashboard() {
  const [profile, setProfile] = useState(null);
  const [savedCourses, setSavedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) throw new Error("User ID missing");

      const [profileRes, savedRes] = await Promise.all([
        axios.get("/student/dashboard"),
        axios.get(`/saved-courses/${userId}`),
      ]);

      setProfile(profileRes.data);
      setSavedCourses(savedRes.data);
    } catch (err) {
      setError("Failed to load user dashboard.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h2 className="mb-4">👤 User Dashboard</h2>

      <Row>
        <Col md={6}>
          <Card className="mb-4 shadow-sm">
            <Card.Header>📋 Profile Information</Card.Header>
            <Card.Body>
              <p><strong>Full Name:</strong> {profile?.fullName}</p>
              <p><strong>Email:</strong> {profile?.email}</p>
              <p><strong>Phone:</strong> {profile?.phoneNumber}</p>
              <p><strong>Education Level:</strong> {profile?.educationLevel}</p>
              <p><strong>Preferred Platform:</strong> {profile?.preferredPlatform}</p>
              <p><strong>Primary Interests:</strong> {profile?.primaryInterests?.join(", ")}</p>
              <p><strong>Learning Goals:</strong> {profile?.learningGoals}</p>
              <p><strong>Difficulty:</strong> {profile?.preferredDifficulty}</p>
              <p><strong>Hobbies:</strong> {profile?.hobbies}</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="mb-4 shadow-sm">
            <Card.Header>📚 Saved Courses</Card.Header>
            <Card.Body>
              {savedCourses.length === 0 ? (
                <p>No saved courses found.</p>
              ) : (
                savedCourses.map((c) => (
                  <Card key={c.id} className="mb-3">
                    <Card.Body>
                      <h5>{c.title}</h5>
                      <p>{c.description}</p>
                      <a href={c.url} className="btn btn-sm btn-outline-primary" target="_blank" rel="noreferrer">
                        Visit Course
                      </a>
                    </Card.Body>
                  </Card>
                ))
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

