const API_URL = "http://localhost:8080/api/patients";

export const addMedicalHistory = async (patientId, data) => {
  const res = await fetch(`${API_URL}/medical-note`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...data, patient_id: patientId }),
  });
  if (!res.ok) throw new Error("Eroare la adaugarea fisei medicale.");
  return await res.json();
};