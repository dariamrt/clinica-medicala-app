import React, { useEffect, useState } from "react";
import { ReportService } from "@services";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const PeakHoursReport = () => {
  const [peakHours, setPeakHours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await ReportService.getPeakAppointmentHours();
        setPeakHours(result.peakHours || []);
      } catch (err) {
        console.error("Eroare la preluarea orelor de varf:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSave = async () => {
    try {
      await ReportService.saveReport({
        report_type: "peak_hours",
        content: { hours: peakHours },
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
      <h3>Ore de vârf pentru programări</h3>
      {loading ? (
        <p>Se încarcă...</p>
      ) : (
        <>
          {peakHours.length > 0 ? (
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={peakHours} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p>Nu au fost găsite ore de vârf.</p>
          )}

          <button onClick={handleSave}>Salvează raportul</button>
          <button onClick={handleDownloadPDF}>Descarcă PDF</button>
          {saved && <p className="success-msg">Raport salvat cu succes!</p>}
        </>
      )}
    </div>
  );
};

export default PeakHoursReport;
