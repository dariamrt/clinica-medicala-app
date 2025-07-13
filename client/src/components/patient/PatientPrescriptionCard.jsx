import { Download, FileText, Calendar, User, Pill } from "lucide-react";
import jsPDF from "jspdf"; 

const PatientPrescriptionCard = ({ prescription, content, createdAt, appointmentDate }) => {
  let parsed;

  try {
    parsed = typeof content === "string" ? JSON.parse(content) : content;
  } catch {
    parsed = null;
  }

  if (!parsed || typeof parsed !== "object") {
    return <div className="prescription-card">Conținut invalid</div>;
  }

  const doctor = prescription?.Medical_History?.Doctors_Datum;
  const doctorName =
    doctor?.first_name && doctor?.last_name
      ? `${doctor.first_name} ${doctor.last_name}`
      : "Necunoscut";

  const pacient = prescription?.Medical_History?.Patients_Datum;
  const pacientName =
    pacient?.first_name && pacient?.last_name
      ? `${pacient.first_name} ${pacient.last_name}`
      : "Necunoscut";

  const address = pacient?.address || "Nespecificat";
  const cnp = pacient?.CNP || "Nespecificat";
  const idPrescripiton = prescription?.id || "N/A";

  const medicamente = Array.isArray(parsed.meds)
    ? parsed.meds.join(", ")
    : parsed.meds || "Nespecificat";

  const instructiuni = parsed.instructions || "Nespecificat";

  const handleDownloadPDF = () => {
    const pdf = new jsPDF();
    
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);

    const lineHeight = 8;
    let y = 20;

    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text("Clinica MedAria", 105, y, { align: "center" });
    y += lineHeight;
    
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.text("Soseaua Pavel D. Kiseleff 2, Sector 1, Bucuresti", 105, y, { align: "center" });
    y += lineHeight;
    pdf.text("Tel: (+40) 740 123 456", 105, y, { align: "center" });
    y += lineHeight * 2;

    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Nume: ${pacientName}`, 10, y);
    y += lineHeight;
    pdf.text(`CNP: ${cnp}`, 10, y);
    y += lineHeight;
    pdf.text(`Adresa: ${address}`, 10, y);
    y += lineHeight;
    pdf.text(`Nr.: ${idPrescripiton}`, 10, y);
    y += lineHeight;

    pdf.text(`Diagnostic: ${prescription?.Medical_History?.diagnosis || "Nespecificat"}`, 10, y);
    y += lineHeight * 2;

    pdf.setFont("helvetica", "bold");
    pdf.text("Rp./", 10, y);
    y += lineHeight;

    pdf.setFont("helvetica", "normal");
    const medList = medicamente.split(", ");
    medList.forEach(med => {
      pdf.text(`• ${med}`, 15, y);
      y += lineHeight;
    });

    y += lineHeight;
    pdf.text(`Instructiuni: ${instructiuni}`, 10, y);
    y += lineHeight * 3;

    pdf.text("Semnatura si parafa medicului", 150, y);
    y += lineHeight;
    pdf.setFont("helvetica", "bold");
    pdf.text(`Dr. ${doctorName}`, 150, y);
    y += lineHeight;

    pdf.setFont("helvetica", "normal");
    pdf.text(`Data: ${new Date(createdAt).toLocaleDateString("ro-RO")}`, 10, y);

    const fileName = `reteta-${new Date(createdAt).toLocaleDateString("ro-RO").replace(/\./g, '-')}.pdf`;
    pdf.save(fileName);
  };

  return (
    <div className="prescription-card">
      <div className="prescription-header">
        <div className="prescription-icon">
          <FileText size={32} />
        </div>
        <h3>Reteta Medicala</h3>
      </div>

      <div className="prescription-info">
        <div className="info-row">
          <div className="info-item">
            <User size={18} />
            <span><strong>Doctor:</strong> Dr. {doctorName}</span>
          </div>
          <div className="info-item">
            <User size={18} />
            <span><strong>Pacient:</strong> {pacientName}</span>
          </div>
          {appointmentDate && (
            <div className="info-item">
              <Calendar size={18} />
              <span><strong>Data programarii:</strong> {new Date(appointmentDate).toLocaleDateString("ro-RO")}</span>
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
          <span><strong>Instructiuni:</strong></span>
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