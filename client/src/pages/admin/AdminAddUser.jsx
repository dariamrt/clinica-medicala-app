import { useState, useEffect } from "react";
import { AuthService, SpecialtyService } from "@services";
import { useNavigate } from "react-router-dom";
import "@styles/pages/AdminAddUser.css";

const AdminAddUser = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    specialty_id: "",
    CNP: "",
    gender: "",
    address: ""
  });

  const [specialties, setSpecialties] = useState([]);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const data = await SpecialtyService.getAllSpecialties();
        setSpecialties(data);
      } catch (err) {
        console.error("Eroare la specializari:", err);
      }
    };
    fetchSpecialties();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    try {
      await AuthService.register(form);
      setSuccessMsg("Utilizator creat cu succes!");
      setTimeout(() => navigate("/dashboard-admin"), 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
   <div className="page-wrapper">
      <div className="medical-page-container">
      <h2 className="page-title">Adaugă un utilizator</h2>

      <form className="add-user-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <input name="email" value={form.email} onChange={handleChange} placeholder="Email" required />
          <input name="password" value={form.password} onChange={handleChange} type="password" placeholder="Parolă" required />
          <input name="confirmPassword" value={form.confirmPassword} onChange={handleChange} type="password" placeholder="Confirmă parola" required />
        </div>

        <div className="form-row">
          <input name="first_name" value={form.first_name} onChange={handleChange} placeholder="Prenume" required />
          <input name="last_name" value={form.last_name} onChange={handleChange} placeholder="Nume" required />
        </div>

        <div className="form-row">
          <select name="role" value={form.role} onChange={handleChange} required>
            <option value="">Selectează rol</option>
            <option value="admin">Admin</option>
            <option value="doctor">Doctor</option>
            <option value="patient">Pacient</option>
          </select>
        </div>

        {form.role === "doctor" && (
          <>
            <div className="form-row">
              <select name="specialty_id" value={form.specialty_id} onChange={handleChange} required>
                <option value="">Selectează specializarea</option>
                {specialties.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              <input name="phone_number" value={form.phone_number} onChange={handleChange} placeholder="Telefon (opțional)" />
            </div>
          </>
        )}

        {form.role === "patient" && (
          <>
            <div className="form-row">
              <input name="CNP" value={form.CNP} onChange={handleChange} placeholder="CNP" required />
              <select name="gender" value={form.gender} onChange={handleChange} required>
                <option value="">Gen</option>
                <option value="F">F</option>
                <option value="M">M</option>
              </select>
            </div>
            <div className="form-row">
              <input name="phone_number" value={form.phone_number} onChange={handleChange} placeholder="Telefon (opțional)" />
              <input name="address" value={form.address} onChange={handleChange} placeholder="Adresă (opțional)" />
            </div>
          </>
        )}

        {error && <p className="form-error">{error}</p>}
        {successMsg && <p className="form-success">{successMsg}</p>}

        <button type="submit">Creează utilizator</button>
      </form>
    </div>
    </div>
  );
};

export default AdminAddUser;
