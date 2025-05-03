import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MedicalHistoryCard,
  PrescriptionCard
} from "@components";
import { PatientService } from "@services";
import { ArrowLeft } from "lucide-react";
import "@styles/pages/AdminPatientDetails.css";

const AdminPatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [history, setHistory] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const p = await PatientService.getPatientById(id);
        const h = await PatientService.getPatientMedicalHistory(id);
        const r = await PatientService.getPatientPrescriptions(id);
        setPatient(p);
        setHistory(h);
        setPrescriptions(r);
      } catch (err) {
        console.error("Eroare la incarcare:", err);
      }
    };

    fetchData();
  }, [id]);

  return (
    <div className="admin-patient-details-page">
      <h2 className="page-title">Detalii pacient</h2>

      {patient && (
        <div className="patient-info-card">
          <p><strong>Nume:</strong> {patient.first_name} {patient.last_name}</p>
          <p><strong>Email:</strong> {patient.email || "N/A"}</p>
          <p><strong>Telefon:</strong> {patient.phone_number || "N/A"}</p>
          <p><strong>Adresă:</strong> {patient.address || "N/A"}</p>
          <p><strong>CNP:</strong> {patient.CNP || "N/A"}</p>
          <p><strong>Sex:</strong> {patient.gender || "N/A"}</p>
        </div>
      )}

      <div className="section">
        <h3>Istoric medical</h3>
        {history.length === 0 ? (
          <p className="empty-msg">Nicio fișă medicală.</p>
        ) : (
          <div className="card-list">
            {history.map((item) => (
              <MedicalHistoryCard key={item.id} record={item} />
            ))}
          </div>
        )}
      </div>

      <div className="section">
        <h3>Rețete</h3>
        {prescriptions.length === 0 ? (
          <p className="empty-msg">Nicio rețetă disponibilă.</p>
        ) : (
          <div className="card-list">
            {prescriptions.map((item) => (
              <PrescriptionCard key={item.id} content={item.content} />
            ))}
          </div>
        )}
      </div>

      <button className="back-btn" onClick={() => navigate("/admin/patients")}>
        <ArrowLeft size={18} /> Înapoi
      </button>
    </div>
  );
};

export default AdminPatientDetails;
