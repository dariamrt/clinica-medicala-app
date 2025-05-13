import React, { useEffect, useState } from "react";
import { ReportService } from "@services";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "@styles/components/ReportCard.css";

const DoctorPerformanceReport = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const result = await ReportService.getDoctorPerformanceReport();
        setReportData(result.doctorPerformanceReport || []);
      } catch (err) {
        console.error("Eroare la obtinerea performantei doctorilor:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPerformance();
  }, []);

  const handleSave = async () => {
    try {
      await ReportService.saveReport({
        report_type: "doctor_performance",
        content: { performance: reportData },
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      alert("Eroare la salvarea raportului.");
    }
  };

  const handleDownloadPDF = async () => {
    const reportElement = document.querySelector(".report-box") || document.querySelector(".report-modal-content");
    if (!reportElement) return;

    const canvas = await html2canvas(reportElement);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("raport.pdf");
  };

  return (
    <div className="report-box">
      <h3>Performanța doctorilor</h3>
      {loading ? (
        <p>Se încarcă...</p>
      ) : reportData.length === 0 ? (
        <p>Nu există date disponibile.</p>
      ) : (
        <>
          <div className="scroll-table-wrapper">
            <table className="report-table styled-table">
              <thead>
                <tr>
                  <th>Doctor</th>
                  <th>Număr programări</th>
                  <th>Status programări</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((doc, idx) => (
                  <tr key={idx}>
                    <td>{doc.first_name} {doc.last_name}</td>
                    <td>{doc.total_appointments}</td>
                    <td>{doc.appointment_status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="report-actions">
            <button onClick={handleSave}>Salvează raportul</button>
            <button onClick={handleDownloadPDF}>Descarcă PDF</button>
            {saved && <p className="success-msg">Raport salvat cu succes!</p>}
          </div>
        </>
      )}
    </div>
  );
};

export default DoctorPerformanceReport;
