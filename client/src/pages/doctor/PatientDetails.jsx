import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MedicalHistoryCard, PatientCard, AddMedicalHistoryModal, AddPrescriptionModal } from "@components";
import { PatientService, AuthService } from "@services";
import { ArrowLeft, UserCheck, FilePlus, Clock } from "lucide-react";
import "@styles/pages/PatientDetails.css";

const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [selectedRecordId, setSelectedRecordId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await AuthService.getCurrentUser();
      setUserRole(user.role);

      const patientData = await PatientService.getPatientById(id);
      const historyData = await PatientService.getPatientMedicalHistory(id);

      setPatient(patientData);
      const sortedHistory = historyData.sort((a, b) => 
        new Date(b.date) - new Date(a.date)
      );
      setMedicalHistory(sortedHistory.slice(0, 3));
    } catch (error) {
      console.error("Eroare la încărcare detalii pacient:", error);
      setError("Nu s-au putut încărca datele pacientului. Vă rugăm încercați din nou.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleSeeAll = () => {
    navigate(`/doctor/patient/${id}/records`);
  };

  const handleBack = () => {
    navigate("/doctor/patients");
  };

  const handleAddPrescription = (recordId) => {
    setSelectedRecordId(recordId);
    setShowPrescriptionModal(true);
  };

  const handleModalSuccess = () => {
    fetchData(); 
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
                  <>
                    <PatientCard patient={patient} detailView={true} />
                    {userRole === "doctor" && (
                      <button 
                        className="primary-btn add-history-btn" 
                        onClick={() => setShowHistoryModal(true)}
                      >
                        <FilePlus size={18} />
                        Adaugă fișă medicală
                      </button>
                    )}
                  </>
                )}
              </div>

              <div className="right-panel">
                <div className="panel-header">
                  <h3>
                    <Clock size={18} className="panel-header-icon" />
                    Fișe medicale recente
                  </h3>
                  
                  {medicalHistory.length > 0 && (
                    <button className="secondary-btn see-all-btn" onClick={handleSeeAll}>
                      Vezi toate
                    </button>
                  )}
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
                        userRole={userRole}
                        onAddPrescription={handleAddPrescription}
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

      {showHistoryModal && (
        <AddMedicalHistoryModal
          patientId={id}
          onClose={() => setShowHistoryModal(false)}
          onSuccess={handleModalSuccess}
        />
      )}

      {showPrescriptionModal && (
        <AddPrescriptionModal
          medicalHistoryId={selectedRecordId}
          onClose={() => setShowPrescriptionModal(false)}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  );
};

export default PatientDetails;