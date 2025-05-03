import React, { useEffect, useState } from "react";
import { DoctorService } from "@services";
import { AddOrEditDoctorModal, ManageAvailabilityModal } from "@components";
import "@styles/pages/ManageDoctors.css";

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [availabilityModalOpen, setAvailabilityModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const fetchDoctors = async () => {
    try {
      const data = await DoctorService.getAllDoctors();
      setDoctors(data);
    } catch (err) {
      console.error("Eroare la incarcat doctori:", err);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleAddClick = () => {
    setSelectedDoctor(null);
    setModalOpen(true);
  };

  const handleEditClick = (doctor) => {
    setSelectedDoctor(doctor);
    setModalOpen(true);
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedDoctor) {
        await DoctorService.updateDoctor(selectedDoctor.user_id, formData);
      } else {
        await DoctorService.createDoctor(formData);
      }
      fetchDoctors();
      setModalOpen(false);
    } catch (err) {
      console.error("Eroare la salvare:", err);
    }
  };

  const handleManageAvailability = (doctor) => {
    setSelectedDoctor(doctor);
    setAvailabilityModalOpen(true);
  };

  return (
    <div className="manage-doctors-page">
      <div className="manage-doctors-header">
        <h2>Gestionare Doctori</h2>
        <button onClick={handleAddClick}>Adaugă doctor</button>
      </div>

      <div className="doctors-table">
        <table>
          <thead>
            <tr>
              <th>Nume</th>
              <th>Email</th>
              <th>Telefon</th>
              <th>Specializare</th>
              <th>Acțiuni</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doc) => (
              <tr key={doc.user_id}>
                <td>{doc.first_name} {doc.last_name}</td>
                <td>{doc.email}</td>
                <td>{doc.phone_number || "—"}</td>
                <td>{doc.specialty?.name || "—"}</td>
                <td className="doctor-actions">
                  <button onClick={() => handleEditClick(doc)}>Editează</button>
                  <button className="btn-secondary" onClick={() => handleManageAvailability(doc)}>
                    Disponibilități
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <AddOrEditDoctorModal
          doctor={selectedDoctor}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
        />
      )}

      {availabilityModalOpen && (
        <ManageAvailabilityModal
          doctor={selectedDoctor}
          onClose={() => setAvailabilityModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ManageDoctors;
