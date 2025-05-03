const API_URL = "http://localhost:8080/api/patients";

export const getAllPatients = async () => {
  const res = await fetch(`${API_URL}`, { credentials: "include" });
  if (!res.ok) throw new Error("Eroare la obtinerea pacientilor.");
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
      throw new Error("Eroare la incarcarea fișelor.");
    }

    return await response.json();
  } catch (error) {
    console.error("Eroare la preluare fise medicale:", error);
    throw error;
  }
};

export const getPatientPrescriptions = async (id) => {
  const response = await fetch(`${API_URL}/${id}/prescriptions`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) throw new Error("Eroare la incarcarea retetelor.");
  return await response.json();
};

export const addMedicalNote = async (data) => {
  const response = await fetch(`${API_URL}/medical-note`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Eroare la adaugarea fisei medicale.");
  return await response.json();
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
      throw new Error("Eroare la adaugarea retete.");
    }

    return await response.json();
  } catch (error) {
    console.error("Eroare la adaugat prescr:", error);
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
    throw new Error(`Eroare get my appts: ${errorText}`);
  }

  return await res.json();
};

export const getPatientAppointments = async (id) => {
  const res = await fetch(`${API_URL}/${id}/appointments`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Eroare la obtinerea programarilor.");
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
    throw new Error(`Eroare la preluarea fiselor medicale: ${errorText}`);
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
    throw new Error(`Eroare la obtinerea retetelor: ${errorText}`);
  }

  return await res.json();
};

