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
      throw new Error("Email sau parolă incorectă!");
    }

    const loginData = await response.json();

    const userRes = await fetch(`${API_URL}/current-user`, {
      method: "GET",
      credentials: "include",
    });

    const userData = await userRes.json();
    localStorage.setItem("token", loginData.token);
    localStorage.setItem("role", userData.role);

    return userData;
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
    await fetch(`${API_URL}/logout`, {
      method: "POST",
      credentials: "include",
    });
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await fetch(`${API_URL}/current-user`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch current user");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
};

