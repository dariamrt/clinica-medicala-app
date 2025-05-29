import React, { useEffect, useState } from "react";
import { PatientMedicalHistoryCard } from "@components";
import { PatientService } from "@services";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PatientMedicalHistory = () => {
  const [records, setRecords] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await PatientService.getMyMedicalHistory();
        setRecords(data);
      } catch (error) {
        console.error("Eroare la preluare fișe medicale:", error);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="page-wrapper">
      <div className="medical-page-container">
        <h2 className="page-title">Istoricul meu medical</h2>
        {records.length === 0 ? (
          <p className="empty-msg">Nu există fișe medicale disponibile.</p>
        ) : (
          <div className="medical-list">
            {records.map((record) => (
              <PatientMedicalHistoryCard key={record.id} record={record} />
            ))}
          </div>
        )}
        <button className="back-btn" onClick={() => navigate("/dashboard-patient")}>
          <ArrowLeft size={18} /> Înapoi
        </button>
      </div>
    </div>
  );
};

export default PatientMedicalHistory;
