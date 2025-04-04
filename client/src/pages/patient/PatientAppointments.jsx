import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { PatientService } from "@services";
import { AppointmentItem } from "@components";
import "@styles/pages/Appointments.css";

const PatientAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await PatientService.getMyAppointments();
        setAppointments(response);
      } catch (error) {
        console.error("Eroare la preluarea programărilor:", error);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <>
      <div className="appointments-wrapper">
        <h2 className="appointments-title">Programările mele</h2>

        {appointments.length === 0 ? (
          <p className="empty-message">Nu ai programări.</p>
        ) : (
          <div className="appointments-list">
            {appointments.map((appt) => (
              <AppointmentItem
                key={appt.id}
                doctorName={
                  appt.Doctors_Datum
                    ? `${appt.Doctors_Datum.first_name} ${appt.Doctors_Datum.last_name}`
                    : "N/A"
                }
                date={appt.date}
                time={`${appt.start_time} - ${appt.end_time}`}
                status={appt.status}
              />
            ))}
          </div>
        )}

        <button className="back-btn" onClick={() => navigate("/dashboard-patient")}>
          <ArrowLeft size={18} /> Înapoi
        </button>
      </div>
    </>
  );
};

export default PatientAppointments;
