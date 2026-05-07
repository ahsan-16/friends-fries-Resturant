const BASE_URL = "http://localhost:5000/api";

const api = async (endpoint, options = {}) => {
  const token = localStorage.getItem("accessToken");

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    credentials: "include",
    ...options,
  };

  if (config.body && typeof config.body !== "string") {
    config.body = JSON.stringify(config.body);
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, config);
  const data = await res.json();

  // Auto refresh token if expired
  if (res.status === 401 && data.message === "Access token expired") {
    const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    if (refreshRes.ok) {
      const refreshData = await refreshRes.json();
      localStorage.setItem("accessToken", refreshData.data.accessToken);
      config.headers.Authorization = `Bearer ${refreshData.data.accessToken}`;
      const retryRes = await fetch(`${BASE_URL}${endpoint}`, config);
      return retryRes.json();
    } else {
      localStorage.removeItem("accessToken");
      window.location.href = "/";
    }
  }

  return data;
};

export default api;