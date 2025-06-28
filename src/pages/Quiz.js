
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Card, Container, ProgressBar } from "react-bootstrap";
import axios from "../utils/axiosConfig"; // already includes JWT via interceptor

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

  const mapCourseLengthToEnum = (length) => {
    if (length === "short") return "ONE_TO_FOUR_WEEKS";
    if (length === "medium") return "FOUR_TO_EIGHT_WEEKS";
    return "EIGHT_PLUS_WEEKS";
  };

  const handleNext = () => {
    if (level < 3) {
      setLevel(level + 1);
    } else {
      // Save answers to localStorage for Recommendation.js to use
      localStorage.setItem("quizAnswers", JSON.stringify(answers));
      navigate("/recommendations");
    }
  };

  const progress = level * 33;

  return (
    <Container className="my-5">
      <Card className="shadow-sm">
        <Card.Body>
          <h2 className="text-center mb-3">🧠 Interest Quiz – Level {level}</h2>
          <ProgressBar now={progress} label={`${progress}%`} className="mb-4" />

          <Form>
            {level === 1 && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Which domain interests you the most?</Form.Label>
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
                  <Form.Label>What's your preferred learning style?</Form.Label>
                  <Form.Check type="radio" label="Hands-on Projects" name="learningStyle" value="project" onChange={handleChange} />
                  <Form.Check type="radio" label="Videos & Visuals" name="learningStyle" value="video" onChange={handleChange} />
                  <Form.Check type="radio" label="Reading & Theory" name="learningStyle" value="theory" onChange={handleChange} />
                </Form.Group>
              </>
            )}

            {level === 2 && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>What course duration works best for you?</Form.Label>
                  <Form.Select name="courseLength" value={answers.courseLength} onChange={handleChange} required>
                    <option value="">-- Select --</option>
                    <option value="short">2–4 weeks</option>
                    <option value="medium">4–8 weeks</option>
                    <option value="long">8+ weeks</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Preferred platform?</Form.Label>
                  <Form.Check type="radio" name="preferredPlatform" value="Coursera" label="Coursera" onChange={handleChange} />
                  <Form.Check type="radio" name="preferredPlatform" value="Udemy" label="Udemy" onChange={handleChange} />
                  <Form.Check type="radio" name="preferredPlatform" value="edX" label="edX" onChange={handleChange} />
                  <Form.Check type="radio" name="preferredPlatform" value="Infosys" label="Infosys Springboard" onChange={handleChange} />
                </Form.Group>
              </>
            )}

            {level === 3 && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>What is your skill level?</Form.Label>
                  <Form.Select name="difficulty" value={answers.difficulty} onChange={handleChange} required>
                    <option value="">-- Select --</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>What’s your goal?</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="goal"
                    placeholder="e.g., Get an internship, build a project, upskill for job"
                    value={answers.goal}
                    onChange={handleChange}
                  />
                </Form.Group>
              </>
            )}

            <div className="text-center">
              <Button variant="primary" onClick={handleNext}>
                {level < 3 ? "Next →" : "Get Recommendations"}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
