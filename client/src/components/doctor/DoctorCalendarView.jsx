import { useEffect, useState } from "react";
import { DoctorService } from "@services";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const DoctorCalendarView = ({ view = "week" }) => {
  const [events, setEvents] = useState([]);
  const [currentView, setCurrentView] = useState(view);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setCurrentView(view);
  }, [view]);

  useEffect(() => {
    const load = async () => {
      try {
        const appts = await DoctorService.getMyAppointments();
        const avails = await DoctorService.getMyAvailabilities();

        const formattedAppointments = appts.map((a) => ({
          title: `Programare: ${a.Patients_Datum?.first_name} ${a.Patients_Datum?.last_name}`,
          start: new Date(`${a.date}T${a.start_time}`),
          end: new Date(`${a.date}T${a.end_time}`),
          allDay: false,
          type: "appointment"
        }));

        const formattedAvailabilities = avails.map((a) => ({
          title: "Disponibil",
          start: new Date(`${a.date}T${a.start_time}`),
          end: new Date(`${a.date}T${a.end_time}`),
          allDay: false,
          type: "availability"
        }));

        setEvents([...formattedAppointments, ...formattedAvailabilities]);
      } catch (err) {
        console.error("Eroare la încărcare calendar:", err);
      }
    };

    load();
  }, []);

  return (
    <div className="calendar-container">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        view={currentView}
        onView={setCurrentView}
        views={["week", "day", "agenda"]}
        style={{ height: 600 }}
        onSelectEvent={(event) => {
          setSelectedEvent(event);
          setShowModal(true);
        }}
        messages={{
          week: "Săptămână",
          day: "Zi",
          agenda: "Toate",
          today: "Astăzi",
          previous: "Înapoi",
          next: "Înainte"
        }}
        eventPropGetter={(event) => {
          const backgroundColor = event.type === "appointment" ? "#ff6b6b" : "#63c76a";
          return {
            style: {
              backgroundColor,
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "0.85rem",
              padding: "2px 4px"
            }
          };
        }}
      />

      <div className="calendar-legend">
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: "#ff6b6b" }}></span>
          <span>Programare</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: "#63c76a" }}></span>
          <span>Disponibil</span>
        </div>
      </div>

      {showModal && selectedEvent && (
        <div className="calendar-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="calendar-modal" onClick={(e) => e.stopPropagation()}>
            <h3>{selectedEvent.type === "appointment" ? "Detalii programare" : "Detalii disponibilitate"}</h3>
            <p><strong>Titlu:</strong> {selectedEvent.title}</p>
            <p><strong>Data:</strong> {selectedEvent.start.toLocaleDateString()}</p>
            <p><strong>Ora:</strong> {selectedEvent.start.toLocaleTimeString()} - {selectedEvent.end.toLocaleTimeString()}</p>
            <button onClick={() => setShowModal(false)}>Închide</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorCalendarView;
