import React, { useState } from "react";
import { ReportService } from "@services";

const PredictNoShowReport = () => {
  const [formData, setFormData] = useState({
    age: "",
    gender: "female",
    date: ""
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePredict = async () => {
    setLoading(true);
    try {
      const result = await ReportService.predictAppointmentNoShow(formData);
      setPrediction(result);
    } catch (err) {
      alert("Eroare la prezicerea programării.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await ReportService.saveReport({
        type: "predict_no_show",
        data: { input: formData, prediction }
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      alert("Eroare la salvarea raportului.");
    }
  };

  return (
    <div className="report-box">
      <h3>Prezicere neprezentare programare</h3>
      <div className="form-group">
        <label>Vârstă</label>
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
          placeholder="Ex: 35"
          required
        />
      </div>

      <div className="form-group">
        <label>Gen</label>
        <select name="gender" value={formData.gender} onChange={handleChange}>
          <option value="female">Femeie</option>
          <option value="male">Bărbat</option>
        </select>
      </div>

      <div className="form-group">
        <label>Dată programare</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
      </div>

      <button onClick={handlePredict} disabled={loading}>
        {loading ? "Se prelucrează..." : "Prezice"}
      </button>

      {prediction && (
        <>
          <p className="result-msg">
            Probabilitatea neprezentării: <strong>{prediction.probability}%</strong>
          </p>
          <button onClick={handleSave}>Salvează raportul</button>
          {saved && <p className="success-msg">Raport salvat cu succes!</p>}
        </>
      )}
    </div>
  );
};

export default PredictNoShowReport;
