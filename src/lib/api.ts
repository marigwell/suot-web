import type {
  LoginRequest,
  RegisterRequest,
  Token,
  User,
} from "@/types/auth";
import { getAccessToken } from "@/lib/auth";
import type { ItemPage } from "@/types/item";


const API_URL = process.env.NEXT_PUBLIC_API_URL;

type ApiRequestOptions = RequestInit & {
  authenticated?: boolean;
};

export async function apiRequest<T>(
  endpoint: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const {
    authenticated = false,
    headers,
    ...requestOptions
  } = options;

  const requestHeaders = new Headers(headers);

  if (authenticated) {
    const token = getAccessToken();

    if (!token) {
      throw new Error("No access token found.");
    }

    requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...requestOptions,
    headers: requestHeaders,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function registerUser(data: RegisterRequest): Promise<User> {
  return apiRequest<User>("/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

export function loginUser(data: LoginRequest): Promise<Token> {
  const formData = new URLSearchParams();

  formData.append("username", data.email);
  formData.append("password", data.password);

  return apiRequest<Token>("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData,
  });
}

export function getItems(): Promise<ItemPage> {
  return apiRequest<ItemPage>("/items", {
    authenticated: true,
  });
}