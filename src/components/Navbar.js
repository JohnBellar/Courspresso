// components/Navbar.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const role = localStorage.getItem("role"); // fallback if context lags

  const handleLogout = () => {
    logout(); // clears context
    localStorage.clear(); // clears token and everything
    navigate("/"); // go to home after logout
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 shadow-sm">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/">Courspresso</Link>

        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto">
            {/* Always show Home */}
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>

            {/* If NOT logged in */}
            {!user && (
              <li className="nav-item">
                <Link className="nav-link" to="/login">Login</Link>
              </li>
            )}

            {/* If logged in as USER */}
            {user && role?.toLowerCase() === "user" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/user-dashboard">User Dashboard</Link>
                </li>
                <li className="nav-item">
                  <button className="btn btn-link nav-link" onClick={handleLogout}>Logout</button>
                </li>
              </>
            )}

            {/* If logged in as ADMIN */}
            {user && role?.toLowerCase() === "admin" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin">Admin Dashboard</Link>
                </li>
                <li className="nav-item">
                  <button className="btn btn-link nav-link" onClick={handleLogout}>Logout</button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
