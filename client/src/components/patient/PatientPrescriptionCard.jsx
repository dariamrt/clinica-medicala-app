import "@styles/components/PrescriptionCard.css";
import { Download, FileText, Calendar, User, Pill } from "lucide-react";

const PatientPrescriptionCard = ({ prescription, content, createdAt, doctorName, appointmentDate }) => {
  let parsed;

  const getDoctorName = () => {
    if (doctorName) return doctorName;
    
    if (prescription) {
      if (prescription.Doctors_Datum?.first_name && prescription.Doctors_Datum?.last_name) {
        return `${prescription.Doctors_Datum.first_name} ${prescription.Doctors_Datum.last_name}`;
      }
      
      if (prescription.doctor_name) return prescription.doctor_name;
      if (prescription.doctor && prescription.doctor.name) return prescription.doctor.name;
      if (prescription.Doctor && prescription.Doctor.first_name && prescription.Doctor.last_name) {
        return `${prescription.Doctor.first_name} ${prescription.Doctor.last_name}`;
      }
      
      if (prescription.MedicalHistory) {
        if (prescription.MedicalHistory.Doctors_Datum?.first_name && prescription.MedicalHistory.Doctors_Datum?.last_name) {
          return `${prescription.MedicalHistory.Doctors_Datum.first_name} ${prescription.MedicalHistory.Doctors_Datum.last_name}`;
        }
        if (prescription.MedicalHistory.doctor_name) return prescription.MedicalHistory.doctor_name;
        if (prescription.MedicalHistory.Doctor && prescription.MedicalHistory.Doctor.first_name && prescription.MedicalHistory.Doctor.last_name) {
          return `${prescription.MedicalHistory.Doctor.first_name} ${prescription.MedicalHistory.Doctor.last_name}`;
        }
      }
    }
    
    return 'Necunoscut';
  };

  try {
    parsed = typeof content === "string" ? JSON.parse(content) : content;
  } catch {
    parsed = null;
  }

  if (!parsed || typeof parsed !== "object") {
    return <div className="prescription-card">Conținut invalid</div>;
  }

  const medicamente = Array.isArray(parsed.meds)
    ? parsed.meds.join(", ")
    : parsed.meds || "Nespecificat";

  const instructiuni = parsed.instructions || "Nespecificat";

  const handleDownloadPDF = () => {
    const pdfContent = `
REȚETĂ MEDICALĂ

Doctor: ${doctorName || "Nespecificat"}
Data programării: ${appointmentDate ? new Date(appointmentDate).toLocaleDateString("ro-RO") : "Nespecificată"}
Data emiterii: ${new Date(createdAt).toLocaleDateString("ro-RO")}

MEDICAMENTE PRESCRISE:
${medicamente}

INSTRUCȚIUNI:
${instructiuni}

---
Această rețetă a fost generată electronic.
    `.trim();

    const blob = new Blob([pdfContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reteta-${new Date(createdAt).toLocaleDateString("ro-RO").replace(/\./g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="prescription-card">
      <div className="prescription-header">
        <div className="prescription-icon">
          <FileText size={32} />
        </div>
        <h3>Rețetă Medicală</h3>
      </div>
      
      <div className="prescription-info">
        <div className="info-row">
          <div className="info-item">
            <User size={18} />
            <span><strong>Doctor:</strong> Dr. {getDoctorName()}</span>
          </div>
          {appointmentDate && (
            <div className="info-item">
              <Calendar size={18} />
              <span><strong>Data programării:</strong> {new Date(appointmentDate).toLocaleDateString("ro-RO")}</span>
            </div>
          )}
        </div>
        
        <div className="info-item">
          <Calendar size={18} />
          <span><strong>Data emiterii:</strong> {new Date(createdAt).toLocaleDateString("ro-RO")}</span>
        </div>

        <div className="medications-section">
          <div className="info-item">
            <Pill size={18} />
            <span><strong>Medicamente:</strong></span>
          </div>
          <div className="medications-list">
            {medicamente}
          </div>
        </div>

        <div className="instructions-section">
          <span><strong>Instrucțiuni:</strong></span>
          <div className="instructions-text">
            {instructiuni}
          </div>
        </div>
      </div>

      <div className="prescription-actions">
        <button className="download-btn" onClick={handleDownloadPDF} type="button">
          <Download size={18} />
          Descarcă rețeta
        </button>
      </div>
    </div>
  );
};

export default PatientPrescriptionCard;