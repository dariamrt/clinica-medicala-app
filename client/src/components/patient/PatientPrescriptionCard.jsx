import { jsPDF } from "jspdf";
import "@styles/components/PrescriptionCard.css";
import { Download, FileText, Calendar, User, Pill } from "lucide-react";

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

  const address = pacient?.address || "Nespecificată";
  const cnp = pacient?.CNP || "Nespecificat";
  const idPrescripiton = prescription?.id || "N/A";

  const medicamente = Array.isArray(parsed.meds)
    ? parsed.meds.join(", ")
    : parsed.meds || "Nespecificat";

  const instructiuni = parsed.instructions || "Nespecificat";

  const handleDownloadPDF = () => {
    const pdf = new jsPDF();
    pdf.setFont("courier", "normal");
    pdf.setFontSize(12);

    const lineHeight = 8;
    let y = 20;

    pdf.text("Clinica MedAria", 105, y, { align: "center" });
    y += lineHeight;
    pdf.text("Șoseaua Pavel D. Kiseleff 2, Sector 1, București", 105, y, { align: "center" });
    y += lineHeight;
    pdf.text("Tel: (+40) 740 123 456", 105, y, { align: "center" });
    y += lineHeight * 2;

    pdf.text(`Nume și prenume: ${pacientName}`, 10, y);
    y += lineHeight;
    pdf.text(`CNP: ${cnp}`, 10, y);
    y += lineHeight;
    pdf.text(`Adresă: ${address}`, 10, y);
    y += lineHeight;
    pdf.text(`Nr. fișă: ${idPrescripiton}`, 10, y);
    y += lineHeight;

    pdf.text(`Diagnostic: ${prescription?.Medical_History?.diagnosis || "Nespecificat"}`, 10, y);
    y += lineHeight * 2;

    pdf.text("Rp./", 10, y);
    y += lineHeight;

    const medList = medicamente.split(", ");
    medList.forEach(med => {
      pdf.text(`• ${med}`, 15, y);
      y += lineHeight;
    });

    y += lineHeight;
    pdf.text(`Instrucțiuni: ${instructiuni}`, 10, y);
    y += lineHeight * 3;

    pdf.text("Semnătura și parafa medicului", 150, y);
    y += lineHeight * 2;

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
        <h3>Rețetă Medicală</h3>
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
