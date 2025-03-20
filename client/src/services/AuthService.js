const API_URL = "http://localhost:8080/api/auth";

export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Email sau parolă incorectă!");
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || "Eroare la conectarea cu serverul.");
  }
};

export const register = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(userData),
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Eroare la înregistrare!");
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || "Eroare la conectarea cu serverul.");
  }
};

export const logout = async () => {
  try {
    await fetch(`${API_URL}/logout`, { method: "POST", credentials: "include" });
    localStorage.removeItem("token");
  } catch (error) {
    console.error("Logout failed:", error);
  }
};
