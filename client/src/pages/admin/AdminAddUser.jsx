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
  const [isLoading, setIsLoading] = useState(false);
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
    if (error) {
      setError("");
    }
  };

  const validateForm = () => {
    if (!form.email || !form.password || !form.confirmPassword || !form.first_name || !form.last_name || !form.role) {
      setError("Toate câmpurile obligatorii trebuie completate!");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Format email invalid!");
      return false;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;
    if (!passwordRegex.test(form.password)) {
      setError("Parola trebuie să aibă cel puțin 8 caractere, o literă mare, o literă mică și un caracter special!");
      return false;
    }

    if (form.password !== form.confirmPassword) {
      setError("Parolele nu coincid!");
      return false;
    }

    if (form.role === "doctor") {
      if (!form.specialty_id) {
        setError("Specializarea este obligatorie pentru doctori!");
        return false;
      }
    }

    if (form.role === "patient") {
      if (!form.CNP) {
        setError("CNP este obligatoriu pentru pacienți!");
        return false;
      }

      const cnpRegex = /^\d{13}$/;
      if (!cnpRegex.test(form.CNP)) {
        setError("CNP trebuie să conțină exact 13 cifre!");
        return false;
      }

      if (!form.gender) {
        setError("Genul este obligatoriu pentru pacienți!");
        return false;
      }

      if (!form.phone_number) {
        setError("Numărul de telefon este obligatoriu pentru pacienți!");
        return false;
      }

      if (!/^\d+$/.test(form.phone_number)) {
        setError("Numărul de telefon trebuie să conțină doar cifre!");
        return false;
      }

      if (!form.address) {
        setError("Adresa este obligatorie pentru pacienți!");
        return false;
      }
    }

    if (form.phone_number && !/^\d+$/.test(form.phone_number)) {
      setError("Numărul de telefon trebuie să conțină doar cifre!");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setIsLoading(true);

    try {
      if (!validateForm()) {
        setIsLoading(false);
        return;
      }

      const cleanForm = {
        ...form,
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        email: form.email.trim().toLowerCase(),
        phone_number: form.phone_number.trim(),
        address: form.address.trim(),
        specialty_id: form.specialty_id || null,
        CNP: form.CNP.trim() || null,
        gender: form.gender || null
      };

      await AuthService.register(cleanForm);
      setSuccessMsg("Utilizator creat cu succes!");

      setForm({
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

      setTimeout(() => navigate("/dashboard-admin"), 2000);
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message || "Eroare la crearea utilizatorului!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="medical-page-container">
        <h2 className="page-title">Adaugă un utilizator</h2>

        <form className="add-user-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <input 
              name="email" 
              value={form.email} 
              onChange={handleChange} 
              placeholder="Email" 
              type="email"
              required 
            />
            <input 
              name="password" 
              value={form.password} 
              onChange={handleChange} 
              type="password" 
              placeholder="Parolă" 
              required 
            />
            <input 
              name="confirmPassword" 
              value={form.confirmPassword} 
              onChange={handleChange} 
              type="password" 
              placeholder="Confirmă parola" 
              required 
            />
          </div>

          <div className="form-row">
            <input 
              name="first_name" 
              value={form.first_name} 
              onChange={handleChange} 
              placeholder="Prenume" 
              required 
            />
            <input 
              name="last_name" 
              value={form.last_name} 
              onChange={handleChange} 
              placeholder="Nume" 
              required 
            />
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
            <div className="form-row">
              <select name="specialty_id" value={form.specialty_id} onChange={handleChange} required>
                <option value="">Selectează specializarea</option>
                {specialties.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              <input 
                name="phone_number" 
                value={form.phone_number} 
                onChange={handleChange} 
                placeholder="Telefon"
                required
              />
            </div>
          )}

          {form.role === "patient" && (
            <>
              <div className="form-row">
                <input 
                  name="CNP" 
                  value={form.CNP} 
                  onChange={handleChange} 
                  placeholder="CNP" 
                  maxLength="13"
                  required 
                />
                <select name="gender" value={form.gender} onChange={handleChange} required>
                  <option value="">Gen</option>
                  <option value="female">Femeie</option>
                  <option value="male">Bărbat</option>
                </select>
              </div>
              <div className="form-row">
                <input 
                  name="phone_number" 
                  value={form.phone_number} 
                  onChange={handleChange} 
                  placeholder="Telefon"
                  required
                />
                <input 
                  name="address" 
                  value={form.address} 
                  onChange={handleChange} 
                  placeholder="Adresă"
                  required
                />
              </div>
            </>
          )}

          {error && <p className="form-error">{error}</p>}
          {successMsg && <p className="form-success">{successMsg}</p>}

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Se creează..." : "Creează utilizator"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminAddUser;
