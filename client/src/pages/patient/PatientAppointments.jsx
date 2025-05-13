import { useEffect, useState } from "react";
import { AppointmentItem } from "@components";
import { PatientService } from "@services";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "@styles/pages/Appointments.css";

const PatientAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchAppointments = async () => {
    try {
      const response = await PatientService.getMyAppointments();

      if (!Array.isArray(response)) {
        setError("Răspuns invalid de la server.");
        console.error("Răspuns necunoscut:", response);
        return;
      }

      setAppointments(response);
    } catch (error) {
      console.error("Eroare la preluarea programărilor:", error);
      setError("Nu s-au putut încărca programările.");
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
  <div className="page-wrapper">
    <div className="medical-page-container">
        <h2 className="page-title">Programările mele</h2>

        {error && <p className="empty-message">{error}</p>}

        {!error && appointments.length === 0 ? (
          <p className="empty-message">Nu ai programări.</p>
        ) : (
          <div className="appointments-list">
            {appointments.map((appt) => (
              <AppointmentItem
                key={appt.id}
                role="patient"
                appointment={appt}
                onCancel={fetchAppointments}
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

export default PatientAppointments;
