import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PatientService } from "@services";
import "@styles/pages/PatientsList.css";

const AdminPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      try {
        const data = await PatientService.getAllPatients();
        setPatients(data);
      } catch (err) {
        console.error("Eroare la obținerea pacienților:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const filteredPatients = patients.filter((patient) => {
    const fullName = `${patient.first_name} ${patient.last_name}`.toLowerCase();
    const email = patient.email?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();
    
    return fullName.includes(search) || email.includes(search);
  });

  const handleViewPatient = (patient) => {
    navigate(`/admin/patient/${patient.user_id}`);
  };

  return (
    <div className="page-wrapper">
      <div className="medical-page-container">
        <div className="main-layout-content">
          <h1 className="page-title">
            <span className="title-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="8.5" cy="7" r="4"></circle>
              </svg>
            </span>
            Gestionare Pacienți
          </h1>

          <div className="search-container">
            <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              className="search-input"
              placeholder="Caută după nume sau email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <div>Se încarcă pacienții...</div>
            </div>
          ) : filteredPatients.length === 0 ? (
            <div className="no-results">
              {searchTerm ? (
                <>
                  <p>Nu s-au găsit pacienți pentru căutarea "{searchTerm}"</p>
                  <button className="back-button" onClick={() => setSearchTerm("")}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="19" y1="12" x2="5" y2="12"></line>
                      <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    Resetează căutarea
                  </button>
                </>
              ) : (
                <p>Nu există pacienți înregistrați în sistem.</p>
              )}
            </div>
          ) : (
            <div className="table">
              <div className="table-header">
                <span>Nume</span>
                <span>Email</span>
                <span>Telefon</span>
                <span>Acțiuni</span>
              </div>
              {filteredPatients.map((patient) => (
                <div 
                  key={patient.user_id} 
                  className="patient-row"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    padding: "15px",
                    borderBottom: "1px solid var(--mint)",
                    alignItems: "center"
                  }}
                >
                  <span style={{padding: "0 10px"}}>
                    {patient.first_name} {patient.last_name}
                  </span>
                  <span style={{padding: "0 10px"}}>
                    {patient.email || "—"}
                  </span>
                  <span style={{padding: "0 10px"}}>
                    {patient.phone_number || "—"}
                  </span>
                  <span style={{padding: "0 10px"}}>
                    <button 
                      onClick={() => handleViewPatient(patient)}
                      style={{
                        backgroundColor: "var(--blue)",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        padding: "8px 16px",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px"
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                      Vezi detalii
                    </button>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPatients;