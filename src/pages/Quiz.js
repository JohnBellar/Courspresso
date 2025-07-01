import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Card, Container, ProgressBar } from "react-bootstrap";
import bgImage from "../assets/coffee-quiz-bg.png";
import axios from "../utils/axiosConfig";

export default function Quiz() {
  const navigate = useNavigate();
  const [level, setLevel] = useState(1);
  const [answers, setAnswers] = useState({
    interest: "",
    learningStyle: "",
    courseLength: "",
    preferredPlatform: "",
    difficulty: "",
    goal: "",
  });

  const handleChange = (e) => {
    setAnswers({ ...answers, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (level < 3) {
      setLevel(level + 1);
    } else {
      localStorage.setItem("quizAnswers", JSON.stringify(answers));
      navigate("/recommendations");
    }
  };

  const progress = level * 33;

  const isCurrentLevelValid = () => {
    if (level === 1) return answers.interest && answers.learningStyle;
    if (level === 2) return answers.courseLength && answers.preferredPlatform;
    if (level === 3) return answers.difficulty && answers.goal.trim().length > 0;
    return false;
  };

  // Styling
  const backgroundStyle = {
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: "2rem 4vw",
    fontFamily: "Georgia, serif",
    color: "#4b3621",
  };

  const cardStyle = {
    backgroundColor: "#f8f1e7",
    border: "none",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.25)",
    width: "100%",
    maxWidth: "500px",
    padding: "1.5rem 2rem",
    maxHeight: "90vh",
    overflowY: "auto",
  };

  const labelStyle = {
    fontWeight: "bold",
    color: "#6f4e37",
  };

  const progressBarStyle = {
    height: "10px",
    backgroundColor: "#d3b8a3", // light mocha background
  };

  const progressVariant = "#6f4e37"; // rich coffee color

  return (
    <div style={backgroundStyle}>
      <Card style={cardStyle}>
        <Card.Body>
          <h2 className="text-center mb-3" style={{ color: "#6f4e37" }}>
            🧠 Interest Quiz – Level {level}
          </h2>

          <ProgressBar
            now={progress}
            label=""
            className="mb-4"
            style={progressBarStyle}
            variant="custom"
            striped
            animated
          >
            <div
              style={{
                width: `${progress}%`,
                backgroundColor: progressVariant,
                height: "100%",
                borderRadius: "10px",
              }}
            ></div>
          </ProgressBar>

          <Form>
            {level === 1 && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label style={labelStyle}>Which domain interests you the most?</Form.Label>
                  <Form.Select name="interest" value={answers.interest} onChange={handleChange} required>
                    <option value="">-- Select --</option>
                    <option value="AI">AI / Machine Learning</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="UIUX">UI/UX Design</option>
                    <option value="Web">Web Development</option>
                    <option value="Cloud">Cloud & DevOps</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label style={labelStyle}>What's your preferred learning style?</Form.Label>
                  <Form.Check type="radio" label="Hands-on Projects" name="learningStyle" value="project" onChange={handleChange} required />
                  <Form.Check type="radio" label="Videos & Visuals" name="learningStyle" value="video" onChange={handleChange} required />
                  <Form.Check type="radio" label="Reading & Theory" name="learningStyle" value="theory" onChange={handleChange} required />
                </Form.Group>
              </>
            )}

            {level === 2 && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label style={labelStyle}>What course duration works best for you?</Form.Label>
                  <Form.Select name="courseLength" value={answers.courseLength} onChange={handleChange} required>
                    <option value="">-- Select --</option>
                    <option value="short">2–4 weeks</option>
                    <option value="medium">4–8 weeks</option>
                    <option value="long">8+ weeks</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label style={labelStyle}>Preferred platform?</Form.Label>
                  <Form.Check type="radio" name="preferredPlatform" value="Coursera" label="Coursera" onChange={handleChange} required />
                  <Form.Check type="radio" name="preferredPlatform" value="Udemy" label="Udemy" onChange={handleChange} required />
                  <Form.Check type="radio" name="preferredPlatform" value="edX" label="edX" onChange={handleChange} required />
                  <Form.Check type="radio" name="preferredPlatform" value="Infosys" label="Infosys Springboard" onChange={handleChange} required />
                </Form.Group>
              </>
            )}

            {level === 3 && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label style={labelStyle}>What is your skill level?</Form.Label>
                  <Form.Select name="difficulty" value={answers.difficulty} onChange={handleChange} required>
                    <option value="">-- Select --</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label style={labelStyle}>What’s your goal?</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="goal"
                    placeholder="e.g., Get an internship, build a project, upskill for job"
                    value={answers.goal}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </>
            )}

            <div className="text-center mt-3">
              <Button
                variant="dark"
                onClick={handleNext}
                disabled={!isCurrentLevelValid()}
                style={{
                  backgroundColor: "#6f4e37",
                  border: "none",
                  width: "100%",
                }}
              >
                {level < 3 ? "Next →" : "Get Recommendations"}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}