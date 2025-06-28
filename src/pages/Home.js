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
      const res = await axios.get("/admin/courses?page=0&size=10");
      setCourses(Array.isArray(res.data) ? res.data : res.data.content || []);
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
      const res = await axios.get(`/courses/search?q=${searchQuery}`);
      setCourses(Array.isArray(res.data) ? res.data : res.data.content || []);
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

  return (
    <div className="container">
      <h2>Welcome to the MOOC Recommender</h2>
      {error && <p className="text-danger">{error}</p>}

      <div className="input-group mb-3">
        <input type="text" className="form-control" placeholder="Search courses..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        <button className="btn btn-outline-secondary" onClick={handleSearch}>Search</button>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-4">
        <h4>Quizzes</h4>
        <button className="btn btn-primary" onClick={() => navigate("/quiz")}>Take a Quiz</button>
      </div>
      <ul>
        {quizzes.map((q) => (
          <li key={q.id}>{q.name}</li>
        ))}
      </ul>

      <h4 className="mt-4">Courses</h4>
      <div className="row">
        {courses.length === 0 ? (
          <p>No courses found.</p>
        ) : (
          courses.map((c) => (
            <div key={c.id} className="col-md-4">
              <div className="card mb-4 shadow-sm">
                <img src={c.imageUrl} className="card-img-top" alt={c.title} />
                <div className="card-body">
                  <h5 className="card-title">{c.title}</h5>
                  <p className="card-text">{c.description}</p>
                  <div className="d-flex justify-content-between">
                    <a href={c.url} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary">Visit Course</a>
                    <button className="btn btn-outline-success" onClick={() => saveCourse(c.id)}>Save</button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
