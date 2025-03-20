import React, { useState } from "react";
import { login } from "../../services/AuthService";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const data = await login(email, password);
      localStorage.setItem("token", data.token); // save token
      navigate("/dashboard"); 
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleLogin}>
      {error && <p className="error-message">{error}</p>}
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Parolă" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
