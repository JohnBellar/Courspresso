import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Card, Button, Spinner } from "react-bootstrap";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axiosConfig";
import { saveCourse } from "../utils/courseStorage";
import "./Recommendations.css";

export default function Recommendations() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [platformFilter, setPlatformFilter] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const quizData = JSON.parse(localStorage.getItem("quizAnswers"));
        if (!quizData) {
          alert("No quiz answers found. Please take the quiz.");
          navigate("/quiz");
          return;
        }

        const payload = {
           tags: [quizData.interest],
           platforms: [quizData.preferredPlatform],
           difficulty: quizData.difficulty.toUpperCase(),
           duration: mapCourseLengthToEnum(quizData.courseLength),
      };

const response = await axios.post("/courses/filter", payload); 
setCourses(response.data);

      } catch (err) {
        console.error("Failed to fetch courses:", err);
        alert("Failed to load course recommendations.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [navigate]);

  const mapCourseLengthToEnum = (length) => {
    if (length === "short") return "ONE_TO_FOUR_WEEKS";
    if (length === "medium") return "FOUR_TO_EIGHT_WEEKS";
    return "EIGHT_PLUS_WEEKS";
  };

  const filteredCourses = courses.filter(course => {
    const platformMatch = platformFilter ? course.platform === platformFilter : true;
    const difficultyMatch = difficultyFilter ? course.difficulty === difficultyFilter : true;
    return platformMatch && difficultyMatch;
  });

  const downloadCourses = (courses) => {
    const header = "Title,Platform,Duration,Difficulty,Tags\n";
    const content = courses.map(course =>
      `"${course.title}","${course.platform}","${course.duration}","${course.difficulty}","${course.tags.join(" | ")}"`
    ).join("\n");

    const blob = new Blob([header + content], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "recommended_courses.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p>Loading recommendations...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-5 recommendations">
      <h2 className="text-center mb-4">🎯 Recommended Courses</h2>

      <Row className="mb-4">
        <Col md={6}>
          <Form.Select value={platformFilter} onChange={(e) => setPlatformFilter(e.target.value)}>
            <option value="">Filter by Platform</option>
            <option value="Coursera">Coursera</option>
            <option value="Udemy">Udemy</option>
            <option value="edX">edX</option>
            <option value="Infosys Springboard">Infosys Springboard</option>
          </Form.Select>
        </Col>
        <Col md={6}>
          <Form.Select value={difficultyFilter} onChange={(e) => setDifficultyFilter(e.target.value)}>
            <option value="">Filter by Difficulty</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </Form.Select>
        </Col>
      </Row>

      <Row>
        {filteredCourses.map((course, index) => (
          <Col md={6} lg={4} key={index} className="mb-4">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
              <Card className="course-card h-100">
                <Card.Body>
                  <Card.Title>{course.title}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {course.platform} • {course.duration}
                  </Card.Subtitle>
                  <Card.Text>
                    <strong>Difficulty:</strong> {course.difficulty}
                    <br />
                    <strong>Tags:</strong> {course.tags.join(", ")}
                  </Card.Text>
                  <div className="d-flex justify-content-between">
                    <Button variant="success" href={course.link} target="_blank">
                      Enroll Now
                    </Button>
                    <Button variant="outline-secondary" onClick={() => {
                      saveCourse(course);
                      alert("💾 Saved to your profile!");
                    }}>
                      💾 Save for Later
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>

      {filteredCourses.length > 0 && (
        <div className="text-center mt-5 d-flex flex-wrap justify-content-center gap-3">
          <Button variant="outline-primary" size="lg" onClick={() => navigate("/feedback")}>
            💬 Give Feedback
          </Button>
          <Button variant="warning" size="lg" onClick={() => navigate("/quiz")}>
            🔁 Retake Quiz
          </Button>
          <Button variant="info" size="lg" onClick={() => downloadCourses(filteredCourses)}>
            📄 Download Recommendations
          </Button>
        </div>
      )}
    </Container>
  );
}
