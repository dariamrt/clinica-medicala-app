import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { PatientService } from "@services";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { AppointmentItem } from "@components";
import "react-calendar/dist/Calendar.css";
import "@styles/pages/Appointments.css";

const PatientAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState(null);
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

  const getTileClassName = ({ date }) => {
    const formattedDate = date.toISOString().split('T')[0];
    const hasAppointment = appointments.some(appointment => 
      appointment.date === formattedDate
    );
    
    return hasAppointment ? "has-appointment" : null;
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedAppointment(null);
  };

  const appointmentsOnSelectedDate = appointments.filter(appointment => 
    appointment.date === selectedDate.toISOString().split('T')[0]
  );

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
  };

  const handleCancelAppointment = async () => {
    fetchAppointments();
  };

  return (
    <div className="page-wrapper">
      <div className="medical-page-container">
        <h2 className="page-title">Calendarul programărilor</h2>

        {error && <p className="error-message">{error}</p>}

        <div className="calendar-layout">
          <div className="calendar-container">
            <Calendar
              onChange={handleDateChange}
              value={selectedDate}
              tileClassName={getTileClassName}
            />

            <div className="date-appointments">
              <h3>Programări pe {selectedDate.toLocaleDateString('ro-RO')}</h3>
              {appointmentsOnSelectedDate.length === 0 ? (
                <p className="no-appointments">Nu există programări pentru această zi.</p>
              ) : (
                <ul className="appointment-list">
                  {appointmentsOnSelectedDate.map((appointment) => (
                    <li 
                      key={appointment.id} 
                      className={`appointment-list-item ${selectedAppointment && selectedAppointment.id === appointment.id ? 'selected' : ''}`}
                      onClick={() => handleAppointmentClick(appointment)}
                    >
                      <span className="appointment-time">
                        {appointment.start_time.slice(0, 5)} - {appointment.end_time.slice(0, 5)}
                      </span>
                      <span className="appointment-doctor">
                        Dr. {appointment.Doctors_Datum?.first_name} {appointment.Doctors_Datum?.last_name}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="appointment-details">
            {selectedAppointment ? (
              <AppointmentItem 
                appointment={selectedAppointment} 
                onCancel={handleCancelAppointment}
              />
            ) : (
              <div className="appointment-details-placeholder">
                <h3>Detalii programare</h3>
                <p className="no-selection">Selectează o programare pentru a vedea detaliile.</p>
              </div>
            )}
          </div>
        </div>

        <button className="back-btn" onClick={() => navigate("/dashboard-patient")}>
          <ArrowLeft size={18} /> Înapoi
        </button>
      </div>
    </div>
  );
};

export default PatientAppointments;