import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MedicalHistoryCard,
  PatientCard
} from "@components";
import { PatientService } from "@services";
import { ArrowLeft, UserCheck, Clock, FileText } from "lucide-react";
import "@styles/pages/PatientDetails.css"; 

const AdminPatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [patient, setPatient] = useState(null);
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const patientData = await PatientService.getPatientById(id);
      const historyData = await PatientService.getPatientMedicalHistory(id);
      const prescriptionsData = await PatientService.getPatientPrescriptions(id);
      
      setPatient(patientData);
      
      const sortedHistory = historyData.sort((a, b) => 
        new Date(b.date) - new Date(a.date)
      );
      setMedicalHistory(sortedHistory);
      
      const validPrescriptions = prescriptionsData.filter((item) => {
        try {
          const parsed = JSON.parse(item.content);
          return Array.isArray(parsed?.medicamente);
        } catch {
          return false;
        }
      });
      setPrescriptions(validPrescriptions);
    } catch (err) {
      console.error("Eroare la încărcare:", err);
      setError("Nu s-au putut încărca datele pacientului. Vă rugăm încercați din nou.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleBack = () => {
    navigate("/admin/patients");
  };

  return (
    <div className="page-wrapper">
      <div className="medical-page-container">
        <h2 className="page-title">
          <UserCheck size={24} className="page-title-icon" />
          Detalii pacient
        </h2>

        {error && (
          <div className="error-container">
            <p className="error-message">{error}</p>
            <button className="secondary-btn" onClick={fetchData}>Reîncarcă</button>
          </div>
        )}

        {isLoading ? (
          <div className="loading-indicator">Se încarcă...</div>
        ) : (
          <>
            <div className="patient-details-content">
              <div className="left-panel">
                {patient && (
                  <PatientCard patient={patient} detailView={true} />
                )}
              </div>

              <div className="right-panel">
                <div className="panel-header">
                  <h3>
                    <Clock size={18} className="panel-header-icon" />
                    Fișe medicale
                  </h3>
                </div>

                {medicalHistory.length === 0 ? (
                  <div className="no-records">
                    Nu există fișe medicale pentru acest pacient.
                  </div>
                ) : (
                  <div className="medical-preview">
                    {medicalHistory.map((record) => (
                      <MedicalHistoryCard
                        key={record.id}
                        record={record}
                        userRole="admin"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button className="back-btn" onClick={handleBack}>
              <ArrowLeft size={20} />
              <span>Înapoi la lista de pacienți</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPatientDetails;