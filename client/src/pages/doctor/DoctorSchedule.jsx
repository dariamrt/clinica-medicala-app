import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DoctorService } from "@services";
import { ArrowLeft } from "lucide-react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "@styles/pages/Appointments.css";

const DoctorSchedule = () => {
  const [appointments, setAppointments] = useState([]);
  const [availabilities, setAvailabilities] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedItem, setSelectedItem] = useState(null);
  const [error, setError] = useState(null);
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
        setError("Nu s-au putut încărca programările.");
      }
    };

    fetchData();
  }, []);

  const getTileClassName = ({ date }) => {
    const formattedDate = date.toISOString().split('T')[0];
    
    const hasAppointment = appointments.some(appointment => 
      appointment.date === formattedDate
    );
    
    const hasAvailability = availabilities.some(availability => 
      availability.date === formattedDate
    );
    
    if (hasAppointment && hasAvailability) {
      return "has-appointment has-availability";
    } else if (hasAppointment) {
      return "has-appointment";
    } else if (hasAvailability) {
      return "has-availability";
    }
    
    return null;
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedItem(null);
  };

  const appointmentsOnSelectedDate = appointments.filter(appointment => 
    appointment.date === selectedDate.toISOString().split('T')[0]
  );

  const availabilitiesOnSelectedDate = availabilities.filter(availability => 
    availability.date === selectedDate.toISOString().split('T')[0]
  );

  const handleItemClick = (item, type) => {
    setSelectedItem({ ...item, type });
  };

  return (
    <div className="page-wrapper">
      <div className="medical-page-container">
        <h2 className="page-title">Calendarul programărilor și disponibilităților</h2>

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
                      key={`appointment-${appointment.id}`} 
                      className={`appointment-list-item ${selectedItem && selectedItem.id === appointment.id && selectedItem.type === 'appointment' ? 'selected' : ''}`}
                      onClick={() => handleItemClick(appointment, 'appointment')}
                    >
                      <span className="appointment-time">
                        {appointment.start_time.slice(0, 5)} - {appointment.end_time.slice(0, 5)}
                      </span>
                      <span className="appointment-doctor">
                        {appointment.Patients_Datum?.first_name} {appointment.Patients_Datum?.last_name}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              
              <h3 style={{ marginTop: "20px" }}>Disponibilități pe {selectedDate.toLocaleDateString('ro-RO')}</h3>
              {availabilitiesOnSelectedDate.length === 0 ? (
                <p className="no-appointments">Nu există disponibilități pentru această zi.</p>
              ) : (
                <ul className="appointment-list">
                  {availabilitiesOnSelectedDate.map((availability) => (
                    <li 
                      key={`availability-${availability.id}`} 
                      className={`appointment-list-item availability-item ${selectedItem && selectedItem.id === availability.id && selectedItem.type === 'availability' ? 'selected' : ''}`}
                      onClick={() => handleItemClick(availability, 'availability')}
                    >
                      <span className="appointment-time">
                        {availability.start_time.slice(0, 5)} - {availability.end_time.slice(0, 5)}
                      </span>
                      <span className="appointment-doctor">
                        Disponibil
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="appointment-details">
            {selectedItem ? (
              <div className="appointment-detail-card">
                <h3>{selectedItem.type === 'appointment' ? 'Detalii programare' : 'Detalii disponibilitate'}</h3>
                
                {selectedItem.type === 'appointment' && (
                  <>
                    <p><strong>Pacient:</strong> {selectedItem.Patients_Datum?.first_name} {selectedItem.Patients_Datum?.last_name}</p>
                    <p><strong>Email:</strong> {selectedItem.Patients_Datum?.User?.email}</p>
                    <p><strong>Status:</strong> <span className={`status ${selectedItem.status}`}>{selectedItem.status}</span></p>
                  </>
                )}
                
                <p><strong>Data:</strong> {selectedItem.date}</p>
                <p><strong>Interval orar:</strong> {selectedItem.start_time} - {selectedItem.end_time}</p>
              </div>
            ) : (
              <div className="appointment-details-placeholder">
                <h3>Detalii</h3>
                <p className="no-selection">Selectează o programare sau disponibilitate pentru a vedea detaliile.</p>
              </div>
            )}
          </div>
        </div>

        <div className="calendar-legend">
          <div className="legend-item">
            <span className="legend-color appointment-legend"></span>
            <span>Programare</span>
          </div>
          <div className="legend-item">
            <span className="legend-color availability-legend"></span>
            <span>Disponibilitate</span>
          </div>
        </div>

        <button className="back-btn" onClick={() => navigate("/dashboard-doctor")}>
          <ArrowLeft size={18} /> Înapoi
        </button>
      </div>
    </div>
  );
};

export default DoctorSchedule;