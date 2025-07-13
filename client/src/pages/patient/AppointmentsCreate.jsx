import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader } from "lucide-react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "@styles/pages/AppointmentsCreate.css";
import { AppointmentSuccessModal, ErrorModal } from "@components";
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
  const [errorModal, setErrorModal] = useState({ show: false, message: "" });
  const [appointmentInfo, setAppointmentInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingSpecialties, setLoadingSpecialties] = useState(true);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [loadingAvailability, setLoadingAvailability] = useState(false);

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        setLoadingSpecialties(true);
        const data = await service.SpecialtyService.getAllSpecialties();
        setSpecialties(data);
      } catch (error) {
        console.error("Error fetching specialties:", error);
        setErrorModal({ 
          show: true, 
          message: "Eroare la încărcarea specializărilor. Vă rugăm să reîncărcați pagina." 
        });
      } finally {
        setLoadingSpecialties(false);
      }
    };
    fetchSpecialties();
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        if (selectedSpecialty) {
          setLoadingDoctors(true);
          const data = await service.DoctorService.getDoctorsBySpecialty(selectedSpecialty);
          setDoctors(data);
        } else {
          setDoctors([]);
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setErrorModal({ 
          show: true, 
          message: "Eroare la încărcarea doctorilor. Vă rugăm să selectați din nou specializarea." 
        });
        setDoctors([]);
      } finally {
        setLoadingDoctors(false);
      }
    };
    fetchDoctors();
  }, [selectedSpecialty]);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        if (selectedDoctor) {
          setLoadingAvailability(true);
          const data = await service.AvailabilityService.getDoctorAvailability(selectedDoctor);
          setAvailability(data);
        } else {
          setAvailability([]);
        }
      } catch (error) {
        console.error("Error fetching availability:", error);
        setErrorModal({ 
          show: true, 
          message: "Eroare la încărcarea disponibilităților. Vă rugăm să selectați din nou doctorul." 
        });
        setAvailability([]);
      } finally {
        setLoadingAvailability(false);
      }
    };
    fetchAvailability();
  }, [selectedDoctor]);

  const availableDates = availability.map((item) => item.date);
  const selectedDayAvailability = availability.filter((item) => item.date === selectedDate);

  const handleSpecialtyChange = (e) => {
    setSelectedSpecialty(e.target.value);
    setSelectedDoctor("");
    setSelectedDate(null);
    setSelectedTimeId(null);
    setAvailability([]);
    setDoctors([]);
  };

  const handleDoctorChange = (e) => {
    setSelectedDoctor(e.target.value);
    setSelectedDate(null);
    setSelectedTimeId(null);
    setAvailability([]);
  };

  const handleDateChange = (date) => {
    if (!selectedDoctor) return;
    const iso = date.toISOString().split("T")[0];
    setSelectedDate(iso);
    setSelectedTimeId(null);
  };

  const handleConfirm = async () => {
    if (!selectedTimeId) {
      setErrorModal({ 
        show: true, 
        message: "Vă rugăm să selectați o oră pentru programare." 
      });
      return;
    }

    try {
      setLoading(true);
      await service.AppointmentService.bookAppointment({
        availability_id: selectedTimeId,
        reimbursed_by_CAS: reimbursedByCAS,
      });
      
      const selectedSlot = availability.find((item) => item.id === selectedTimeId);
      const selectedDoctorData = doctors.find((doc) => doc.user_id === selectedDoctor);
      
      setAppointmentInfo({ 
        date: selectedDate, 
        time: selectedSlot?.start_time.slice(0, 5),
        reimbursed: reimbursedByCAS,
        doctorName: selectedDoctorData ? `${selectedDoctorData.first_name} ${selectedDoctorData.last_name}` : ""
      });
      
      setConfirmModal(false);
      setSuccessModal(true);
    } catch (error) {
      console.error("Error booking appointment:", error);
      setConfirmModal(false);
      
      let errorMessage = "A apărut o eroare la programare. Vă rugăm să încercați din nou.";
      
      if (error.message) {
        try {
          const errorData = JSON.parse(error.message);
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = error.message;
        }
      }
      
      setErrorModal({ show: true, message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseErrorModal = () => {
    setErrorModal({ show: false, message: "" });
  };

  const handleCloseSuccessModal = () => {
    setSuccessModal(false);
    setAppointmentInfo(null);
  };

  const handleViewAppointments = () => {
    setSuccessModal(false);
    navigate("/patient/appointments");
  };

  const isFormValid = selectedSpecialty && selectedDoctor && selectedDate && selectedTimeId;

  return (
    <div className="page-wrapper">
      <div className="medical-page-container">
        <h2 className="page-title">Creare programare</h2>
        
        <div className="form-group">
          <label>Specializare</label>
          <select 
            value={selectedSpecialty} 
            onChange={handleSpecialtyChange}
            disabled={loadingSpecialties}
          >
            <option value="">
              {loadingSpecialties ? "Se încarcă..." : "Selectează o specializare"}
            </option>
            {specialties.map((spec) => (
              <option key={spec.id} value={spec.id}>{spec.name}</option>
            ))}
          </select>
          {loadingSpecialties && <Loader className="loading-spinner" />}
        </div>

        <div className="form-group">
          <label>Doctor</label>
          <select 
            value={selectedDoctor} 
            onChange={handleDoctorChange}
            disabled={!selectedSpecialty || loadingDoctors}
          >
            <option value="">
              {loadingDoctors ? "Se încarcă..." : "Selectează un doctor"}
            </option>
            {doctors.map((doc) => (
              <option key={doc.user_id} value={doc.user_id}>
                {doc.first_name} {doc.last_name}
              </option>
            ))}
          </select>
          {loadingDoctors && <Loader className="loading-spinner" />}
        </div>

        <div className="calendar-time-container">
          <div className={`calendar-section ${!selectedDoctor ? "calendar-disabled" : ""}`}>
            <label>Data</label>
            {loadingAvailability ? (
              <div className="loading-container">
                <Loader className="loading-spinner" />
                <p>Se încarcă disponibilitățile...</p>
              </div>
            ) : (
              <Calendar
                onChange={handleDateChange}
                value={selectedDate ? new Date(selectedDate) : null}
                tileClassName={({ date }) =>
                  availableDates.includes(date.toISOString().split("T")[0]) ? "available-date" : "unavailable-date"
                }
                tileDisabled={({ date }) =>
                  !selectedDoctor || !availableDates.includes(date.toISOString().split("T")[0])
                }
                minDate={new Date()}
              />
            )}
          </div>

          {selectedDoctor && selectedDate && !loadingAvailability && (
            <div className="time-picker">
              <label>Oră</label>
              <div className="time-options">
                {selectedDayAvailability.length === 0 ? (
                  <p>Nu există ore disponibile pentru această dată.</p>
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
            onChange={(e) => setReimbursedByCAS(e.target.checked)} 
          />
          <label>Decont CAS</label>
        </div>

        <button 
          className="submit-btn" 
          onClick={() => setConfirmModal(true)} 
          disabled={!isFormValid || loading}
        >
          {loading ? "Se procesează..." : "Finalizează programarea"}
        </button>

        <button className="back-btn" onClick={() => navigate("/dashboard-patient")}>
          <ArrowLeft size={18} /> Înapoi
        </button>

        {confirmModal && (
          <div className="modal-overlay" onClick={() => setConfirmModal(false)}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
              <h3>Confirmare programare</h3>
              <div className="confirmation-details">
                <p><strong>Specializare:</strong> {specialties.find(s => s.id === selectedSpecialty)?.name}</p>
                <p><strong>Doctor:</strong> {doctors.find(d => d.user_id === selectedDoctor)?.first_name} {doctors.find(d => d.user_id === selectedDoctor)?.last_name}</p>
                <p><strong>Data:</strong> {selectedDate}</p>
                <p><strong>Ora:</strong> {availability.find((item) => item.id === selectedTimeId)?.start_time.slice(0, 5)} - {availability.find((item) => item.id === selectedTimeId)?.end_time.slice(0, 5)}</p>
                <p><strong>Decont CAS:</strong> {reimbursedByCAS ? "Da" : "Nu"}</p>
              </div>
              <div className="modal-actions">
                <button className="primary-btn" onClick={handleConfirm} disabled={loading}>
                  {loading ? "Se procesează..." : "Confirmă"}
                </button>
                <button className="secondary-btn" onClick={() => setConfirmModal(false)}>
                  Anulează
                </button>
              </div>
            </div>
          </div>
        )}

        {successModal && appointmentInfo && (
          <AppointmentSuccessModal
            date={appointmentInfo.date}
            time={appointmentInfo.time}
            reimbursed={appointmentInfo.reimbursed}
            doctorName={appointmentInfo.doctorName}
            onClose={handleCloseSuccessModal}
            onViewAppointments={handleViewAppointments}
          />
        )}

        {errorModal.show && (
          <ErrorModal
            message={errorModal.message}
            onClose={handleCloseErrorModal}
          />
        )}
      </div>
    </div>
  );
};

export default AppointmentsCreate;