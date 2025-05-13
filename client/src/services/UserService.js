const API_URL = "http://localhost:8080/api/users";

export const updateUserById = async (id, updatedFields) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(updatedFields),
    });
  
    if (!response.ok) {
      throw new Error("Eroare la actualizat user");
    }
  
    return await response.json();
};


export const getAllUsers = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      credentials: "include"
    });

    if (!response.ok) {
      throw new Error("Eroare la obtinerea useri.");
    }

    return await response.json();
  } catch (error) {
    console.error("Eroare la getAllUsers:", error);
    throw error;
  }
};

