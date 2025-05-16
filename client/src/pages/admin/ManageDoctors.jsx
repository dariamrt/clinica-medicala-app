import { useEffect, useState } from "react";
import { DoctorService } from "@services";
import { AddOrEditDoctorModal, ManageAvailabilityModal } from "@components";
import "@styles/pages/ManageDoctors.css";

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [availabilityModalOpen, setAvailabilityModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const data = await DoctorService.getAllDoctors();
      setDoctors(data);
    } catch (err) {
      console.error("Eroare la încărcarea doctorilor:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleAddClick = () => {
    setSelectedDoctor(null);
    setModalOpen(true);
  };

  const handleEditClick = (doctor) => {
    setSelectedDoctor(doctor);
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    await fetchDoctors();
  };

  const handleManageAvailability = (doctor) => {
    setSelectedDoctor(doctor);
    setAvailabilityModalOpen(true);
  };

  const filteredDoctors = doctors.filter(doc => {
    const fullName = `${doc.first_name} ${doc.last_name}`.toLowerCase();
    const specialty = doc.specialty?.name?.toLowerCase() || "";
    const email = doc.User?.email?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();
    
    return fullName.includes(search) || 
           specialty.includes(search) || 
           email.includes(search);
  });

  return (
   <div className="page-wrapper">
      <div className="medical-page-container">
      <div className="main-layout-content">
        <h1 className="page-title">Gestionare Doctori</h1>
        
        <div className="doctors-header">
          <button className="add-doctor-btn" onClick={handleAddClick}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Adaugă doctor
          </button>
        </div>

        <div className="search-section">
          <div className="search-container">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              placeholder="Caută după nume, email sau specializare..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="doctors-count">
            {filteredDoctors.length} {filteredDoctors.length === 1 ? "doctor" : "doctori"} 
            {searchTerm && ` pentru "${searchTerm}"`}
          </div>
        </div>

        <div className="doctors-table-container">
          {loading ? (
            <div className="loading-state">
              <svg className="spinner" viewBox="0 0 50 50">
                <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
              </svg>
              <p>Se încarcă...</p>
            </div>
          ) : filteredDoctors.length === 0 ? (
            <div className="empty-state">
              {searchTerm ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    <line x1="8" y1="11" x2="14" y2="11"></line>
                  </svg>
                  <p>Nu s-au găsit doctori pentru căutarea "<span>{searchTerm}</span>"</p>
                  <button className="reset-search" onClick={() => setSearchTerm("")}>
                    Resetează căutarea
                  </button>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="8.5" cy="7" r="4"></circle>
                    <line x1="20" y1="8" x2="20" y2="14"></line>
                    <line x1="23" y1="11" x2="17" y2="11"></line>
                  </svg>
                  <p>Nu există doctori înregistrați. Adăugați primul doctor folosind butonul de mai sus.</p>
                </>
              )}
            </div>
          ) : (
            <div className="doctors-table">
              <table>
                <thead>
                  <tr>
                    <th>Nume</th>
                    <th>Email</th>
                    <th>Telefon</th>
                    <th>Specializare</th>
                    <th>Acțiuni</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDoctors.map((doc) => (
                    <tr key={doc.user_id}>
                      <td className="doctor-name">
                        {doc.first_name} {doc.last_name}
                      </td>
                      <td>{doc.User?.email || "—"}</td>
                      <td>{doc.phone_number || "—"}</td>
                      <td>
                        {doc.Specialty?.name ? (
                          <span className="specialty-badge">
                            {doc.Specialty.name}
                          </span>
                        ) : "—"}
                      </td>
                      <td className="doctor-actions">
                        <button 
                          className="edit-btn"
                          onClick={() => handleEditClick(doc)}
                          title="Editează"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                          <span>Editează</span>
                        </button>
                        <button 
                          className="availability-btn"
                          onClick={() => handleManageAvailability(doc)}
                          title="Disponibilități"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                          </svg>
                          <span>Disponibilități</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {modalOpen && (
        <AddOrEditDoctorModal
          doctor={selectedDoctor}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
        />
      )}

      {availabilityModalOpen && (
        <ManageAvailabilityModal
          doctor={selectedDoctor}
          onClose={() => setAvailabilityModalOpen(false)}
        />
      )}
    </div>
    </div>

  );
};

export default ManageDoctors;