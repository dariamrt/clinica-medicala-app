import { useEffect, useState } from "react";
import { AvailabilityService } from "@services";
import "@styles/layout/Modal.css";

const ManageAvailabilityModal = ({ doctor, onClose }) => {
  const [availability, setAvailability] = useState([]);
  const [date, setDate] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [error, setError] = useState("");

  const fetchAvailability = async () => {
    try {
      const data = await AvailabilityService.getDoctorAvailability(doctor.user_id);
      setAvailability(data);
    } catch (err) {
      console.error("Eroare la incarcarea disponibilitatilor:", err);
      setError("Nu s-au putut incarca disponibilitatile.");
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, [doctor]);

  const handleAdd = async () => {
    if (!date || !start || !end) {
      setError("Completează toate campurile!");
      return;
    }
    
    try {
      await AvailabilityService.addAvailability({
        doctor_id: doctor.user_id,
        date,
        start_time: start,
        end_time: end
      });
      await fetchAvailability();
      setDate("");
      setStart("");
      setEnd("");
      setError("");
    } catch (err) {
      console.error("Eroare la adăugare disponibilitate:", err);
      setError("Eroare la adăugare disponibilitate.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Sunteți sigur(ă) că vrei să ștergi această disponibilitate?")) return;
    try {
      await AvailabilityService.deleteAvailability(id);
      await fetchAvailability();
    } catch (err) {
      console.error("Eroare la ștergere disponibilitate:", err);
      setError("Eroare la ștergerea disponibilității.");
    }
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ro-RO', options);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3>Disponibilități pentru Dr. {doctor.first_name} {doctor.last_name}</h3>
        
        {error && <div className="submit-error">{error}</div>}
        
        <div style={{ marginBottom: "1.5rem" }}>
          <div className="form-group">
            <label>Data <span className="required">*</span></label>
            <input 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          
          <div style={{ display: "flex", gap: "1rem" }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Ora început <span className="required">*</span></label>
              <input 
                type="time" 
                value={start} 
                onChange={(e) => setStart(e.target.value)} 
              />
            </div>
            
            <div className="form-group" style={{ flex: 1 }}>
              <label>Ora sfârșit <span className="required">*</span></label>
              <input 
                type="time" 
                value={end} 
                onChange={(e) => setEnd(e.target.value)} 
              />
            </div>
          </div>
          
          <button 
            className="primary-btn" 
            style={{ width: "100%" }}
            onClick={handleAdd}
          >
            Adaugă disponibilitate
          </button>
        </div>

        <div style={{ 
          maxHeight: "250px", 
          overflowY: "auto", 
          border: "1px solid #eee", 
          borderRadius: "8px", 
          padding: "0.5rem" 
        }}>
          {availability.length === 0 ? (
            <p style={{ textAlign: "center", padding: "1rem" }}>
              Nu există disponibilități înregistrate.
            </p>
          ) : (
            <ul style={{ 
              listStyle: "none", 
              padding: 0, 
              margin: 0 
            }}>
              {availability.map((slot) => (
                <li key={slot.id} style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center",
                  padding: "0.75rem",
                  borderBottom: "1px solid #eee"
                }}>
                  <div>
                    <strong>{formatDate(slot.date)}</strong>
                    <div>{slot.start_time} - {slot.end_time}</div>
                  </div>
                  <button 
                    onClick={() => handleDelete(slot.id)}
                    style={{ 
                      background: "#ff6b6b", 
                      color: "white",
                      border: "none",
                      padding: "0.4rem 0.8rem",
                      borderRadius: "6px",
                      cursor: "pointer"
                    }}
                  >
                    Șterge
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="modal-actions" style={{ marginTop: "1.5rem" }}>
          <button className="secondary-btn" onClick={onClose}>Închide</button>
        </div>
      </div>
    </div>
  );
};

export default ManageAvailabilityModal;