import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PatientService } from "@services";
import { PatientCard } from "@components";
import { ArrowLeft, Search, Users } from "lucide-react";
import "@styles/pages/PatientsList.css";

const PatientsList = () => {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      try {
        const data = await PatientService.getAllPatients();
        setPatients(data || []);
      } catch (err) {
        console.error("Eroare la încărcarea pacienților:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const filteredPatients = patients.filter((patient) => {
    const fullName = `${patient.first_name} ${patient.last_name} ${patient.email || ''}`.toLowerCase();
    return fullName.includes(search.toLowerCase());
  });

  return (
    <div className="page-wrapper">
      <div className="medical-page-container">
        <h2 className="page-title">
          <Users size={24} className="title-icon" />
          Pacienții mei
        </h2>
        
        <div className="search-container">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Caută după nume, prenume sau email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
            aria-label="Caută pacienți"
          />
        </div>

        {loading ? (
          <div className="loading-spinner">Se încarcă...</div>
        ) : (
          <div className="table">
            <div className="table-header">
              <span>Nume</span>
              <span>Prenume</span>
              <span>Email</span>
              <span>Telefon</span>
            </div>

            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => (
                <PatientCard
                  key={patient.user_id}
                  patient={patient}
                  onClick={() => navigate(`/doctor/patient/${patient.user_id}`)}
                />
              ))
            ) : (
              <div className="no-results">
                Nu a fost găsit niciun pacient care să corespundă criteriilor de căutare.
              </div>
            )}
          </div>
        )}

        <button 
          className="back-button" 
          onClick={() => navigate("/dashboard-doctor")}
          aria-label="Înapoi la dashboard"
        >
          <ArrowLeft size={18} />
          Înapoi la panou
        </button>
      </div>
    </div>
  );
};

export default PatientsList;