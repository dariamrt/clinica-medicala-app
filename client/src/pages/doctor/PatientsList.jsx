import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PatientService } from "@services";
import PatientCard from "@components/common/PatientCard";
import DoctorNavbar from "@components/doctor/DoctorNavbar";
import { ArrowLeft } from "lucide-react";
import "@styles/pages/PatientsList.css";

const PatientsList = () => {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await PatientService.getAllPatients();
        setPatients(data || []);
      } catch (err) {
        console.error("Eroare pacienți:", err);
      }
    };
    fetch();
  }, []);

  const filtered = patients.filter((p) => {
    const fullName = `${p.first_name} ${p.last_name} ${p.email}`.toLowerCase();
    return fullName.includes(search.toLowerCase());
  });

  return (
    <>
      <DoctorNavbar />
      <div className="patients-page">
        <h2>Pacienții mei</h2>
        <input
          type="text"
          placeholder="Caută după nume, prenume sau email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />

        <div className="table">
          <div className="table-header">
            <span>Nume</span>
            <span>Prenume</span>
            <span>Email</span>
            <span>Telefon</span>
          </div>

          {filtered.map((p) => (
            <PatientCard
              key={p.user_id}
              patient={p}
              onClick={() => navigate(`/doctor/patient/${p.user_id}`)}
            />
          ))}
        </div>

        <button className="back-button" onClick={() => navigate("/dashboard-doctor")}>
          <ArrowLeft size={18} />
          Înapoi
        </button>
      </div>
    </>
  );
};

export default PatientsList;
