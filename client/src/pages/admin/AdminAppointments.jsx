import React, { useEffect, useState } from "react";
import { AppointmentService } from "@services";
import { AppointmentItem } from "@components"
import "@styles/pages/Appointments.css";

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await AppointmentService.getAllAppointments();
        setAppointments(data);
      } catch (error) {
        console.error("Eroare la obtinerea programarilor:", error);
      }
    };
    fetchAppointments();
  }, []);

  const filteredAppointments = appointments.filter((appt) => {
    const patientName = `${appt?.Patient?.first_name ?? ""} ${appt?.Patient?.last_name ?? ""}`;
    const doctorName = `${appt?.Doctor?.first_name ?? ""} ${appt?.Doctor?.last_name ?? ""}`;
    const date = appt?.date ?? "";
    const status = appt?.status ?? "";

    return (
      patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      date.includes(searchTerm) ||
      status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="appointments-page-wrapper">
      <h2 className="page-title">Toate programările</h2>

      <div className="search-container">
        <input
          type="text"
          placeholder="Caută după pacient, doctor, dată sau status"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="appointments-list">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((appt) => (
            <AppointmentItem key={appt.id} appointment={appt} />
          ))
        ) : (
          <p className="empty-message">Nu există programări care să corespundă.</p>
        )}
      </div>
    </div>
  );
};

export default AdminAppointments;
