import axios from "axios";

export const apiClient = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

export interface ApiEnvelope<T> {
  data: T;
}

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error?.response?.data?.error?.message ?? "Erro de comunicação com o servidor";
    return Promise.reject(new Error(message));
  },
);
