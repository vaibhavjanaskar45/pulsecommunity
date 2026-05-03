import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  const isAdmin = user?.role === "ADMIN";

  return (
    <>
      {/* Main Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-3">
        <Link className="navbar-brand fw-bold" to="/">PulseCommunity</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto">
            {user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/BasicMap">Basic Map</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/CrimeHeatmap">Crime Heatmap</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/News">See News</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/Chat">Public Chat</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/Weather">Weather</Link>
                </li>

                {isAdmin ? (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/DrawMap">Draw on Map</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/AdminPage">Admin Page</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/ManageAnnouncements">Manage Announcements</Link>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/home">Home</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/Announcements">Announcements</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/AboutUs">About Us</Link>
                    </li>
                  </>
                )}

                <li className="nav-item">
                  <button className="btn btn-danger btn-sm ms-3" onClick={logout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/signup">Signup</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>

      {/* 🔹 Admin Indicator Bar */}
      {user && isAdmin && (
        <div  className="text-center" style={{
          backgroundColor: "#e0e0e0",
          padding: "6px 15px",
          fontSize: "14px",
          borderBottom: "1px solid #ccc"
        }}>
          You are logged in as <strong>System Administrator</strong>
        </div>
      )}
    </>
  );
};

export default Navbar;