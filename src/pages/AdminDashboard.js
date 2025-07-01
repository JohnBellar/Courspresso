import React, { useEffect, useState } from "react";
import axios from "../utils/axiosConfig";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ title: "", description: "", imageUrl: "", url: "", platform: "", tutor: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }
    loadCourses();
    loadStats();
    loadUsers();
  }, []);

  const loadCourses = async () => {
    try {
      const res = await axios.get("/courses?page=0&size=20");
      setCourses(Array.isArray(res.data) ? res.data : res.data.content || []);
    } catch (e) {
      setError("403 - Admin access required. Please login as admin.");
    }
  };

  const loadStats = async () => {
    try {
      const res = await axios.get("/admin/dashboard");
      setStats(res.data);
    } catch (e) {
      console.error("Stats fetch error:", e);
    }
  };

  const deleteCourse = async (id) => {
    try {
      await axios.delete(`/admin/courses/${id}`);
      handleSearch("", true); // reload all
    } catch (e) {
      console.error(e);
    }
  };

  const addCourse = async () => {
    try {
      await axios.post("/admin/courses", form);
      setForm({ title: "", description: "", imageUrl: "", url: "", platform: "", tutor: "" });
      loadCourses();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSearch = async (query = searchQuery, isReset = false) => {
    try {
      if (!query.trim()) {
        loadCourses();
        return;
      }
      const res = await axios.get(`/courses/search?q=${query}&page=0&size=10`);
      const data = Array.isArray(res.data) ? res.data : res.data.content || [];
      setCourses(data);
    } catch (err) {
      setError("Search failed.");
    }
  };

  const loadUsers = async () => {
    try {
      const res = await axios.get("/admin/users");
      const filtered = res.data.filter(u => u.username !== "mrD" && u.role !== "ADMIN");
      setUsers(filtered);
    } catch (e) {
      console.error("User fetch error", e);
    }
  };

  const handleUserDelete = async (username) => {
    try {
      await axios.delete(`/admin/users?username=${username}`);
      loadUsers();
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const coffeeStyles = {
    backgroundColor: "#f8f1e7",
    color: "#4b3621",
    fontFamily: "Georgia, serif",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  };

  const inputStyle = {
    backgroundColor: "#fff8f2",
    border: "1px solid #d9c4a3",
    color: "#4b3621",
  };

  const headingStyle = {
    color: "#6f4e37",
  };

  return (
    <div className="container mt-4" style={coffeeStyles}>
      <h2 style={headingStyle}>Admin Dashboard</h2>
      {error && <p className="text-danger">{error}</p>}

      {stats && (
        <div className="mb-4">
          <h5 style={headingStyle}>Summary</h5>
          <ul>
            <li>Admin Email: {stats.adminEmail}</li>
            <li>Total Users: {stats.totalUsers}</li>
            <li>Total Courses: {stats.totalCourses}</li>
            <li>Total Feedback: {stats.totalFeedback}</li>
            <li>Top Platforms: {stats.platformStats?.join(", ")}</li>
          </ul>
        </div>
      )}

      <div className="mb-4">
        <h5 style={headingStyle}>Add New Course</h5>
        <input className="form-control mb-2" placeholder="Title" style={inputStyle} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input className="form-control mb-2" placeholder="Description" style={inputStyle} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input className="form-control mb-2" placeholder="Platform" style={inputStyle} value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })} />
        <input className="form-control mb-2" placeholder="Tutor" style={inputStyle} value={form.tutor} onChange={(e) => setForm({ ...form, tutor: e.target.value })} />
        <input className="form-control mb-2" placeholder="Image URL" style={inputStyle} value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
        <input className="form-control mb-2" placeholder="Course URL" style={inputStyle} value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
        <button className="btn btn-success" onClick={addCourse}>Add Course</button>
      </div>

      <h4 style={headingStyle}>Manage Courses</h4>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search courses..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (!e.target.value.trim()) handleSearch("", true);
          }}
        />
        <button className="btn btn-outline-dark" onClick={() => handleSearch()}>Search</button>
      </div>

      <ul className="list-group mb-4">
        {courses.length === 0 ? (
          <p>No courses available.</p>
        ) : (
          courses.map((course) => (
            <li key={course.id} className="list-group-item d-flex justify-content-between align-items-center" style={{ backgroundColor: "#fffdf7" }}>
              <span>{course.title}</span>
              <button className="btn btn-danger btn-sm" onClick={() => deleteCourse(course.id)}>Delete</button>
            </li>
          ))
        )}
      </ul>

      <h4 style={headingStyle}>Manage Users</h4>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search users..."
          value={userSearch}
          onChange={(e) => setUserSearch(e.target.value)}
        />
      </div>
      <ul className="list-group">
        {filteredUsers.length === 0 ? (
          <p>No users found.</p>
        ) : (
          filteredUsers.map((user) => (
            <li key={user.username} className="list-group-item d-flex justify-content-between align-items-center">
              <span>{user.username} ({user.email})</span>
              <button className="btn btn-danger btn-sm" onClick={() => handleUserDelete(user.username)}>Delete</button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
