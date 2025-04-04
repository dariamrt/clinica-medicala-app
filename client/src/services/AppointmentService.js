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

export const getMyAppointments = async () => {
  const res = await fetch(`${API_URL}/me`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Eroare la obținerea programărilor.");
  return await res.json();
};
