// Helpers para ler token e dados do usuario local.
import { getJwtToken, getUserData } from "../utils/utils";

// Estrutura da resposta de login da API.
export interface loginResponse {
  data: {
    token: string;
    user: { id: number; name: string; email: string; created_at: Date };
  };
}
// Faz login e retorna token e dados do usuario.
export default async function loginService(
  email: string,
  password: string
): Promise<loginResponse> {
  const apiUrl = process.env.EXPO_PUBLIC_BASE_URL;
  if (!apiUrl) throw new Error("EXPO_PUBLIC_BASE_URL not set");
  const baseUrl = apiUrl.endsWith("/") ? apiUrl : `${apiUrl}/`;

  const timeoutMs = 5000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${baseUrl}auth/login`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      signal: controller.signal,
    });

    const data = await response.json();

    if (!response.ok) {
      const message =
        typeof data?.message === "string"
          ? data.message
          : `HTTP ${response.status}`;
      throw new Error(message);
    }

    return data;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Tempo de conexão esgotado. Tente novamente.");
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
// Valida o token atual consultando o endpoint /auth/me.
export type VerifyTokenResult = {
  isAuth: boolean;
  isOffline: boolean;
};

export async function verifyToken(): Promise<VerifyTokenResult> {
  const token = await getJwtToken();
  const userData = await getUserData();
  const hasCachedUser = Boolean(userData);
  console.log(userData);
  if (!token) return { isAuth: false, isOffline: false };
  const apiUrl = process.env.EXPO_PUBLIC_BASE_URL;
  if (!apiUrl) return { isAuth: false, isOffline: false };
  const baseUrl = apiUrl.endsWith("/") ? apiUrl : `${apiUrl}/`;

  const timeoutMs = 8000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${baseUrl}auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      signal: controller.signal,
    });

    return { isAuth: res.ok, isOffline: false };
  } catch (error) {
    if (!(error instanceof Error && error.name === "AbortError")) {
      console.error(error);
    }
    return { isAuth: hasCachedUser, isOffline: true };
  } finally {
    clearTimeout(timeoutId);
  }
}
