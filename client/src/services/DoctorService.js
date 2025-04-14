const API_URL = "http://localhost:8080/api/doctors";

export const getDoctorsBySpecialty = async (specialtyId) => {
  const res = await fetch(`${API_URL}/specialty/${specialtyId}`, {
    method: "GET",
    credentials: "include"
  });

  if (res.status === 404) return []; 

  if (!res.ok) throw new Error("Eroare la obținerea doctorilor.");
  
  return await res.json();
};


export const getDoctorAppointments = async (doctorId) => {
  try {
    const response = await fetch(`${API_URL}/${doctorId}/appointments`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Nu s-au putut obține programările.");
    }

    return await response.json();
  } catch (error) {
    console.error("Eroare la fetch programări:", error);
    throw error;
  }
};

export const getMyAppointments = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/mine`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (!res.ok) {
    throw new Error("Eroare la obținerea programărilor doctorului.");
  }

  return await res.json();
};


