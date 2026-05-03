import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Check for Admin login first
    if (
      credentials.email === "Admin45" &&
      credentials.password === "45454545"
    ) {
      const adminUser = {
        username: "Administrator",
        email: "Admin45",
        role: "ADMIN",
      };

      login(adminUser); // update context
      localStorage.setItem("user", JSON.stringify(adminUser));
      alert("Welcome Admin!");
      navigate("/AdminPage"); // ✅ redirect admin
      return;
    }

    // ✅ Otherwise, try normal user login via backend
    try {
      const res = await axios.post(
        "http://localhost:8080/api/auth/login",
        credentials
      );

      // Assuming backend returns something like { username, email, role: "USER" }
      login(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));

      alert("Login successful!");
      navigate("/home");
    } catch (error) {
      console.error(error);
      alert("Invalid email or password!");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg p-4">
            <h3 className="text-center mb-4">Login</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label>Email or Username</label>
                <input
                  type="text"
                  name="email"
                  className="form-control"
                  value={credentials.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  value={credentials.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit" className="btn btn-success w-100">
                Login
              </button>
            </form>
            <p className="mt-3 text-center">
              Don’t have an account? <a href="/signup">Sign Up</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
