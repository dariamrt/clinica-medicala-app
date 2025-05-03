const API_URL = "http://localhost:8080/api/availability";

export const getDoctorAvailability = async (doctorId) => {
  const res = await fetch(`${API_URL}/doctor/${doctorId}`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Eroare la obtinerea disponibiltatilor.");
  return await res.json();
};

export const getDoctorAvailableDates = async (doctorId) => {
  const res = await fetch(`${API_URL}/doctor/${doctorId}`);
  if (!res.ok) throw new Error("Eroare la obtinerea datelor disponibile.");
  return await res.json();
};

export const getDoctorAvailableTimes = async (doctorId, date) => {
  const res = await fetch(`${API_URL}/doctor/${doctorId}/date/${date}`);
  if (!res.ok) throw new Error("Eroare la obtinerea orelor disponibile.");
  return await res.json();
};

// for admin
export const addAvailability = async (data) => {
  const res = await fetch(`${API_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify(data)
  });

  if (!res.ok) throw new Error("Eroare la adaugarea disponibilitatilor.");
  return await res.json();
};

export const deleteAvailability = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    credentials: "include"
  });

  if (!res.ok) throw new Error("Eroare la stergerea disponibilitatilor.");
};
