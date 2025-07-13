import React, { useState } from "react";
import { CancelAppointmentModal, ErrorModal, SuccessModal } from "@components";
import { AppointmentService } from "@services";

const PatientAppointmentItem = ({ appointment, onCancel }) => {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCancelClick = () => {
    if (!canCancel()) {
      setErrorMessage("Programarea poate fi anulată doar cu minimum 24 de ore înainte de data programării.");
      setShowErrorModal(true);
      return;
    }
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async () => {
    setIsLoading(true);
    try {
      const response = await AppointmentService.cancelAppointment(appointment.id);
      
      setShowCancelModal(false);
      setShowSuccessModal(true);
      
      // Call onCancel to refresh the appointment list
      onCancel(); 
    } catch (error) { 
      setShowCancelModal(false);
      setErrorMessage("A apărut o eroare la anularea programării. Vă rugăm să încercați din nou.");
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModals = () => {
    setShowCancelModal(false);
    setShowErrorModal(false);
    setShowSuccessModal(false);
    setErrorMessage("");
  };

  const canCancel = () => {
    if (appointment.status !== 'confirmed') return false;
    
    const appointmentDateTime = new Date(`${appointment.date}T${appointment.start_time}`);
    const now = new Date();
    const hoursUntil = (appointmentDateTime - now) / (1000 * 60 * 60);
    
    return hoursUntil >= 24;
  };

  return (
    <div className="appointment-detail-card">
      <h3>Detalii programare</h3>
      <p><strong>Doctor:</strong> Dr. {appointment.Doctors_Datum?.first_name} {appointment.Doctors_Datum?.last_name}</p>
      <p><strong>Data:</strong> {appointment.date}</p>
      <p><strong>Ora:</strong> {appointment.start_time.slice(0, 5)} - {appointment.end_time.slice(0, 5)}</p>
      <p><strong>Status:</strong> <span className={`status ${appointment.status}`}>{appointment.status}</span></p>
      
      {appointment.status === 'confirmed' && (
        <button 
          className="primary-btn" 
          onClick={handleCancelClick}
          disabled={isLoading}
          style={{ 
            backgroundColor: canCancel() ? 'var(--red)' : '#ccc', 
            marginTop: '1rem' 
          }}
        >
          {isLoading ? 'Se anulează...' : 'Anulează'}
        </button>
      )}

      {showCancelModal && (
        <CancelAppointmentModal
          onConfirm={handleConfirmCancel}
          onClose={handleCloseModals}
        />
      )}

      {showErrorModal && (
        <ErrorModal
          message={errorMessage}
          onClose={handleCloseModals}
        />
      )}

      {showSuccessModal && (
        <SuccessModal
          message="Programarea a fost anulată cu succes!"
          onClose={handleCloseModals}
        />
      )}
    </div>
  );
};

export default PatientAppointmentItem;