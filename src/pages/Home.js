import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axiosConfig";

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
    fetchQuizzes();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get("http://localhost:8080/courses?page=0&size=20");
      const data = Array.isArray(res.data)
        ? res.data
        : res.data.content || [];

      setCourses(data);
    } catch (err) {
      console.error("Failed to load courses:", err);
      setError("Unable to fetch courses.");
    }
  };

  const fetchQuizzes = async () => {
    try {
      const res = await axios.get("/api/quiz");
      setQuizzes(Array.isArray(res.data) ? res.data : res.data.content || []);
    } catch (err) {
      console.error("Failed to load quizzes:", err);
    }
  };

  const handleSearch = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/courses/search?q=${searchQuery}`);
      const data = Array.isArray(res.data)
        ? res.data
        : res.data.content || [];

      setCourses(data);
    } catch (err) {
      setError("Search failed. Try again.");
    }
  };

  const saveCourse = async (courseId) => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) return alert("Please login to save courses");

      await axios.post(`/saved-courses?userId=${userId}&courseId=${courseId}`);
      alert("Course saved successfully!");
    } catch (err) {
      alert("Failed to save course");
      console.error(err);
    }
  };

  const backgroundStyle = {
    backgroundColor: "#f6f1e7",
    minHeight: "100vh",
    paddingTop: "2rem",
    fontFamily: "Georgia, serif",
    color: "#4b3621"
  };

  const cardStyle = {
    backgroundColor: "#fffaf3",
    border: "1px solid #e0d7c6",
    borderRadius: "12px"
  };

  const headerStyle = {
    color: "#6f4e37"
  };

  return (
    <div style={backgroundStyle}>
      <div className="container">
      <h2 style={{ ...headerStyle, textAlign: "center" }}>
  Brew your perfect course — <em>Your daily dose of curated learning</em> ☕
</h2>

        {error && <p className="text-danger">{error}</p>}

        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="btn btn-outline-dark" onClick={handleSearch}>
            Search
          </button>
        </div>

        {/* Full-width Quiz Button */}
        <div className="my-4 text-center">
  <button
    onClick={() => navigate("/quiz")}
    style={{
      width: "100%",
      backgroundColor: "#6f4e37", // Coffee brown
      color: "#fffaf3",            // Creamy white
      border: "none",
      padding: "0.75rem 1rem",
      fontSize: "1.1rem",
      borderRadius: "8px",
      fontWeight: "bold",
      fontFamily: "Georgia, serif",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
      transition: "background-color 0.3s ease",
    }}
    onMouseOver={(e) => (e.target.style.backgroundColor = "#5b3d2e")}
    onMouseOut={(e) => (e.target.style.backgroundColor = "#6f4e37")}
  >
    Take a Quiz 📚
  </button>
</div>


        <h4 className="mt-4" style={headerStyle}>Courses</h4>
        <div className="row">
          {courses.length === 0 ? (
            <p>No courses found.</p>
          ) : (
            courses.map((c) => (
              <div key={c.id} className="col-md-4">
                <div className="card mb-4 shadow-sm" style={cardStyle}>
                  <img src={c.imageUrl} className="card-img-top" alt={c.title} />
                  <div className="card-body">
                    <h5 className="card-title">{c.title}</h5>
                    <p className="card-text">{c.description}</p>
                    <div className="d-flex justify-content-between">
                      <a
                        href={c.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-dark"
                      >
                        Visit Course
                      </a>
                      <button className="btn btn-outline-success" onClick={() => saveCourse(c.id)}>
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}