
import { useEffect, useState } from "react";
import { PatientService } from "@services";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PatientPrescriptionCard } from "@components";
import "@styles/pages/MedicalShared.css";

const PatientPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const data = await PatientService.getMyPrescriptions();
        setPrescriptions(data);
      } catch (error) {
        console.error("Eroare la preluare rețete:", error);
      }
    };
    fetchPrescriptions();
  }, []);

  return (
    <div className="page-wrapper">
      <div className="medical-page-container">
        <h2 className="page-title">Rețetele mele</h2>
        {prescriptions.length === 0 ? (
          <p className="empty-msg">Nu există rețete disponibile.</p>
        ) : (
          <div className="medical-list">
            {prescriptions.map((item) => (
              <PatientPrescriptionCard 
                key={item.id} 
                content={item.content} 
                createdAt={item.createdAt}
                doctorName={item.doctorName}
                appointmentDate={item.appointmentDate}
              />
            ))}
          </div>
        )}
        <button className="back-btn" onClick={() => navigate("/dashboard-patient")}>
          <ArrowLeft size={18} /> Înapoi
        </button>
      </div>
    </div>
  );
};

export default PatientPrescriptions;
