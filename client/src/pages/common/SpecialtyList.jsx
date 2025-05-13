import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SpecialtyService } from "@services";
import { ArrowLeft } from "lucide-react";
import { SpecialtyItem } from "@components/common";
import "@styles/pages/SpecialtyList.css";

const SpecialtyList = () => {
  const [specialties, setSpecialties] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const data = await SpecialtyService.getAllSpecialties();
        setSpecialties(data);
      } catch (err) {
        console.error("Eroare la încărcare:", err);
      }
    };
    fetchSpecialties();
  }, []);

  return (
    <div className="page-wrapper">
      <div className="medical-page-container">
        <h2 className="page-title">Specializări disponibile</h2>

        <div className="specialty-grid">
          {specialties.map((spec) => (
            <SpecialtyItem
              key={spec.id}
              name={spec.name}
              onClick={() => navigate(`/doctor/specialties/${spec.id}`)}
            />
          ))}
        </div>

        <button className="back-btn" onClick={() => navigate("/dashboard-doctor")}>
          <ArrowLeft size={18} />
          Înapoi
        </button>
      </div>
    </div>
  );
};

export default SpecialtyList;
