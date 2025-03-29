const API_URL = "http://localhost:8080/api/patients";

export const getAllPatients = async () => {
  const res = await fetch(`${API_URL}`, { credentials: "include" });
  if (!res.ok) throw new Error("Eroare la obținerea pacienților.");
  return await res.json();
};

export const getPatientById = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, { credentials: "include" });
  if (!res.ok) throw new Error("Eroare la detalii pacient.");
  return await res.json();
};

export const getPatientMedicalHistory = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}/medical-history`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Eroare la încărcarea fișelor.");
    }

    return await response.json();
  } catch (error) {
    console.error("Eroare la preluare fișe medicale:", error);
    throw error;
  }
};

export const addPrescription = async ({ medical_history_id, content }) => {
  try {
    const response = await fetch("${API_URL}/prescription", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ medical_history_id, content }),
    });

    if (!response.ok) {
      throw new Error("Eroare la adăugarea rețetei.");
    }

    return await response.json();
  } catch (error) {
    console.error("Eroare la POST prescription:", error);
    throw error;
  }
};
