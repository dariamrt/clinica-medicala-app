const API_URL = "http://localhost:8080/api/notifications";

export const getMyNotifications = async () => {
  try {
    const response = await fetch(`${API_URL}/me`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    

    if (!response.ok) {
      throw new Error("Nu s-au putut încărca notificările.");
    }

    return await response.json();
  } catch (error) {
    console.error("Eroare la fetch notificări:", error);
    throw error;
  }
};

export const markAsRead = async (id) => {
  const res = await fetch(`${API_URL}/${id}/read`, {
    method: "PUT",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Eroare la marcare ca citit.");
  }

  return await res.json();
};

export const deleteNotification = async (id) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Eroare API: ${errorText}`);
  }

  return await res.json();
};

export const getUnreadCount = async () => {
  try {
    const all = await getMyNotifications();
    return all.filter((n) => !n.read).length;
  } catch (error) {
    console.error("Eroare la numărarea notificărilor:", error);
    return 0;
  }
};

export const getNotificationById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Eroare la obținerea notificării.");
    }

    return await response.json();
  } catch (error) {
    console.error("Eroare la fetch notificare:", error);
    throw error;
  }
};
