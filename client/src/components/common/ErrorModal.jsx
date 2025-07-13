import { XCircle } from "lucide-react";
import "@styles/layout/Modal.css";

const ErrorModal = ({ message, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div style={{ textAlign: "center" }}>
          <XCircle size={64} strokeWidth={1.5} color="red" style={{ marginBottom: "1rem" }} />
          <h3>Eroare</h3>
        </div>
        <div className="form-group">
          <p>{message}</p>
        </div>
        <div className="modal-actions">
          <button className="primary-btn" onClick={onClose}>Închide</button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;