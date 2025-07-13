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
    try {
        console.log("Canceling appointment with ID:", appointmentId);
        
        const url = `${API_URL}/${appointmentId}`;
        console.log("Request URL:", url);

        const response = await fetch(url, {
            method: 'DELETE',
            credentials: 'include', // Folosește cookies în loc de Bearer token
            headers: {
                'Content-Type': 'application/json'
                // Nu mai trimite Authorization header
            }
        });

        console.log("Response status:", response.status);

        if (!response.ok) {
            const errorData = await response.json();
            console.log("Error response data:", errorData);
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Success response:", data);
        return data;

    } catch (error) {
        console.error("Error in cancelAppointment service:", error);
        throw error;
    }
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