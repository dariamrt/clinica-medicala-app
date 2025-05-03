import React, { useEffect, useState } from "react";
import { ReportService } from "@services";

const PeakHoursReport = () => {
  const [peakHours, setPeakHours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await ReportService.getPeakAppointmentHours();
        setPeakHours(result.hours || []);
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
        type: "peak_hours",
        data: { hours: peakHours }
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      alert("Eroare la salvarea raportului.");
    }
  };

  return (
    <div className="report-box">
      <h3>Ore de vârf pentru programări</h3>
      {loading ? (
        <p>Se încarcă...</p>
      ) : (
        <>
          {peakHours.length > 0 ? (
            <ul>
              {peakHours.map((hour, idx) => (
                <li key={idx}>{hour}</li>
              ))}
            </ul>
          ) : (
            <p>Nu au fost găsite ore de vârf.</p>
          )}

          <button onClick={handleSave}>Salvează raportul</button>
          {saved && <p className="success-msg">Raport salvat cu succes!</p>}
        </>
      )}
    </div>
  );
};

export default PeakHoursReport;
