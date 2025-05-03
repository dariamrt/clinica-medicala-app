const API_URL = "http://localhost:8080/api/specialties";

export const getAllSpecialties = async () => {
  const res = await fetch(`${API_URL}`, {
    method: "GET",
    credentials: "include"
  });
  if (!res.ok) throw new Error("Eroare la obtinerea specializarilor.");
  return await res.json();
};

export const addSpecialty = async (specialty) => {
  const res = await fetch(`${API_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(specialty),
    credentials: "include",
  });

  if (!res.ok) throw new Error("Eroare la adaugarea specializarii.");
  return await res.json();
};

export const deleteSpecialty = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) throw new Error("Eroare la stergerea specializarii.");
};

export const updateSpecialty = async (id, updatedData) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      throw new Error("Eroare la actualizarea specializarii.");
    }

    return await response.json();
  } catch (error) {
    console.error("Eroare la updateSpecialty:", error);
    throw error;
  }
};