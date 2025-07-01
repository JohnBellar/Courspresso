import React, { useEffect, useState, useRef } from "react";
import { Container, Card, Row, Col, Spinner, Alert } from "react-bootstrap";
import axios from "../utils/axiosConfig"; 
import defaultProfile from "../assets/DefaultProfile.png"; 

export default function UserDashboard() {
  const [profile, setProfile] = useState(null);
  const [savedCourses, setSavedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");
        if (!userId || !token) throw new Error("User ID or token missing");

        const headers = { Authorization: `Bearer ${token}` };

        // Get profile
        const profileRes = await axios.get(`/profile/${userId}`, { headers });
        setProfile(profileRes.data);

        // Get photo
        const photoRes = await fetch("http://localhost:8080/users/profile-photo", { headers });
        if (photoRes.ok) {
          const blob = await photoRes.blob();
          setProfileImageUrl(URL.createObjectURL(blob));
        } else {
          setProfileImageUrl(null); // fallback to default
        }

        // Get saved courses
        const savedRes = await axios.get(`/saved-courses`, { headers });
        const saved = savedRes.data || [];

        const courses = await Promise.all(
          saved.map(async (c) => {
            try {
              const res = await axios.get(`/courses/${c.courseId}`, { headers });
              return res.data;
            } catch {
              return null;
            }
          })
        );

        setSavedCourses(courses.filter(Boolean));
      } catch (err) {
        const msg = err?.response?.data || "Failed to load user dashboard.";
        setError(typeof msg === "string" ? msg : "Something went wrong");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.put("/users/profile-photo", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const photoRes = await fetch("http://localhost:8080/users/profile-photo", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const blob = await photoRes.blob();
      setProfileImageUrl(URL.createObjectURL(blob));
      alert("Photo uploaded successfully!");
    } catch (err) {
      alert("Failed to upload photo.");
      console.error(err);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  } const img = "assets/DefaultProfile.png";

  return (
   
    <Container className="my-5">
      <h2 className="mb-4">👤 User Dashboard</h2>

      {/* 👤 Profile Image Section */}
      <div className="text-center mb-4">
        <div
          style={{
            backgroundImage: `url(${profileImageUrl || defaultProfile})`,
            width: "180px",
            height: "180px",
            borderRadius: "50%",
            backgroundSize: "cover",
            backgroundPosition: "center",
            border: "4px solid #6c757d",
            margin: "0 auto",
            boxShadow: "0 0 6px rgba(0,0,0,0.2)",
          }}
        ></div>

        <div className="mt-2">
          {profileImageUrl ? (
            <span
              className="text-primary d-block mb-2"
              style={{ cursor: "pointer", textDecoration: "underline" }}
              onClick={triggerFileInput}
            >
              Change Profile Photo
            </span>
          ) : (
            <>
              <label className="mb-2 d-block">Upload Profile Photo</label>
              <input
                type="file"
                onChange={handlePhotoUpload}
                accept="image/png, image/jpeg"
                className="form-control-file"
                style={{ maxWidth: 300, margin: "0 auto" }}
              />
            </>
          )}
        </div>

        {/* Hidden input for triggering file dialog */}
        <input
          ref={fileInputRef}
          type="file"
          onChange={handlePhotoUpload}
          accept="image/png, image/jpeg"
          style={{ display: "none" }}
        />
      </div>

      {/* 🧾 Profile Info & Saved Courses */}
      <Row>
        <Col md={6}>
          <Card className="mb-4 shadow-sm">
            <Card.Header>📋 Profile Information</Card.Header>
            <Card.Body>
              <p><strong>Full Name:</strong> {profile?.fullName}</p>
              <p><strong>Username:</strong> {profile?.username}</p>
              <p><strong>Email:</strong> {profile?.email}</p>
              <p><strong>Phone:</strong> {profile?.phoneNumber}</p>
              <p><strong>Education Level:</strong> {profile?.educationLevel}</p>
              <p><strong>Preferred Platform:</strong> {profile?.preferredPlatform}</p>
              <p><strong>Primary Interests:</strong> {profile?.primaryInterests?.join(", ")}</p>
              <p><strong>Learning Goals:</strong> {profile?.learningGoals}</p>
              <p><strong>Difficulty:</strong> {profile?.preferredDifficultyLevel}</p>
              <p><strong>Hobbies:</strong> {profile?.hobbies?.join(", ")}</p>
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
                      <a
                        href={c.url}
                        className="btn btn-sm btn-outline-primary"
                        target="_blank"
                        rel="noreferrer"
                      >
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
