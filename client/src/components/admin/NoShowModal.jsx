import "@styles/layout/Modal.css";

const NoShowModal = ({ isOpen, onClose, title, message, type = "info" }) => {
  if (!isOpen) return null;

  const getTypeClass = (type) => {
    switch (type) {
      case "success": return "success";
      case "error": return "error";
      case "warning": return "warning";
      default: return "info";
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <div className={`modal-message ${getTypeClass(type)}`}>
          <p>{message}</p>
        </div>
        <div className="modal-actions">
          <button className="primary-btn" onClick={onClose}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoShowModal;