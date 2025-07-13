import { CheckCircle } from "lucide-react";
import "@styles/layout/Modal.css";

const SuccessModal = ({ message, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div style={{ textAlign: "center" }}>
          <CheckCircle size={64} strokeWidth={1.5} color="green" style={{ marginBottom: "1rem" }} />
          <h3>Succes</h3>
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

export default SuccessModal;