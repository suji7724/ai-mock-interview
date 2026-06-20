import axios from "axios";

const api = axios.create({
  baseURL: "https://ai-mock-interview-s5ou.onrender.com",
});

api.interceptors.request.use(
  (config) => {

    const token =
      localStorage.getItem(
        "accessToken"
      );

    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  }
);

api.interceptors.response.use(

  (response) => response,

  async (error) => {

    const originalRequest =
      error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {

      originalRequest._retry = true;

      try {

        const refreshToken =
          localStorage.getItem(
            "refreshToken"
          );

        const response =
          await axios.post(
            "http://127.0.0.1:8000/api/token/refresh/",
            {
              refresh: refreshToken,
            }
          );

        const newAccess =
          response.data.access;

        localStorage.setItem(
          "accessToken",
          newAccess
        );

        originalRequest.headers.Authorization =
          `Bearer ${newAccess}`;

        return api(
          originalRequest
        );

      } catch {

        localStorage.clear();

        window.location.href =
          "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;