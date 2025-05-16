const API_URL = "http://localhost:8080/api/doctors";

export const getDoctorsBySpecialty = async (specialtyId) => {
  const res = await fetch(`${API_URL}/specialty/${specialtyId}`, {
    method: "GET",
    credentials: "include"
  });

  if (res.status === 404) return []; 

  if (!res.ok) throw new Error("Eroare la obtinerea doctorilor.");
  
  return await res.json();
};

export const getDoctorAppointments = async (doctorId) => {
  try {
    const response = await fetch(`${API_URL}/${doctorId}/appointments`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Nu s-au putut obtine programarilore.");
    }

    return await response.json();
  } catch (error) {
    console.error("Eroare la fetch-ul progr:", error);
    throw error;
  }
};

export const getMyAppointments = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/me/appointments`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (!res.ok) {
    throw new Error("Eroare la obtinerea programarilor doctorului.");
  }

  return await res.json();
};

export const getMyAvailabilities = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/me/availabilities`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (!res.ok) {
    throw new Error("Eroare la obtinerea disp doctorului.");
  }

  return await res.json();
};

export const getAllDoctors = async () => {
  const res = await fetch(`${API_URL}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Eroare la incarcarea doctorilor.");
  return await res.json();
};

export const getDoctorById = async (doctorId) => {
  const res = await fetch(`${API_URL}/${doctorId}`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Eroare la preluarea datelor doctorului.");
  }

  return await res.json();
};