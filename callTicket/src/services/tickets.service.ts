// Helpers para ler token e dados do usuario local.
import { getJwtToken, getUserData } from "../utils/utils";

// Tipos usados pelo servico de chamados.
export type TicketStatus =
  | "AGUARDANDO"
  | "EM_ATENDIMENTO"
  | "CANCELADO"
  | "ENCERRADO";

export type Ticket = {
  description: string;
  ticket_type: string;
  area_type: string;
  url?: string | null;
};

export type TicketItem = {
  id: number;
  description: string;
  status: TicketStatus;
  ticket_type: string | null;
  area_type: string | null;
  url?: string | null;
  attachments?: Array<{ file_url: string }> | null;
};

export type TicketListResponse = {
  data: TicketItem[];
  ok: boolean;
};

export type TicketUpdatePayload = {
  status: TicketStatus;
  description: string;
  ticket_type: string | null;
  area_type: string | null;
  url?: string | null;
};

export type TicketUpdateResponse = {
  ok: boolean;
  data: { updated: boolean };
};

export type UploadResponse = {
  url: string;
  path?: string;
};

function createTimeoutError() {
  const error = new Error("Tempo de conexao esgotado. Tente novamente.");
  error.name = "TimeoutError";
  return error;
}

// Recupera o token JWT armazenado localmente.
async function getAuthToken(): Promise<string> {
  const token = await getJwtToken();
  if (!token) {
    throw new Error("Token not found");
  }
  return token;
}

// Recupera o id do usuario logado.
async function getUserId(): Promise<number> {
  const user = await getUserData();
  if (!user || typeof user.id !== "number") {
    throw new Error("User id not found");
  }
  return user.id;
}

// Cria um novo chamado.
export default async function ticketService(
  ticket: Ticket
): Promise<TicketStatus> {
  const apiUrl = process.env.EXPO_PUBLIC_BASE_URL;
  if (!apiUrl) {
    throw new Error("EXPO_PUBLIC_BASE_URL not set");
  }
  const baseUrl = apiUrl.endsWith("/") ? apiUrl : `${apiUrl}/`;
  const token = await getAuthToken();
  const timeoutMs = 5000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    // Monta o payload de criacao do chamado.
    const body: Record<string, unknown> = {
      description: ticket.description,
      status: "AGUARDANDO",
      ticket_type: ticket.ticket_type,
      area_type: ticket.area_type,
    };
    if (ticket.url) {
      body.url = ticket.url;
    }

    // Envia o chamado para a API.
    const response = await fetch(`${baseUrl}tickets`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw createTimeoutError();
    }
    console.error(error);
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

// Lista os chamados do usuario atual.
export async function showTicketService(
  userId?: number
): Promise<TicketListResponse> {
  const apiUrl = process.env.EXPO_PUBLIC_BASE_URL;
  if (!apiUrl) {
    throw new Error("EXPO_PUBLIC_BASE_URL not set");
  }
  const baseUrl = apiUrl.endsWith("/") ? apiUrl : `${apiUrl}/`;
  const token = await getAuthToken();
  const resolvedUserId = userId ?? (await getUserId());
  const path = `tickets/${resolvedUserId}`;

  try {
    // Busca os chamados do usuario.
    const response = await fetch(`${baseUrl}${path}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return (await response.json()) as TicketListResponse;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Atualiza um chamado existente.
export async function updateTicketService(
  ticketId: number,
  payload: TicketUpdatePayload
): Promise<TicketUpdateResponse> {
  const apiUrl = process.env.EXPO_PUBLIC_BASE_URL;
  if (!apiUrl) {
    throw new Error("EXPO_PUBLIC_BASE_URL not set");
  }
  const baseUrl = apiUrl.endsWith("/") ? apiUrl : `${apiUrl}/`;
  const token = await getAuthToken();

  try {
    // Monta o payload de atualizacao do chamado.
    const body: Record<string, unknown> = {
      status: payload.status,
      description: payload.description,
      ticket_type: payload.ticket_type,
      area_type: payload.area_type,
    };
    if (payload.url) {
      body.url = payload.url;
    }

    // Envia a atualizacao para a API.
    const response = await fetch(`${baseUrl}tickets/${ticketId}`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return (await response.json()) as TicketUpdateResponse;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Normaliza respostas de upload para um formato unico.
function normalizeUploadResponse(payload: unknown): UploadResponse {
  if (typeof payload === "string") {
    return { url: payload };
  }
  if (payload && typeof payload === "object") {
    const data = payload as {
      url?: string;
      path?: string;
      data?: { url?: string; path?: string };
    };
    const url = data.url ?? data.path ?? data.data?.url ?? data.data?.path;
    if (url) {
      return { url, path: data.path ?? data.data?.path };
    }
  }
  throw new Error("Invalid upload response");
}

// Faz upload de imagem do chamado.
export async function uploadTicketImage(uri: string): Promise<UploadResponse> {
  const apiUrl = process.env.EXPO_PUBLIC_BASE_URL;
  if (!apiUrl) {
    throw new Error("EXPO_PUBLIC_BASE_URL not set");
  }
  const baseUrl = apiUrl.endsWith("/") ? apiUrl : `${apiUrl}/`;
  const token = await getAuthToken();
  const filename = uri.split("/").pop() || `upload-${Date.now()}.jpg`;
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : "image/jpeg";
  const timeoutMs = 10000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  // Monta o FormData com o arquivo da imagem.
  const formData = new FormData();
  formData.append("image", {
    uri,
    name: filename,
    type,
  } as any);

  try {
    // Envia o arquivo para o endpoint de upload.
    const response = await fetch(`${baseUrl}uploads`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: formData,
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const responseClone = response.clone();
    let payload: unknown;
    try {
      payload = await response.json();
    } catch {
      payload = await responseClone.text();
    }
    return normalizeUploadResponse(payload);
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw createTimeoutError();
    }
    console.error(error);
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
