import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DoctorService } from "@services";
import { ArrowLeft } from "lucide-react";
import { DoctorCalendarView } from "@components";
import "@styles/pages/Schedule.css";

const DoctorSchedule = () => {
  const [appointments, setAppointments] = useState([]);
  const [availabilities, setAvailabilities] = useState([]);
  const [view, setView] = useState("week");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const appts = await DoctorService.getMyAppointments();
        const avails = await DoctorService.getMyAvailabilities();
        setAppointments(appts);
        setAvailabilities(avails);
      } catch (error) {
        console.error("Eroare la preluare date:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="doctor-schedule-page">
      <div className="calendar-side">
        <div className="calendar-filter">
          <button className="filter-btn" onClick={() => setView("day")}>Zi</button>
          <button className="filter-btn" onClick={() => setView("week")}>Săptămână</button>
          <button className="filter-btn" onClick={() => setView("agenda")}>Toate</button>
        </div>
        <DoctorCalendarView view={view} />
      </div>

      <div className="details-side">
        <h2>Programările tale</h2>
        {appointments.length === 0 ? (
          <p className="empty-message">Nu ai programări disponibile.</p>
        ) : (
          <div className="list-cards">
            {appointments.map((appt) => (
              <div key={appt.id} className="card">
                <p><strong>Pacient:</strong> {appt.Patients_Datum?.first_name} {appt.Patients_Datum?.last_name}</p>
                <p><strong>Email:</strong> {appt.Patients_Datum?.User?.email}</p>
                <p><strong>Data:</strong> {appt.date}</p>
                <p><strong>Interval:</strong> {appt.start_time} - {appt.end_time}</p>
                <p><strong>Status:</strong> <span className={`status ${appt.status}`}>{appt.status}</span></p>
              </div>
            ))}
          </div>
        )}

        <h2 style={{ marginTop: "2rem" }}>Disponibilitățile tale</h2>
        {availabilities.length === 0 ? (
          <p className="empty-message">Nu ai disponibilități înregistrate.</p>
        ) : (
          <div className="list-cards">
            {availabilities.map((a) => (
              <div key={a.id} className="card">
                <p><strong>Data:</strong> {a.date}</p>
                <p><strong>Interval:</strong> {a.start_time} - {a.end_time}</p>
              </div>
            ))}
          </div>
        )}

        <button className="back-btn" onClick={() => navigate("/dashboard-doctor")}>
          <ArrowLeft size={18} /> Înapoi
        </button>
      </div>
    </div>
  );
};

export default DoctorSchedule;
