import React, { useState, useEffect } from "react";
import { SpecialtyService, DoctorService, UserService } from "@services";
import "@styles/components/AddOrEditDoctorModal.css";

const AddOrEditDoctorModal = ({ doctor, onClose, onSubmit }) => {
  const [specialties, setSpecialties] = useState([]);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    salary: "",
    specialty_id: "",
  });

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const data = await SpecialtyService.getAllSpecialties();
        setSpecialties(data);
      } catch (err) {
        console.error("Eroare la incarcarea specializarilor:", err);
      }
    };

    fetchSpecialties();
  }, []);

  useEffect(() => {
    if (doctor) {
      setFormData({
        first_name: doctor.first_name || "",
        last_name: doctor.last_name || "",
        email: doctor.email || "",
        phone_number: doctor.phone_number || "",
        salary: doctor.salary || "",
        specialty_id: doctor.specialty_id || "",
      });
    }
  }, [doctor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        await DoctorService.createDoctor(formData);
      }

      onSubmit();
      onClose();
    } catch (error) {
      console.error("Eroare la salvare:", error);
      alert("Eroare la salvare.");
    }
  };

  return (
    <div className="doctor-modal-overlay" onClick={onClose}>
      <div className="doctor-modal" onClick={(e) => e.stopPropagation()}>
        <h3>{doctor ? "Editează doctor" : "Adaugă doctor"}</h3>
        <form onSubmit={handleSubmit}>
          <input
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            placeholder="Prenume"
            required
          />
          <input
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            placeholder="Nume"
            required
          />
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
          <input
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            placeholder="Telefon"
          />
          <input
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            placeholder="Salariu"
            type="number"
            min="0"
          />
          <select
            name="specialty_id"
            value={formData.specialty_id}
            onChange={handleChange}
            required
          >
            <option value="">Selectează specializare</option>
            {specialties.map((spec) => (
              <option key={spec.id} value={spec.id}>
                {spec.name}
              </option>
            ))}
          </select>

          <div className="modal-actions">
            <button type="submit">{doctor ? "Salvează" : "Adaugă"}</button>
            <button type="button" onClick={onClose}>
              Anulează
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddOrEditDoctorModal;
