import React, { useState } from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import bgFeedback from "../assets/coffee-feedback-bg.png";

export default function Feedback() {
  const [formData, setFormData] = useState({
    recommendationRating: "",
    relevance: "",
    enrolled: "",
    courseQualityRating: "",
    suggestions: "",
    uiExperience: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Feedback submitted:", formData);
    setSubmitted(true);
  };

  // Coffee-themed styles
  const backgroundStyle = {
    backgroundImage: `url(${bgFeedback})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "100vh",
    paddingTop: "5rem",
    paddingBottom: "5rem",
    fontFamily: "Georgia, serif",
    color: "#4b3621",
  };

  const cardStyle = {
    backgroundColor: "#f8f1e7", // Creamy
    border: "none",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
    maxWidth: "700px",           // ✅ Reduced width
    margin: "0 auto",            // ✅ Centered horizontally
  };

  const labelStyle = {
    fontWeight: "bold",
    color: "#6f4e37", // Coffee brown
  };

  return (
    <div style={backgroundStyle}>
      <Container>
        <Card style={cardStyle}>
          <Card.Body>
            <h2 className="text-center mb-4" style={{ color: "#6f4e37" }}>
              📣 Feedback
            </h2>

            {submitted ? (
              <Alert variant="success" className="text-center fw-semibold">
                Thank you for your feedback, Jinnie! 💙
              </Alert>
            ) : (
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label style={labelStyle}>
                    1. How satisfied are you with the recommendations?
                  </Form.Label>
                  <Form.Select
                    name="recommendationRating"
                    value={formData.recommendationRating}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Select rating --</option>
                    <option value="5">⭐ 5 - Excellent</option>
                    <option value="4">⭐ 4 - Good</option>
                    <option value="3">⭐ 3 - Average</option>
                    <option value="2">⭐ 2 - Below Avg</option>
                    <option value="1">⭐ 1 - Poor</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label style={labelStyle}>
                    2. Was the recommended course relevant to your interests?
                  </Form.Label>
                  <Form.Check
                    type="radio"
                    label="Very relevant"
                    name="relevance"
                    value="very"
                    onChange={handleChange}
                    required
                  />
                  <Form.Check
                    type="radio"
                    label="Somewhat relevant"
                    name="relevance"
                    value="somewhat"
                    onChange={handleChange}
                  />
                  <Form.Check
                    type="radio"
                    label="Not relevant"
                    name="relevance"
                    value="not"
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label style={labelStyle}>
                    3. Did you enroll in any of the recommended courses?
                  </Form.Label>
                  <Form.Check
                    type="radio"
                    label="Yes"
                    name="enrolled"
                    value="yes"
                    onChange={handleChange}
                    required
                  />
                  <Form.Check
                    type="radio"
                    label="No"
                    name="enrolled"
                    value="no"
                    onChange={handleChange}
                  />
                </Form.Group>

                {formData.enrolled === "yes" && (
                  <Form.Group className="mb-3">
                    <Form.Label style={labelStyle}>
                      4. How would you rate the course you chose?
                    </Form.Label>
                    <Form.Select
                      name="courseQualityRating"
                      value={formData.courseQualityRating}
                      onChange={handleChange}
                      required
                    >
                      <option value="">-- Select rating --</option>
                      <option value="5">⭐ 5 - Excellent</option>
                      <option value="4">⭐ 4 - Good</option>
                      <option value="3">⭐ 3 - Average</option>
                      <option value="2">⭐ 2 - Below Avg</option>
                      <option value="1">⭐ 1 - Poor</option>
                    </Form.Select>
                  </Form.Group>
                )}

                <Form.Group className="mb-3">
                  <Form.Label style={labelStyle}>
                    5. What can we do to improve our recommendations?
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    name="suggestions"
                    rows={3}
                    placeholder="Your feedback means the world 💙"
                    value={formData.suggestions}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label style={labelStyle}>
                    6. How was your experience using Courspresso?
                  </Form.Label>
                  <Form.Select
                    name="uiExperience"
                    value={formData.uiExperience}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Choose one --</option>
                    <option value="awesome">Awesome</option>
                    <option value="good">Good</option>
                    <option value="okay">Okay</option>
                    <option value="meh">Needs improvement</option>
                  </Form.Select>
                </Form.Group>

                <div className="text-center">
                  <Button type="submit" variant="dark">
                    Submit Feedback 💌
                  </Button>
                </div>
              </Form>
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}