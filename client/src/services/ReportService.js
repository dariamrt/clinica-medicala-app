const API_URL = "http://localhost:8080/api/admin-reports";

export const getAppointmentCancellationRate = async () => {
  const res = await fetch(`${API_URL}/cancellation-rate`, { credentials: "include" });
  if (!res.ok) throw new Error("Eroare la obtinerea ratei de anulare.");
  return await res.json();
};

export const getPeakAppointmentHours = async () => {
  const res = await fetch(`${API_URL}/peak-hours`, { credentials: "include" });
  if (!res.ok) throw new Error("Eroare la obtinerea orelor de vârf.");
  return await res.json();
};

export const getCommonDiagnoses = async () => {
  const res = await fetch(`${API_URL}/common-diagnoses`, { credentials: "include" });
  if (!res.ok) throw new Error("Eroare la obtinut diagnostic frecvent.");
  return await res.json();
};

export const getDoctorPerformanceReport = async () => {
  const res = await fetch(`${API_URL}/doctor-performance`, { credentials: "include" });
  if (!res.ok) throw new Error("Eroare la obtinerea performantei doctorilor.");
  return await res.json();
};

export const predictAppointmentNoShow = async ({ age, gender, date, start_time }) => {
  const res = await fetch(`${API_URL}/predict-no-show`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ age, gender, date, start_time }),
  });

  if (!res.ok) throw new Error("Eroare la predictia no-show appts.");
  return await res.json();
};

export const saveReport = async ({ report_type, content, format = "json" }) => {
  const res = await fetch(`${API_URL}/save`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ report_type, content, format }),
  });

  if (!res.ok) throw new Error("Eroare la salvarea raportului.");
  return await res.json();
};

export const getStoredReports = async () => {
  const res = await fetch(`${API_URL}/stored`, { credentials: "include" });
  if (!res.ok) throw new Error("Eroare la obtinerea rapoartelor salvate.");
  return await res.json();
};

export const getReportById = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, { credentials: "include" });
  if (!res.ok) throw new Error("Eroare la obtinerea raportului.");
  return await res.json();
};

export const deleteReport = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) throw new Error("Eroare la sters raportul.");
  return await res.json();
};

export const predictAppointmentNoShowByPatient = async (data) => {
        const response = await fetch(`${API_URL}/predict-no-show-by-patient`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error('Failed to predict no-show by patient');
        }
        
        return response.json();
}