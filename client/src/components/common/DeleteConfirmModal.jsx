import "@styles/layout/Modal.css";

const DeleteConfirmModal = ({ onCancel, onConfirm }) => {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3>Confirmare ștergere</h3>
        <p>Sunteți sigur(ă) că doriți să ștergeți această notificare?</p>
        <div className="modal-actions">
          <button className="secondary-btn" onClick={onCancel}>
            Anulează
          </button>
          <button className="primary-btn" onClick={onConfirm}>
            Șterge
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;