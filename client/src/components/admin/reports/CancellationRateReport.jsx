import React, { useEffect, useState } from "react";
import { ReportService } from "@services";

const CancellationRateReport = () => {
  const [cancellationRate, setCancellationRate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await ReportService.getAppointmentCancellationRate();
        setCancellationRate(result.rate);
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
        type: "cancellation_rate",
        data: { rate: cancellationRate }
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      alert("Eroare la salvarea raportului.");
    }
  };

  return (
    <div className="report-box">
      <h3>Rata de anulare a programărilor</h3>
      {loading ? (
        <p>Se încarcă...</p>
      ) : (
        <div>
          <p><strong>{cancellationRate}%</strong> din programări au fost anulate.</p>
          <button onClick={handleSave}>Salvează raportul</button>
          {saved && <p className="success-msg">Raport salvat cu succes!</p>}
        </div>
      )}
    </div>
  );
};

export default CancellationRateReport;
