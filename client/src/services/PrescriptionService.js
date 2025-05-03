const API_URL = "http://localhost:8080/api/prescriptions";

export const addPrescription = async (medicalHistoryId, data) => {
  const res = await fetch(`${API_URL}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...data, medical_history_id: medicalHistoryId }),
  });
  if (!res.ok) throw new Error("Eroare la adaugarea retetei.");
  return await res.json();
};
