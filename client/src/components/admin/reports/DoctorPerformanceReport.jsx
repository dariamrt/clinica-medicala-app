import React, { useEffect, useState } from "react";
import { ReportService } from "@services";

const DoctorPerformanceReport = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const result = await ReportService.getDoctorPerformanceReport();
        setReportData(result.performance || []);
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
        type: "doctor_performance",
        data: { performance: reportData }
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      alert("Eroare la salvarea raportului.");
    }
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
          <table className="report-table">
            <thead>
              <tr>
                <th>Doctor</th>
                <th>Număr programări</th>
                <th>Programări anulate</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((doc, idx) => (
                <tr key={idx}>
                  <td>{doc.doctor_name}</td>
                  <td>{doc.total_appointments}</td>
                  <td>{doc.cancelled_appointments}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleSave}>Salvează raportul</button>
          {saved && <p className="success-msg">Raport salvat cu succes!</p>}
        </>
      )}
    </div>
  );
};

export default DoctorPerformanceReport;
