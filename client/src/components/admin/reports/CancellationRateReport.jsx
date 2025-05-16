import React, { useEffect, useState } from "react";
import { ReportService } from "@services";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const CancellationRateReport = () => {
  const [cancellationRate, setCancellationRate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await ReportService.getAppointmentCancellationRate();
        setCancellationRate(result.cancellationRate);
      } catch (err) {
        console.error("Eroare la preluarea ratei de anulare:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSave = async () => {
    try {
      await ReportService.saveReport({
        report_type: "cancellation_rate",
        content: { rate: cancellationRate }
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
      <h3>Rata de anulare a programărilor</h3>
      {loading ? (
        <p>Se încarcă...</p>
      ) : (
        <div>
          <p><strong>{cancellationRate}</strong> din programări au fost anulate.</p>
          <button onClick={handleSave}>Salvează raportul</button>
          <button onClick={handleDownloadPDF}>Descarcă PDF</button>
          {saved && <p className="success-msg">Raport salvat cu succes!</p>}
        </div>
      )}
    </div>
  );
};

export default CancellationRateReport;
