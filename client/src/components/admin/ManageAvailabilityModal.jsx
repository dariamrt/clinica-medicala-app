import React, { useEffect, useState } from "react";
import { AvailabilityService } from "@services";
import "@styles/components/ManageAvailabilityModal.css";

const ManageAvailabilityModal = ({ doctor, onClose }) => {
  const [availability, setAvailability] = useState([]);
  const [date, setDate] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const fetchAvailability = async () => {
    try {
      const data = await AvailabilityService.getDoctorAvailableTimes(doctor.user_id);
      setAvailability(data);
    } catch (err) {
      console.error("Eroare la incarcarea disp:", err);
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, [doctor]);

  const handleAdd = async () => {
    if (!date || !start || !end) return alert("Completează toate câmpurile!");
    try {
      await AvailabilityService.add({
        doctor_id: doctor.user_id,
        date,
        start_time: start,
        end_time: end
      });
      fetchAvailability();
      setDate("");
      setStart("");
      setEnd("");
    } catch (err) {
      console.error("Eroare la adaugare disp:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Sunteți sigur(ă) că vrei să ștergi această disponibilitate?")) return;
    try {
      await AvailabilityService.remove(id);
      fetchAvailability();
    } catch (err) {
      console.error("Eroare la stergere avail:", err);
    }
  };

  return (
    <div className="availability-modal-overlay" onClick={onClose}>
      <div className="availability-modal" onClick={(e) => e.stopPropagation()}>
        <h3>Disponibilități pentru Dr. {doctor.first_name} {doctor.last_name}</h3>

        <div className="availability-form">
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <input type="time" value={start} onChange={(e) => setStart(e.target.value)} />
          <input type="time" value={end} onChange={(e) => setEnd(e.target.value)} />
          <button onClick={handleAdd}>Adaugă</button>
        </div>

        <div className="availability-list">
          {availability.length === 0 ? (
            <p>Nu există disponibilități înregistrate.</p>
          ) : (
            <ul>
              {availability.map((slot) => (
                <li key={slot.id}>
                  {slot.date} — {slot.start_time} - {slot.end_time}
                  <button className="remove-btn" onClick={() => handleDelete(slot.id)}>Șterge</button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button className="close-btn" onClick={onClose}>Închide</button>
      </div>
    </div>
  );
};

export default ManageAvailabilityModal;
