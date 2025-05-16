const API_URL = "http://localhost:8080/api/appointments";

export const bookAppointment = async ({ availability_id, reimbursed_by_CAS }) => {
  const res = await fetch(`${API_URL}/book`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ availability_id, reimbursed_by_CAS }),
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || "Eroare la programare.");
  }

  return await res.json();
};

export const cancelAppointment = async (appointmentId) => {
  const res = await fetch(`${API_URL}/${appointmentId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Eroare la anularea programării!");
  }

  return await res.json();
};

export const getAllAppointments = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}`, {
    method: "GET",
    credentials: "include",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) {
    throw new Error("Eroare la preluarea programărilor.");
  }

  return await res.json();
};

export const updateAppointment = async (appointmentId, data) => {
  const res = await fetch(`${API_URL}/${appointmentId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Eroare la actualizarea programarii!");
  }

  return await res.json();
};