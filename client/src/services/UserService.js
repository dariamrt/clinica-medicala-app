const API_URL = "http://localhost:8080/api/users";

export const updateUserById = async (id, updatedFields) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(updatedFields),
    });
  
    if (!response.ok) {
      throw new Error("Actualizarea a eșuat");
    }
  
    return await response.json();
};
  