import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../../components/auth/LoginForm";
import RegisterForm from "../../components/auth/RegisterForm";
import logo from "../../assets/logo.png"
import "@styles/pages/AuthPage.css";

const AuthPage = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard"); // if we have a token => go to dashboard
    }
  }, [navigate]);

  return (
    <div className={`auth-container ${isRegistering ? "register-active" : "login-active"}`}>
      <div className="auth-card">
        <img src={logo} alt="Logo Clinica" className="clinic-logo" />
        <div className="form-slider">
          <div className="form-container">
            <h2>Login</h2>
            <LoginForm />
            <p className="auth-switch">
              Don't have an account? <button onClick={() => setIsRegistering(true)}>Register now</button>
            </p>
          </div>
          <div className="form-container">
            <h2>Register</h2>
            <RegisterForm />
            <p className="auth-switch">
              Already have an account? <button onClick={() => setIsRegistering(false)}>Login here</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
