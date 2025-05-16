import React, { useState } from "react";
import { MedicalHistoryService } from "@services";
import "@styles/layout/Modal.css";

const AddMedicalHistoryModal = ({ patientId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    diagnosis: "",
    description: "",
    notes: ""
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.diagnosis.trim()) {
      newErrors.diagnosis = "Diagnosticul este obligatoriu";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Descrierea este obligatorie";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      await MedicalHistoryService.addMedicalHistory(patientId, {
        diagnosis: formData.diagnosis,
        description: formData.description,
        notes: formData.notes,
        date: new Date().toISOString().split("T")[0]
      });
      
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error("Eroare la salvare:", error);
      setErrors({ submit: "A apărut o eroare la salvare. Încercați din nou." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3>Adaugă fișă medicală</h3>
        
        <form onSubmit={handleSubmit} className="medical-history-form">
          <div className="form-group">
            <label htmlFor="diagnosis">Diagnostic <span className="required">*</span></label>
            <input
              type="text"
              id="diagnosis"
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleChange}
              className={errors.diagnosis ? "input-error" : ""}
              placeholder="Introduceți diagnosticul"
            />
            {errors.diagnosis && <p className="error-message">{errors.diagnosis}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Descriere <span className="required">*</span></label>
            <textarea
              id="description"
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              className={errors.description ? "input-error" : ""}
              placeholder="Descrieți starea pacientului și detalii despre diagnostic"
            />
            {errors.description && <p className="error-message">{errors.description}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="notes">Observații</label>
            <textarea
              id="notes"
              name="notes"
              rows="3"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Observații adiționale (opțional)"
            />
          </div>

          {errors.submit && <p className="error-message submit-error">{errors.submit}</p>}

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

export default AddMedicalHistoryModal;