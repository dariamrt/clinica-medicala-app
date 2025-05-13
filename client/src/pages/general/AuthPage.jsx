import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LoginForm, RegisterForm } from "@components";
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
          </div>
          <div className="form-container">
            <h2>Register</h2>
            <RegisterForm />
            <p className="gdpr-text">
              Prin crearea contului sunteți de acord cu{" "}
              <Link to="/terms">Termenii și Condițiile</Link> clinicii noastre și cu politica GDPR.
            </p>
          </div>
        </div>

        <div className="auth-switch-footer">
          {isRegistering ? (
            <button onClick={() => setIsRegistering(false)}>Ai deja cont? Autentifică-te</button>
          ) : (
            <button onClick={() => setIsRegistering(true)}>Nu ai cont? Creează unul</button>
          )}
        </div>
      </div>
    </div>
  );
};


export default AuthPage;
