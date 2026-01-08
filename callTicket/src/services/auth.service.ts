import { getJwtToken, getUserData } from "../utils/utils";

export interface loginResponse {
  data: {
    token: string;
    user: { id: number; name: string; email: string; created_at: Date };
  };
}
export default async function loginService(
  email: string,
  password: string
): Promise<loginResponse> {
  const apiUrl = process.env.EXPO_PUBLIC_BASE_URL;
  if (!apiUrl) {
    throw new Error("EXPO_PUBLIC_BASE_URL not set");
  }
  const baseUrl = apiUrl.endsWith("/") ? apiUrl : `${apiUrl}/`;

  try {
    const response = await fetch(`${baseUrl}auth/login`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export async function verifyToken(): Promise<boolean> {
  try {
    const token = await getJwtToken();
    const data = await getUserData();
    console.log(data);
    if (!token) return false;
    const apiUrl = process.env.EXPO_PUBLIC_BASE_URL;
    if (!apiUrl) return false;
    const baseUrl = apiUrl.endsWith("/") ? apiUrl : `${apiUrl}/`;

    const res = await fetch(`${baseUrl}auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.ok;
  } catch (error) {
    console.error(error);
    return false;
  }
}
