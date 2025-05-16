import React, { useEffect, useState } from "react";
import { PrescriptionService } from "@services";

const MedicalHistoryCard = ({ record, userRole, onAddPrescription, formattedDate }) => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const data = await PrescriptionService.getPrescriptionsByMedicalHistoryId(record.id);
        setPrescriptions(data);
      } catch (err) {
        console.error("Eroare la incarcarea retetelor:", err);
        setError("Nu s-au putut incarca retetele.");
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, [record.id]);

  const formatPrescriptionContent = (prescription) => {
    if (!prescription.content) {
      return { type: 'text', content: 'Continut indisponibil' };
    }

    try {
      let parsedContent = prescription.content;
      
      if (typeof parsedContent === "string") {
        try {
          parsedContent = JSON.parse(parsedContent);
        } catch (e) {
          return { type: 'text', content: prescription.content };
        }
      }

      if (parsedContent && typeof parsedContent === "object") {
        if (parsedContent.meds && Array.isArray(parsedContent.meds)) {
          return { 
            type: 'structured', 
            meds: parsedContent.meds,
            instructions: parsedContent.instructions || ''
          };
        }
        
        if (parsedContent.text && parsedContent.text.trim()) {
          return { type: 'text', content: parsedContent.text };
        }
        
        return { type: 'text', content: JSON.stringify(parsedContent) };
      }

      return { type: 'text', content: String(parsedContent) };
    } catch (e) {
      console.warn("Nu s-a putut procesa continutul retetei:", e);
      return { type: 'text', content: 'Continut indisponibil' };
    }
  };

  const formatDate = () => {
    if (formattedDate) return formattedDate;
    
    const dateValue = record.date || record.createdAt || record.record_date;
    
    if (!dateValue) return 'Data necunoscută';
    
    try {
      return new Date(dateValue).toLocaleDateString('ro-RO');
    } catch (e) {
      return 'Data invalidă';
    }
  };

  const getDoctorName = () => {
    if (record.doctor_name) return record.doctor_name;
    if (record.doctor && record.doctor.name) return record.doctor.name;
    if (record.Doctor && record.Doctor.first_name && record.Doctor.last_name) {
      return `${record.Doctor.first_name} ${record.Doctor.last_name}`;
    }
    return 'Necunoscut';
  };

  return (
    <div className="medical-history-card">
      <div className="medical-history-header">
        <div className="medical-history-date">
          {formatDate()}
        </div>
        <div className="medical-history-doctor">
          Dr. {getDoctorName()}
        </div>
      </div>
      
      <div className="medical-history-content">
        <p><strong>Diagnostic:</strong> {record.diagnosis}</p>
        <p><strong>Descriere:</strong> {record.description || record.notes || 'Fără descriere'}</p>
        
        <div className="prescriptions-section">
          <p><strong>Retete asociate:</strong></p>
          {loading ? (
            <p className="loading-text">Se incarca retetele...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : prescriptions.length === 0 ? (
            <p className="no-prescriptions">Nu exista retete pentru aceasta fisa.</p>
          ) : (
            <div className="prescriptions-list">
              {prescriptions.map((prescription) => {
                const formatted = formatPrescriptionContent(prescription);
                
                if (formatted.type === 'structured') {
                  return (
                    <div key={prescription.id} className="prescription-card">
                      <div className="prescription-meds">
                        <strong>Medicamente:</strong>
                        <ul className="meds-list">
                          {formatted.meds.map((med, index) => (
                            <li key={index}>{med}</li>
                          ))}
                        </ul>
                      </div>
                      {formatted.instructions && (
                        <div className="prescription-instructions">
                          <strong>Instructiuni:</strong>
                          <p>{formatted.instructions}</p>
                        </div>
                      )}
                    </div>
                  );
                } else {
                  return (
                    <div key={prescription.id} className="prescription-card">
                      <p>{formatted.content}</p>
                    </div>
                  );
                }
              })}
            </div>
          )}
        </div>
      </div>

      {userRole === "doctor" && (
        <button
          className="small-btn"
          onClick={() => onAddPrescription(record.id)}
        >
          Adauga reteta
        </button>
      )}
    </div>
  );
};

export default MedicalHistoryCard;