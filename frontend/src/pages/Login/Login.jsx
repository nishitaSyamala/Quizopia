import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = ({ roleHandler }) => {
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Signup
  const [role, setRole] = useState("student"); // Default role

  // State for form fields
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  const [forgotPw, setforgotPw] = useState(false);

  // for navigation purpose
  const navigate = useNavigate();

  const registerUser = async (body) => {
    const { data } = await axios.post(
      "http://localhost:3000/api/v1/user/register",
      body
    );

    if (data.accessToken && data.refreshToken) {
      // Store tokens in localStorage or sessionStorage
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("role", data.role);

      roleHandler(data.role);

      if(data.role == 'admin'){
        navigate("/dashboard/all-courses");
        }
      else if (data.role=='teacher'){
        navigate("/dashboard/teacher-courses");
      }
      else if (data.role=='student' && data.user.courses.length > 0){
        navigate("/dashboard/student-quiz");
      }

      if(data.role == 'student' && data.user.courses.length == 0){
        navigate('/enrollment-page');
        }
    }

    console.log(data);
  };

  const loginUser = async (body) => {
    try {
      const { data } = await axios.post(
        "http://localhost:3000/api/v1/user/login",
        body
      );

      console.log(data);
      

      if (data.accessToken && data.refreshToken) {
        // Store tokens in localStorage or sessionStorage
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("role", data.role);

        roleHandler(data.role);
        
        // Navigate to the dashboard after successful login
        if(data.role == 'admin'){
          navigate("/dashboard/all-courses");
          }
        else if (data.role=='teacher'){
          navigate("/dashboard/previous-quizzes");
        }
        else if (data.role=='student' && data.user.courses.length > 0){
          navigate("/dashboard/student-quiz");
        }

        
      if(data.role == 'student' && data.user.courses.length == 0){
        navigate('/enrollment-page');
        }
      }
    } catch (error) {
      // Check if error response exists and set the error message
      if (error.response && error.response.data) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          password:
            error.response.data.message || "Login failed. Please try again.",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          password: "An unexpected error occurred. Please try again.",
        }));
      }
    }
  };

  // State for error messages
  const [errors, setErrors] = useState({
    // username: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    email: "",
    // phone: "",
  });

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    let formIsValid = true;
    let errors = {};

    // Login Validation
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Valid Email is required.";
      formIsValid = false;
    }
    if (!password) {
      errors.password = "Password is required.";
      formIsValid = false;
    }

    setErrors(errors);
    if (formIsValid) {
      const body = { email, password };
      loginUser(body);
    }
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    let formIsValid = true;
    let errors = {};

    // Signup Validation
    if (!fullName) {
      errors.fullName = "Full Name is required.";
      formIsValid = false;
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Valid Email is required.";
      formIsValid = false;
    }

    if (!password) {
      errors.password = "Password is required.";
      formIsValid = false;
    }

    setErrors(errors);
    if (formIsValid) {
      // Perform signup action here
      const body = {
        fullName,
        password,
        email,
        role,
      };

      registerUser(body);
    }
  };

  const forgotPasswordHandle=()=>{
 // function for viewing the forgot password message
  setforgotPw(prevState => !prevState); 
  }
 

  return (

      <div className="d-flex justify-content-center align-items-center vh-100 mt-5">
      <div className="card shadow p-4" style={{ width: "400px" }}>
        {!forgotPw?
        <div>
 <h3 className="text-center mb-4">
          {isLogin ? "Login" : "Create Account"}
        </h3>

        {isLogin ? (
          <>
            {/* Login Form */}
            <form onSubmit={handleLoginSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <div className="text-danger">{errors.email}</div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
                {errors.password && (
                  <div className="text-danger">{errors.password}</div>
                )}
              </div>

              <div className="d-flex justify-content-between" onClick={forgotPasswordHandle}>
                  Forgot Password?  
              </div>

              <button type="submit" className="btn btn-primary w-100 mt-3">
                Login
              </button>
            </form>

            <p className="text-center mt-3">
              New here?{" "}
              <span
                className="text-primary text-decoration-none"
                style={{ cursor: "pointer" }}
                onClick={() => setIsLogin(false)}
              >
                Create an Account
              </span>
            </p>
          </>
        ) : (
          <>
            {/* Role Selection */}
            <div className="mb-3">
              <label className="text-start form-label">Select Role:</label>
              <div className="btn-group w-100" role="group">
                {["student", "teacher", "admin"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`btn ${
                      role === item ? "btn-primary" : "btn-outline-primary"
                    }`}
                    onClick={() => setRole(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            {/* Signup Form */}
            <form onSubmit={handleSignupSubmit}>
              <div className="mb-3">
                <label htmlFor="fullName" className="form-label">
                  Full Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                />
                {errors.fullName && (
                  <div className="text-danger">{errors.fullName}</div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <div className="text-danger">{errors.email}</div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
                {errors.password && (
                  <div className="text-danger">{errors.password}</div>
                )}{" "}
                {/* Error message here */}
              </div>

              <button type="submit" className="btn btn-primary w-100 mt-3">
                Create Account
              </button>
            </form>

            <p className="text-center mt-3">
              Already have an account?{" "}
              <span
                className="text-primary text-decoration-none"
                style={{ cursor: "pointer" }}
                onClick={() => setIsLogin(true)}
              >
                Login
              </span>
            </p>
          </>
        )}

          </div>
       
      :<div>
      <h3>Please contact admin for password change!</h3>
      <button type="submit" className="btn btn-primary w-100 mt-3" onClick={forgotPasswordHandle}>
              Back to Login Page
              </button>
      </div>}
    </div></div>
    
  );
};

export default LoginPage;
