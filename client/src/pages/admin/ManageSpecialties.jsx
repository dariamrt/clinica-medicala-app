import { useEffect, useState } from "react";
import { SpecialtyService } from "@services";
import { useNavigate } from "react-router-dom";
import "@styles/pages/ManageSpecialties.css";

const ManageSpecialties = () => {
  const [specialties, setSpecialties] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSpecialties();
  }, []);

  const fetchSpecialties = async () => {
    try {
      const data = await SpecialtyService.getAllSpecialties();
      setSpecialties(data);
    } catch (err) {
      console.error("Eroare la incarcat specializari:", err);
    }
  };

  const handleUpdate = async (id) => {
    try {
      await SpecialtyService.updateSpecialty(id, { name: editValue });
      setEditId(null);
      fetchSpecialties();
    } catch (err) {
      alert("Eroare la actualizare.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await SpecialtyService.deleteSpecialty(id);
      setConfirmDelete(null);
      fetchSpecialties();
    } catch (err) {
      alert("Eroare la ștergere.");
    }
  };

  const confirmDeleteSpec = specialties.find((s) => s.id === confirmDelete);

  return (
    <div className="page-wrapper">
      <div className="medical-page-container">
        <h2 className="page-title">Gestionare specializări</h2>
        <div className="specialty-list">
          {specialties.map((spec) => (
            <div key={spec.id} className="specialty-card">
              {editId === spec.id ? (
                <>
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    id="specialty-input"
                  />
                  <button onClick={() => handleUpdate(spec.id)}>Salvează</button>
                  <button onClick={() => setEditId(null)}>Anulează</button>
                </>
              ) : (
                <>
                  <h4 onClick={() => navigate(`/doctor/specialties/${spec.id}`)} className="specialty-name-link">
                    {spec.name}
                  </h4>
                  <div className="actions">
                    <button onClick={() => { setEditId(spec.id); setEditValue(spec.name); }}>Editează</button>
                    <button onClick={() => setConfirmDelete(spec.id)}>Șterge</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      {confirmDeleteSpec && (
        <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <p>Sigur doriți să ștergeți specializarea <strong>{confirmDeleteSpec.name}</strong>?</p>
            <p className="warning">ATENȚIE! Această acțiune va șterge și toți medicii aferenți!</p>
            <div className="modal-actions">
              <button className="btn-confirm" onClick={() => handleDelete(confirmDeleteSpec.id)}>CONFIRM</button>
              <button className="btn-cancel" onClick={() => setConfirmDelete(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageSpecialties;
