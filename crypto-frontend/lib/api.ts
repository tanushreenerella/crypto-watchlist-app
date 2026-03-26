import axios, { AxiosError } from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000";

export type WatchlistItem = {
  id: number;
  coin: string;
  price: number;
};

export type ApiError = {
  status?: number;
  message: string;
};

type LoginResponse = {
  access_token: string;
};

type RegisterResponse = {
  msg: string;
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

function authHeader(token: string) {
  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function loginUser(email: string, password: string) {
 const { data } = await api.post<LoginResponse>("/api/v1/auth/login", {
  email,
  password,
});

  return data;
}

export async function registerUser(email: string, password: string) {
  const { data } = await api.post<RegisterResponse>("/api/v1/auth/register", {
  email,
  password,
});

  return data;
}

export async function fetchWatchlist(token: string) {
  const { data } = await api.get<WatchlistItem[]>("/api/v1/watchlist/", {
  headers: authHeader(token),
});

  return data;
}

export async function addWatchlistCoin(token: string, coin: string) {
  const { data } = await api.post(
  "/api/v1/watchlist/add",
  { coin },
  { headers: authHeader(token) }
);

  return data;
}

export async function deleteWatchlistCoin(token: string, id: number) {
  const { data } = await api.delete(`/api/v1/watchlist/${id}`, {
  headers: authHeader(token),
});

  return data;
}

export function getApiErrorMessage(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ detail?: string; msg?: string }>;
    const message =
      axiosError.response?.data?.detail ||
      axiosError.response?.data?.msg ||
      axiosError.message ||
      "Something went wrong.";

    return {
      status: axiosError.response?.status,
      message,
    };
  }

  return {
    message: "Something went wrong.",
  };
}
