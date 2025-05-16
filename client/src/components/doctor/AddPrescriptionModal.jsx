import { useState } from "react";
import { PatientService } from "@services";
import "@styles/layout/Modal.css";

const AddPrescriptionModal = ({ medicalHistoryId, onClose, onSuccess }) => {
  const [medications, setMedications] = useState("");
  const [instructions, setInstructions] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleMedicationsChange = (e) => {
    setMedications(e.target.value);
    if (error) setError("");
  };

  const handleInstructionsChange = (e) => {
    setInstructions(e.target.value);
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!medications.trim()) {
      setError("Medicamentele sunt obligatorii");
      return;
    }
    
    if (!instructions.trim()) {
      setError("Instrucțiunile sunt obligatorii");
      return;
    }
    
    setIsSubmitting(true);
    try {
      // parsing as array ====> comma separated !!!!
      const medsArray = medications
        .split(',')
        .map(med => med.trim())
        .filter(med => med.length > 0);
      
      const payload = {
        medical_history_id: medicalHistoryId,
        content: { 
          meds: medsArray,
          instructions: instructions.trim()
        }
      };
      
      await PatientService.addPrescription(payload);
      
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error("Eroare la adăugare rețetă:", err);
      setError("A apărut o eroare la salvarea rețetei. Încercați din nou.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3>Adaugă rețetă</h3>
        
        <form onSubmit={handleSubmit} className="prescription-form">
          <div className="form-group">
            <label htmlFor="medications">
              Medicamente <span className="required">*</span>
            </label>
            <textarea
              id="medications"
              value={medications}
              onChange={handleMedicationsChange}
              placeholder="Introduceți medicamentele separate prin virgulă (ex: Paracetamol 500mg, Ibuprofen 200mg, Vitamina C)"
              rows={3}
              className={error ? "input-error" : ""}
            />
            <small style={{ color: '#666', fontSize: '0.8rem', display: 'block', marginTop: '0.25rem' }}>
              * Separați medicamentele prin virgulă
            </small>
          </div>
          
          <div className="form-group">
            <label htmlFor="instructions">
              Instrucțiuni <span className="required">*</span>
            </label>
            <textarea
              id="instructions"
              value={instructions}
              onChange={handleInstructionsChange}
              placeholder="Introduceți instrucțiunile pentru pacient (ex: Câte o tabletă la 8 ore, după masă)"
              rows={3}
              className={error ? "input-error" : ""}
            />
          </div>
          
          {error && <p className="error-message">{error}</p>}
          
          <div className="modal-actions">
            <button 
              type="submit" 
              className="primary-btn" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Se salvează..." : "Salvează"}
            </button>
            <button 
              type="button" 
              className="secondary-btn" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Anulează
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPrescriptionModal;