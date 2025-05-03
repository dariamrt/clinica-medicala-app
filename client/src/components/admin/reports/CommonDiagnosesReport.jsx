import React, { useEffect, useState } from "react";
import { ReportService } from "@services";

const CommonDiagnosesReport = () => {
  const [diagnoses, setDiagnoses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await ReportService.getCommonDiagnoses();
        setDiagnoses(result.diagnoses || []);
      } catch (err) {
        console.error("Eroare la obtinerea diagnosticului:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSave = async () => {
    try {
      await ReportService.saveReport({
        type: "common_diagnoses",
        data: { diagnoses }
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      alert("Eroare la salvarea raportului.");
    }
  };

  return (
    <div className="report-box">
      <h3>Diagnosticuri frecvente</h3>
      {loading ? (
        <p>Se încarcă...</p>
      ) : (
        <>
          {diagnoses.length > 0 ? (
            <ul>
              {diagnoses.map((diag, idx) => (
                <li key={idx}>
                  {diag.name} – {diag.count} cazuri
                </li>
              ))}
            </ul>
          ) : (
            <p>Nu există date despre diagnosticuri.</p>
          )}

          <button onClick={handleSave}>Salvează raportul</button>
          {saved && <p className="success-msg">Raport salvat cu succes!</p>}
        </>
      )}
    </div>
  );
};

export default CommonDiagnosesReport;
