import React, { useEffect, useState, useRef } from "react";
import { Container, Card, Row, Col, Spinner, Alert, Button, Form } from "react-bootstrap";
import axios from "../utils/axiosConfig";
import defaultProfile from "../assets/DefaultProfile.png";
import { useNavigate } from "react-router-dom";

export default function UserDashboard() {
  const [profile, setProfile] = useState(null);
  const [savedCourses, setSavedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const fileInputRef = useRef(null);
  const [feedback, setFeedback] = useState("");
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [editing, setEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");
        if (!userId || !token) throw new Error("User ID or token missing");

        const headers = { Authorization: `Bearer ${token}` };

        const profileRes = await axios.get(`/profile/${userId}`, { headers });
        setProfile(profileRes.data);
        setEditedProfile(profileRes.data);

        const photoRes = await fetch("http://localhost:8080/users/profile-photo", { headers });
        if (photoRes.ok) {
          const blob = await photoRes.blob();
          setProfileImageUrl(URL.createObjectURL(blob));
        }

        const savedRes = await axios.get(`/saved-courses`, { headers });
        const saved = savedRes.data || [];

        // 👉 FIXED: No Authorization header used here for public /courses/{id}
        const courses = await Promise.all(
          saved.map(async (c) => {
            try {
              const res = await axios.get(`/courses/${c.courseId}`); // No headers
              return res.data;
            } catch (err) {
              if (err.response && err.response.status === 403) {
                console.warn("Access forbidden for course:", c.courseId);
              } else {
                console.error("Course not found:", c.courseId, err);
              }
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

  const handleSubmitFeedback = async () => {
    try {
      await axios.post("/feedback", {
        userId: localStorage.getItem("userId"),
        message: feedback,
      });
      setFeedbackMsg("Thanks for your feedback! 🚀");
      setFeedback("");
      setTimeout(() => setFeedbackMsg(""), 3000);
    } catch (error) {
      console.error("Failed to submit feedback:", error);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleChange = (e) => {
    setEditedProfile({
      ...editedProfile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const payload = {
        fullName: editedProfile.fullName,
        phoneNumber: editedProfile.phoneNumber,
        educationLevel: editedProfile.educationLevel,
        preferredPlatform: editedProfile.preferredPlatform,
        primaryInterests: typeof editedProfile.primaryInterests === "string"
          ? editedProfile.primaryInterests.split(",").map((s) => s.trim())
          : editedProfile.primaryInterests,
        learningGoals: editedProfile.learningGoals,
        preferredDifficultyLevel: editedProfile.preferredDifficultyLevel,
        hobbies: typeof editedProfile.hobbies === "string"
          ? editedProfile.hobbies.split(",").map((s) => s.trim())
          : editedProfile.hobbies,
      };

      await axios.put(`/profile/${userId}`, payload);
      alert("Profile updated successfully");
      setProfile(editedProfile);
      setEditing(false);
    } catch (err) {
      alert("Failed to update profile");
      console.error(err);
    }
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
  }

  return (
    <Container className="my-5">
      <h2 className="mb-4">👤 User Dashboard</h2>

      {feedbackMsg && <Alert variant="success">{feedbackMsg}</Alert>}

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
          <span
            className="text-primary d-block mb-2"
            style={{ cursor: "pointer", textDecoration: "underline" }}
            onClick={triggerFileInput}
          >
            Change Profile Photo
          </span>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          onChange={handlePhotoUpload}
          accept="image/png, image/jpeg"
          style={{ display: "none" }}
        />
      </div>

      <Row>
        <Col md={6}>
          <Card className="mb-4 shadow-sm">
            <Card.Header>📋 Profile Information</Card.Header>
            <Card.Body>
              {editing ? (
                <Form>
                  <Form.Group className="mb-2">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="fullName"
                      value={editedProfile.fullName || ""}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-2">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      type="text"
                      name="phoneNumber"
                      value={editedProfile.phoneNumber || ""}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-2">
                    <Form.Label>Education Level</Form.Label>
                    <Form.Select
                      name="educationLevel"
                      value={editedProfile.educationLevel || ""}
                      onChange={handleChange}
                    >
                      <option value="">-- Select --</option>
                      <option value="School">School</option>
                      <option value="Diploma">Diploma</option>
                      <option value="Undergraduate">Undergraduate</option>
                      <option value="Postgraduate">Postgraduate</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-2">
                    <Form.Label>Preferred Platform</Form.Label>
                    <Form.Select
                      name="preferredPlatform"
                      value={editedProfile.preferredPlatform || ""}
                      onChange={handleChange}
                    >
                      <option value="">-- Choose Platform --</option>
                      <option value="Coursera">Coursera</option>
                      <option value="Udemy">Udemy</option>
                      <option value="edX">edX</option>
                      <option value="Infosys Springboard">Infosys Springboard</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-2">
                    <Form.Label>Primary Interests</Form.Label>
                    <Form.Control
                      type="text"
                      name="primaryInterests"
                      value={editedProfile.primaryInterests || ""}
                      onChange={handleChange}
                      placeholder="e.g. AI, Web Development"
                    />
                  </Form.Group>

                  <Form.Group className="mb-2">
                    <Form.Label>Learning Goals</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      name="learningGoals"
                      value={editedProfile.learningGoals || ""}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-2">
                    <Form.Label>Preferred Difficulty Level</Form.Label>
                    <Form.Select
                      name="preferredDifficultyLevel"
                      value={editedProfile.preferredDifficultyLevel || ""}
                      onChange={handleChange}
                    >
                      <option value="">-- Choose --</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Hobbies</Form.Label>
                    <Form.Control
                      type="text"
                      name="hobbies"
                      value={editedProfile.hobbies || ""}
                      onChange={handleChange}
                      placeholder="e.g. Reading, Music, Gaming"
                    />
                  </Form.Group>

                  <Button variant="warning" onClick={handleSave}>Save</Button>
                </Form>
              ) : (
                <>
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
                  <Button variant="warning" onClick={handleEdit}>Update</Button>
                </>
              )}
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
