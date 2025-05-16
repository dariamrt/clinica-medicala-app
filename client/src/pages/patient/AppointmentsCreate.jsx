import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "@styles/pages/AppointmentsCreate.css";
import { AppointmentSuccessModal } from "@components";

import * as service from "@services";

const AppointmentsCreate = () => {
  const navigate = useNavigate();
  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeId, setSelectedTimeId] = useState(null);
  const [reimbursedByCAS, setReimbursedByCAS] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [appointmentInfo, setAppointmentInfo] = useState(null);


  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const data = await service.SpecialtyService.getAllSpecialties();
        setSpecialties(data);
      } catch (error) {
        console.error("Eroare la încărcarea specializărilor:", error);
      }
    };
    fetchSpecialties();
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        if (selectedSpecialty) {
          const data = await service.DoctorService.getDoctorsBySpecialty(selectedSpecialty);
          setDoctors(data);
        } else {
          setDoctors([]);
        }
      } catch (error) {
        console.error("Eroare la încărcarea doctorilor:", error);
      }
    };
    fetchDoctors();
  }, [selectedSpecialty]);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        if (selectedDoctor) {
          const data = await service.AvailabilityService.getDoctorAvailability(selectedDoctor);
          setAvailability(data);
        } else {
          setAvailability([]);
        }
      } catch (error) {
        console.error("Eroare la încărcarea disponibilităților:", error);
      }
    };
    fetchAvailability();
  }, [selectedDoctor]);

  const availableDates = availability.map((item) => item.date);
  const selectedDayAvailability = availability.filter((item) => item.date === selectedDate);

  const handleConfirm = async () => {
    try {
      await service.AppointmentService.bookAppointment({
        availability_id: selectedTimeId,
        reimbursed_by_CAS: reimbursedByCAS,
      });

      const time = availability.find((item) => item.id === selectedTimeId)?.start_time.slice(0, 5);
      setAppointmentInfo({
        date: selectedDate,
        time,
        reimbursed: reimbursedByCAS,
      });
      setSuccessModal(true);
    } catch (error) {
      console.error("Eroare la programare:", error);
    }
  };
  return (
  <div className="page-wrapper">
      <div className="medical-page-container">
        <h2 className="page-title">Creare programare</h2>
  
        <div className="form-group">
          <label>Specializare</label>
          <select value={selectedSpecialty} onChange={(e) => setSelectedSpecialty(e.target.value)}>
            <option value="">Selectează o specializare</option>
            {specialties.map((spec) => (
              <option key={spec.id} value={spec.id}>
                {spec.name}
              </option>
            ))}
          </select>
        </div>
  
        <div className="form-group">
          <label>Doctor</label>
          <select value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)}>
            <option value="">Selectează un doctor</option>
            {doctors.map((doc) => (
              <option key={doc.user_id} value={doc.user_id}>
                {doc.first_name} {doc.last_name}
              </option>
            ))}
          </select>
        </div>
  
        <div className="calendar-time-container">
          <div className={`calendar-section ${!selectedDoctor ? "calendar-disabled" : ""}`}>
            <label>Data</label>
            <Calendar
              onChange={(date) => {
                if (!selectedDoctor) return;
                const iso = date.toISOString().split("T")[0];
                setSelectedDate(iso);
                setSelectedTimeId(null);
              }}
              value={selectedDate ? new Date(selectedDate) : null}
              tileClassName={({ date }) =>
                availableDates.includes(date.toISOString().split("T")[0])
                  ? "available-date"
                  : "unavailable-date"
              }
              tileDisabled={({ date }) =>
                !selectedDoctor || !availableDates.includes(date.toISOString().split("T")[0])
              }
            />
          </div>
  
          {selectedDoctor && selectedDate && (
            <div className="time-picker">
              <label>Oră</label>
              <div className="time-options">
                {selectedDayAvailability.length === 0 ? (
                  <p>Nu există ore disponibile.</p>
                ) : (
                  selectedDayAvailability.map((slot) => (
                    <button
                      key={slot.id}
                      className={`time-btn ${selectedTimeId === slot.id ? "selected" : ""}`}
                      onClick={() => setSelectedTimeId(slot.id)}
                    >
                      {slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
  
        <div className="checkbox-cas">
          <input
            type="checkbox"
            checked={reimbursedByCAS}
            onChange={() => setReimbursedByCAS((prev) => !prev)}
          />
          <label>Decont CAS</label>
        </div>
  
        <button
          className="submit-btn"
          onClick={() => setConfirmModal(true)}
          disabled={!selectedTimeId}
        >
          Finalizează programarea
        </button>
  
        <button className="back-btn" onClick={() => navigate("/dashboard-patient")}>
          <ArrowLeft size={18} /> Înapoi
        </button>
  
        {confirmModal && (
          <div className="confirm-modal" onClick={() => setConfirmModal(false)}>
            <div className="confirm-box" onClick={(e) => e.stopPropagation()}>
              <p>
                Confirmați programarea din data de <strong>{selectedDate}</strong> la ora{" "}
                <strong>
                  {
                    availability.find((item) => item.id === selectedTimeId)?.start_time.slice(0, 5)
                  }
                </strong>
                ?
              </p>
              <div className="confirm-actions">
                <button onClick={handleConfirm}>Confirm</button>
                <button onClick={() => setConfirmModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {successModal && appointmentInfo && (
          <AppointmentSuccessModal
            date={appointmentInfo.date}
            time={appointmentInfo.time}
            reimbursed={appointmentInfo.reimbursed}
            onClose={() => setSuccessModal(false)}
            onViewAppointments={() => {
              setSuccessModal(false);
              navigate("/patient/appointments");
            }}
          />
        )}

      </div>
  </div>
  );

};

export default AppointmentsCreate;
