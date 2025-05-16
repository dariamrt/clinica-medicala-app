import { useState, useEffect } from "react";
import { SpecialtyService, DoctorService, UserService } from "@services";
import "@styles/layout/Modal.css";

const AddOrEditDoctorModal = ({ doctor, onClose, onSubmit }) => {
  const [specialties, setSpecialties] = useState([]);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    salary: "",
    specialty_id: "",
    password: ""
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const data = await SpecialtyService.getAllSpecialties();
        setSpecialties(data);
      } catch (err) {
        console.error("Eroare la incarcarea specializarilor:", err);
        setError("Nu s-au putut încărca specializările.");
      }
    };

    fetchSpecialties();
  }, []);

  useEffect(() => {
    if (doctor) {
      setFormData({
        first_name: doctor.first_name || "",
        last_name: doctor.last_name || "",
        email: doctor.email || doctor.User?.email || "",
        phone_number: doctor.phone_number || "",
        salary: doctor.salary || "",
        specialty_id: doctor.specialty_id || doctor.specialty?.id || "",
        password: "",
      });
    }
  }, [doctor]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (doctor) {
        await UserService.updateUserById(doctor.user_id, {
          email: formData.email,
          phone_number: formData.phone_number,
        });

        await DoctorService.updateDoctor(doctor.user_id, {
          first_name: formData.first_name,
          last_name: formData.last_name,
          specialty_id: formData.specialty_id,
          salary: formData.salary,
        });
      } else {
        const user = await UserService.createUser({
          email: formData.email,
          password: formData.password,
          role: "doctor"
        });

        await DoctorService.createDoctor({
          user_id: user.id,
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone_number: formData.phone_number,
          specialty_id: formData.specialty_id,
          salary: formData.salary,
        });
      }

      onSubmit();
      onClose();
    } catch (error) {
      console.error("Eroare la salvare:", error);
      setError("A apărut o eroare la salvarea datelor. Verificați informațiile introduse.");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3>{doctor ? "Editează doctor" : "Adaugă doctor"}</h3>
        
        {error && <div className="submit-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Prenume <span className="required">*</span></label>
            <input 
              name="first_name" 
              value={formData.first_name} 
              onChange={handleChange} 
              placeholder="Prenume" 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Nume <span className="required">*</span></label>
            <input 
              name="last_name" 
              value={formData.last_name} 
              onChange={handleChange} 
              placeholder="Nume" 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Email <span className="required">*</span></label>
            <input 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              placeholder="Email" 
              type="email"
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Telefon</label>
            <input 
              name="phone_number" 
              value={formData.phone_number} 
              onChange={handleChange} 
              placeholder="Telefon" 
            />
          </div>
          
          <div className="form-group">
            <label>Salariu</label>
            <input 
              name="salary" 
              value={formData.salary} 
              onChange={handleChange} 
              placeholder="Salariu" 
              type="number" 
              min="0" 
            />
          </div>

          {!doctor && (
            <div className="form-group">
              <label>Parolă <span className="required">*</span></label>
              <input 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                placeholder="Parolă" 
                type="password" 
                required 
              />
            </div>
          )}
          
          <div className="form-group">
            <label>Specializare <span className="required">*</span></label>
            <select
              name="specialty_id"
              value={String(formData.specialty_id)}
              onChange={handleChange}
              required
            >
              <option value="">Selectează specializarea</option>
              {doctor && !specialties.some(s => String(s.id) === String(formData.specialty_id)) && (
                <option value={String(formData.specialty_id)}>
                  {doctor.specialty?.name || "Specializarea actuală"}
                </option>
              )}
              {specialties.map((spec) => (
                <option key={spec.id} value={String(spec.id)}>
                  {spec.name}
                </option>
              ))}
            </select>
          </div>

          <div className="modal-actions">
            <button type="submit" className="primary-btn">
              {doctor ? "Salvează" : "Adaugă"}
            </button>
            <button type="button" className="secondary-btn" onClick={onClose}>
              Anulează
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddOrEditDoctorModal;