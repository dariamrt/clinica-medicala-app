import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MedicalHistoryCard, DoctorNavbar } from "@components";
import { PatientService } from "@services";
import AddPrescriptionModal from "@components/doctor/AddPrescriptionModal";
import { ArrowLeft } from "lucide-react";
import "@styles/pages/MedicalRecords.css";

const MedicalRecords = () => {
  const { id: patientId } = useParams();
  const [records, setRecords] = useState([]);
  const [selectedHistoryId, setSelectedHistoryId] = useState(null);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const data = await PatientService.getPatientMedicalHistory(patientId);
      setRecords(data);
    } catch (error) {
      console.error("Eroare la preluare fișe medicale:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [patientId]);

  const handleAddPrescription = async (data) => {
    try {
      await PatientService.addPrescriptionToHistory(selectedHistoryId, data);
      setShowPrescriptionModal(false);
      setSelectedHistoryId(null);
      await fetchData();
    } catch (error) {
      console.error("Eroare la adăugarea rețetei:", error);
    }
  };

  return (
    <>
      <DoctorNavbar />
      <div className="medical-records-container">
        <h2 className="records-title">Fișe medicale pacient</h2>

        {records.length === 0 ? (
          <p className="empty-msg">Nu există fișe medicale.</p>
        ) : (
          <div className="records-grid">
            {records.map((record) => (
              <MedicalHistoryCard
                key={record.id}
                record={record}
                userRole="doctor"
                onAddPrescription={() => {
                  setSelectedHistoryId(record.id);
                  setShowPrescriptionModal(true);
                }}
              />
            ))}
          </div>
        )}

        <button
          className="back-btn"
          onClick={() => navigate(`/doctor/patient/${patientId}`)}
        >
          <ArrowLeft size={18} />
          Înapoi
        </button>


        {showPrescriptionModal && (
          <AddPrescriptionModal
            onClose={() => setShowPrescriptionModal(false)}
            onSubmit={handleAddPrescription}
          />
        )}
      </div>
    </>
  );
};

export default MedicalRecords;
