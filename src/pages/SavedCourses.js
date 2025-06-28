import React, { useEffect, useState } from "react";
import axios from "../utils/axiosConfig";

export default function SavedCourses() {
  const [courses, setCourses] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userId) fetchSaved();
  }, [userId]);

  const fetchSaved = async () => {
    try {
      const res = await axios.get(`/saved-courses/${userId}`);
      setCourses(res.data);
    } catch (err) {
      console.error("Error loading saved courses", err);
    }
  };

  return (
    <div className="container">
      <h2>Saved Courses</h2>
      <ul>
        {courses.map((course) => (
          <li key={course.id}>{course.title}</li>
        ))}
      </ul>
    </div>
  );
}

