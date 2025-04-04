import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DoctorService } from "@services";
import { AppointmentItem } from "@components";
import { ArrowLeft } from "lucide-react";
import "@styles/pages/Appointments.css";

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await DoctorService.getMyAppointments();
        setAppointments(data);
      } catch (error) {
        console.error("Eroare la preluarea programărilor:", error);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <>
      <div className="appointments-wrapper">
        <h2 className="appointments-title">Programările tale</h2>

        {appointments.length === 0 ? (
          <p className="empty-message">Nu ai programări disponibile.</p>
        ) : (
          <div className="appointments-list">
            {appointments.map((appt) => (
              <AppointmentItem key={appt.id} appointment={appt} />
            ))}
          </div>
        )}

        <button className="back-btn" onClick={() => navigate("/dashboard-doctor")}>
          <ArrowLeft size={18} /> Înapoi
        </button>
      </div>
    </>
  );
};

export default DoctorAppointments;
