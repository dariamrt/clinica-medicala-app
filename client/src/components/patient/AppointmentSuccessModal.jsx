import { CheckCircle } from "lucide-react";
import "@styles/layout/Modal.css";

const AppointmentSuccessModal = ({ date, time, reimbursed, onClose, onViewAppointments }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div style={{ textAlign: "center" }}>
          <CheckCircle size={64} strokeWidth={1.5} color="green" style={{ marginBottom: "1rem" }} />
          <h3>Programare confirmată</h3>
        </div>

        <div className="form-group">
          <p><strong>Data:</strong> {date}</p>
          <p><strong>Ora:</strong> {time}</p>
          <p><strong>Decont CAS:</strong> {reimbursed ? "Da" : "Nu"}</p>
        </div>

        <div className="modal-actions">
          <button className="primary-btn" onClick={onViewAppointments}>
            Vezi programările mele
          </button>
          <button className="secondary-btn" onClick={onClose}>
            Închide
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentSuccessModal;
