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

export const getMyAppointments = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/mine/appointments`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Eroare API: ${errorText}`);
  }

  return await res.json();
};

export const getMyMedicalHistory = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/mine/history`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Eroare la preluarea fișelor medicale: ${errorText}`);
  }

  return await res.json();
};

export const getMyPrescriptions = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/mine/prescriptions`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Eroare la preluarea rețetelor: ${errorText}`);
  }

  return await res.json();
};

