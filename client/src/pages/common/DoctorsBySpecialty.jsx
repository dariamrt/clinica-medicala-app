import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDoctorsBySpecialty } from "@services/DoctorService";
import { RoleBasedNavbar, DoctorCard, DoctorInfoModal } from "@components";
import { ArrowLeft } from "lucide-react";
import "@styles/pages/DoctorsBySpecialty.css";

const DoctorsBySpecialty = () => {
  const { specialtyId } = useParams();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        if (!specialtyId) return;
        const data = await getDoctorsBySpecialty(specialtyId);
        setDoctors(data);
      } catch (err) {
        console.error("Eroare la preluarea doctorilor:", err);
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [specialtyId]);

  const openDoctorModal = (doctor) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedDoctor(null);
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="doctors-specialty-page">
        <h2 className="doctors-title">Doctori specializați</h2>

        {loading ? (
          <p className="loading-msg">Se încarcă...</p>
        ) : doctors.length === 0 ? (
          <p className="no-doctors-msg">Nu există medici pentru specializarea selectată.</p>
        ) : (
          <div className="doctors-grid">
            {doctors.map((doc) => (
              <DoctorCard key={doc.user_id} doctor={doc} onClick={() => openDoctorModal(doc)} />
            ))}
          </div>
        )}

        {isModalOpen && (
          <DoctorInfoModal doctor={selectedDoctor} onClose={closeModal} />
        )}

        <button className="back-btn" onClick={() => navigate("/specialties")}>
          <ArrowLeft size={18} />
          Înapoi
        </button>
      </div>
    </>
  );
};

export default DoctorsBySpecialty;
