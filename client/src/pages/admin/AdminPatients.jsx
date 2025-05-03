import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PatientService } from "@services";
import { PatientCard } from "@components";
import "@styles/pages/AdminPatients.css";

const AdminPatients = () => {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await PatientService.getAllPatients();
        setPatients(data);
      } catch (err) {
        console.error("Eroare la obtinerea pacientilor:", err);
      }
    };

    fetchPatients();
  }, []);

  const filteredPatients = patients.filter((p) => {
    const fullName = `${p.first_name} ${p.last_name}`.toLowerCase();
    return (
      fullName.includes(search.toLowerCase()) ||
      p.email?.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="admin-patients-page">
      <h2 className="page-title">Pacienți înregistrați</h2>

      <input
        type="text"
        placeholder="Caută după nume sau email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      <div className="patients-grid">
        {filteredPatients.map((patient) => (
          <PatientCard
            key={patient.user_id}
            patient={patient}
            onClick={() => navigate(`/admin/patient/${patient.user_id}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default AdminPatients;
