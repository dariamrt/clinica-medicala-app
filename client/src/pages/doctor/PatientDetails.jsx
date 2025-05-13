import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MedicalHistoryCard, PatientCard, AddMedicalHistoryModal, AddPrescriptionModal } from "@components";
import { PatientService, AuthService } from "@services";
import { ArrowLeft } from "lucide-react";
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await AuthService.getCurrentUser();
        setUserRole(user.role);

        const patientData = await PatientService.getPatientById(id);
        const historyData = await PatientService.getPatientMedicalHistory(id);

        setPatient(patientData);
        setMedicalHistory(historyData.slice(0, 3));
      } catch (error) {
        console.error("Eroare la încărcare detalii pacient:", error);
      }
    };

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

  return (
    <>
      <div className="patient-details-container">
        <div className="patient-details-header">
        <h2 className="page-title">Detalii pacient</h2>
        </div>

        <div className="patient-details-content">
          <div className="left-panel">
            {patient && <PatientCard patient={patient} />}
            {userRole === "doctor" && (
              <button className="primary-btn" onClick={() => setShowHistoryModal(true)}>
                Adaugă fișă medicală
              </button>
            )}
          </div>

          <div className="right-panel">
            <h3>Fișe medicale recente</h3>
            {medicalHistory.length === 0 ? (
              <p>Nu există fișe medicale.</p>
            ) : (
              <>
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
                <button className="secondary-btn" onClick={handleSeeAll}>
                  Vezi toate
                </button>
              </>
            )}
          </div>
        </div>

        <div className="back-button" onClick={handleBack}>
          <ArrowLeft size={20} />
          <span>Înapoi</span>
        </div>
      </div>

      {showHistoryModal && (
        <AddMedicalHistoryModal
          patientId={id}
          onClose={() => setShowHistoryModal(false)}
        />
      )}

      {showPrescriptionModal && (
        <AddPrescriptionModal
          medicalHistoryId={selectedRecordId}
          onClose={() => setShowPrescriptionModal(false)}
        />
      )}
    </>
  );
};

export default PatientDetails;
