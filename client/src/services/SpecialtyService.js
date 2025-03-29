const API_URL = "http://localhost:8080/api/specialties";

export const getAllSpecialties = async () => {
  const res = await fetch(`${API_URL}`, {
    method: "GET",
    credentials: "include"
  });
  if (!res.ok) throw new Error("Eroare la obținerea specializărilor.");
  return await res.json();
};
