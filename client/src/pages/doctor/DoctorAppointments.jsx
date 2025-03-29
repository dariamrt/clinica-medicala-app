import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DoctorNavbar, AppointmentItem } from "@components";
import { DoctorService, AuthService } from "@services";
import { ArrowLeft } from "lucide-react";
import "@styles/pages/DoctorAppointments.css";

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const user = await AuthService.getCurrentUser();
        const data = await DoctorService.getDoctorAppointments(user.id);
        setAppointments(data);
        setFiltered(data);
      } catch (error) {
        console.error("Eroare:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  useEffect(() => {
    let filteredList = [...appointments];
    if (searchName) {
      filteredList = filteredList.filter(appt =>
        `${appt.Patients_Datum?.first_name || ""} ${appt.Patients_Datum?.last_name || ""}`
          .toLowerCase()
          .includes(searchName.toLowerCase())
      );
    }
    if (searchEmail) {
      filteredList = filteredList.filter(appt =>
        appt.Patients_Datum?.User?.email?.toLowerCase().includes(searchEmail.toLowerCase())
      );
    }
    if (searchDate) {
      filteredList = filteredList.filter(appt => appt.date === searchDate);
    }
    if (searchStatus) {
      filteredList = filteredList.filter(appt =>
        appt.status.toLowerCase().includes(searchStatus.toLowerCase())
      );
    }
    setFiltered(filteredList);
  }, [searchName, searchEmail, searchDate, searchStatus, appointments]);

  return (
    <>
       <DoctorNavbar />
      <div className="doctor-appointments-page">
      <div className="appointments-container">
        <h2 className="appointments-title">Programările mele</h2>

        <div className="appointments-filters">
          <input
            type="text"
            placeholder="Caută după nume..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Caută după email..."
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
          />
          <input
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
          />
          <input
            type="text"
            placeholder="Caută după status..."
            value={searchStatus}
            onChange={(e) => setSearchStatus(e.target.value)}
          />
        </div>

        {loading ? (
          <p className="loading-text">Se încarcă programările...</p>
        ) : filtered.length === 0 ? (
          <p className="no-appointments">Nu există programări conform filtrului.</p>
        ) : (
          <div className="appointments-list">
            {filtered.map((appt) => (
              <AppointmentItem key={appt.id} appointment={appt} />
            ))}
          </div>
        )}

        <button className="back-button" onClick={() => navigate("/dashboard-doctor")}>
          <ArrowLeft size={18} />
          Înapoi
        </button>
      </div>
    </div>

    </>
  );
};

export default DoctorAppointments;
