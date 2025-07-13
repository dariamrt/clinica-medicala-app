import "@styles/layout/Modal.css";

const CancelAppointmentModal = ({ onConfirm, onClose }) => (
  <div className="modal-overlay cancel-modal" onClick={onClose}>
    <div className="modal-card" onClick={(e) => e.stopPropagation()}>
      <h3>Confirmă anularea</h3>
      <p>Sigur dorești să anulezi această programare? Acțiunea nu poate fi anulată.</p>
      <div className="modal-actions">
        <button className="primary-btn" onClick={onConfirm}>Confirmă anularea</button>
        <button className="secondary-btn" onClick={onClose}>Renunță</button>
      </div>
    </div>
  </div>
);

export default CancelAppointmentModal;