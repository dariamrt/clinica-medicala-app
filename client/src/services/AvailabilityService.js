const API_URL = "http://localhost:8080/api/availability";

export const getDoctorAvailability = async (doctorId) => {
  const res = await fetch(`${API_URL}/doctor/${doctorId}`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Eroare la obținerea disponibilităților.");
  return await res.json();
};

export const getDoctorAvailableDates = async (doctorId) => {
  const res = await fetch(`${API_URL}/doctor/${doctorId}`);
  if (!res.ok) throw new Error("Eroare la obținerea datelor disponibile.");
  return await res.json();
};

export const getDoctorAvailableTimes = async (doctorId, date) => {
  const res = await fetch(`${API_URL}/doctor/${doctorId}/date/${date}`);
  if (!res.ok) throw new Error("Eroare la obținerea orelor disponibile.");
  return await res.json();
};
