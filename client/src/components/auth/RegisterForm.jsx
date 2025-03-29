import React, { useState } from "react";
import { AuthService } from "@services";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    phone_number: "",
    first_name: "",
    last_name: "",
    CNP: "",
    gender: "female",
    address: "",
  });

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    if (userData.password !== userData.confirmPassword) {
      setError("Parolele nu coincid.");
      return;
    }

    try {
      await AuthService.register({
        email: userData.email,
        password: userData.password,
        confirmPassword: userData.confirmPassword,
        role: "patient",
        phone_number: userData.phone_number,
        first_name: userData.first_name,
        last_name: userData.last_name,
        CNP: userData.CNP,
        gender: userData.gender,
        address: userData.address,
      });

      window.alert("Cont creat cu succes! Vei fi redirecționat către dashboard.");

      setUserData({
        email: "",
        password: "",
        confirmPassword: "",
        phone_number: "",
        first_name: "",
        last_name: "",
        CNP: "",
        gender: "female",
        address: "",
      });

      navigate("/dashboard"); 
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleRegister}>
      {error && <p className="error-message">{error}</p>}
      <input type="email" placeholder="Email" value={userData.email} onChange={(e) => setUserData({ ...userData, email: e.target.value })} required />
      <input type="password" placeholder="Parolă" value={userData.password} onChange={(e) => setUserData({ ...userData, password: e.target.value })} required />
      <input type="password" placeholder="Confirmă parola" value={userData.confirmPassword} onChange={(e) => setUserData({ ...userData, confirmPassword: e.target.value })} required />
      <input type="text" placeholder="Prenume" value={userData.first_name} onChange={(e) => setUserData({ ...userData, first_name: e.target.value })} required />
      <input type="text" placeholder="Nume" value={userData.last_name} onChange={(e) => setUserData({ ...userData, last_name: e.target.value })} required />
      <input type="tel" placeholder="Telefon" value={userData.phone_number} onChange={(e) => setUserData({ ...userData, phone_number: e.target.value })} required />
      <input type="text" placeholder="CNP" value={userData.CNP} onChange={(e) => setUserData({ ...userData, CNP: e.target.value.trim() })} required />
      <select value={userData.gender} onChange={(e) => setUserData({ ...userData, gender: e.target.value })}>
        <option value="male">Masculin</option>
        <option value="female">Feminin</option>
      </select>
      <input type="text" placeholder="Adresă" value={userData.address} onChange={(e) => setUserData({ ...userData, address: e.target.value })} required />
      <button type="submit">Register</button>
    </form>
  );
};

export default RegisterForm;
