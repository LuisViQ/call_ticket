// Helpers para ler token local.
import { getJwtToken } from "../utils/utils";

// Tipos usados pelo servico de chamados.
export type TicketStatus =
  | "AGUARDANDO"
  | "EM_ATENDIMENTO"
  | "CANCELADO"
  | "ENCERRADO";

export type TicketType = {
  id: number;
  name?: string | null;
  title?: string | null;
};

export type AreaType = {
  id: number;
  name?: string | null;
  title?: string | null;
};

export type Ticket = {
  title: string;
  description: string;
  status?: TicketStatus;
  ticket_type_id: number;
  area_type_id: number;
  url?: string | null;
};

export type TicketItem = {
  id: number;
  title?: string | null;
  description: string;
  status: TicketStatus;
  ticket_type_id?: number | null;
  area_type_id?: number | null;
  ticket_type?: TicketType | string | null;
  area_type?: AreaType | string | null;
  url?: string | null;
  attachments?: Array<{ file_url: string }> | null;
};

export type TicketListResponse = {
  data: TicketItem[];
  ok: boolean;
};

export type TicketUpdatePayload = {
  status: TicketStatus;
  title: string;
  description: string;
  ticket_type_id: number;
  area_type_id: number;
};

export type TicketUpdateResponse = {
  ok: boolean;
  data: { updated: boolean };
};

export type UploadResponse = {
  url: string;
  path?: string;
};

export type TicketCreateResponse = {
  ok: boolean;
  data: { id: number };
};

export type TicketTypeListResponse = {
  ok: boolean;
  data: TicketType[];
};

export type AreaTypeListResponse = {
  ok: boolean;
  data: AreaType[];
};

function createTimeoutError() {
  const error = new Error("Tempo de conexao esgotado. Tente novamente.");
  error.name = "TimeoutError";
  return error;
}

function createOfflineError(message: string) {
  const error = new Error(message);
  error.name = "OfflineError";
  return error;
}

function isNetworkError(error: unknown) {
  return (
    error instanceof TypeError &&
    /Network request failed/i.test(error.message)
  );
}

// Recupera o token JWT armazenado localmente.
async function getAuthToken(): Promise<string> {
  const token = await getJwtToken();
  if (!token) {
    throw new Error("Token not found");
  }
  return token;
}

// Cria um novo chamado.
export default async function ticketService(
  ticket: Ticket
): Promise<TicketCreateResponse> {
  const apiUrl = process.env.EXPO_PUBLIC_BASE_URL;
  if (!apiUrl) {
    throw new Error("EXPO_PUBLIC_BASE_URL not set");
  }
  const baseUrl = apiUrl.endsWith("/") ? apiUrl : `${apiUrl}/`;
  const token = await getAuthToken();
  const timeoutMs = 10000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    // Monta o payload de criacao do chamado.
    const body: Record<string, unknown> = {
      title: ticket.title,
      description: ticket.description,
      status: ticket.status ?? "AGUARDANDO",
      ticket_type_id: ticket.ticket_type_id,
      area_type_id: ticket.area_type_id,
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
    if (isNetworkError(error)) {
      throw createOfflineError(
        "Voce esta offline. Conecte-se para enviar o chamado."
      );
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
  const path = userId ? `tickets/${userId}` : "tickets";
  const timeoutMs = 8000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    // Busca os chamados do usuario.
    const response = await fetch(`${baseUrl}${path}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return (await response.json()) as TicketListResponse;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw createTimeoutError();
    }
    if (isNetworkError(error)) {
      throw createOfflineError(
        "Voce esta offline. Conecte-se para carregar os chamados."
      );
    }
    console.error(error);
    throw error;
  } finally {
    clearTimeout(timeoutId);
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
  const timeoutMs = 10000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    // Monta o payload de atualizacao do chamado.
    const body: Record<string, unknown> = {
      status: payload.status,
      title: payload.title,
      description: payload.description,
      ticket_type_id: payload.ticket_type_id,
      area_type_id: payload.area_type_id,
    };

    // Envia a atualizacao para a API.
    const response = await fetch(`${baseUrl}tickets/${ticketId}`, {
      method: "PATCH",
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
    return (await response.json()) as TicketUpdateResponse;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw createTimeoutError();
    }
    if (isNetworkError(error)) {
      throw createOfflineError(
        "Voce esta offline. Conecte-se para atualizar o chamado."
      );
    }
    console.error(error);
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

// Lista tipos de ticket cadastrados.
export async function getTicketTypes(): Promise<TicketTypeListResponse> {
  const apiUrl = process.env.EXPO_PUBLIC_BASE_URL;
  if (!apiUrl) {
    throw new Error("EXPO_PUBLIC_BASE_URL not set");
  }
  const baseUrl = apiUrl.endsWith("/") ? apiUrl : `${apiUrl}/`;
  const token = await getAuthToken();
  const timeoutMs = 8000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${baseUrl}ticket-types`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return (await response.json()) as TicketTypeListResponse;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw createTimeoutError();
    }
    if (isNetworkError(error)) {
      throw createOfflineError(
        "Voce esta offline. Conecte-se para carregar os tipos."
      );
    }
    console.error(error);
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

// Lista areas cadastradas.
export async function getAreaTypes(): Promise<AreaTypeListResponse> {
  const apiUrl = process.env.EXPO_PUBLIC_BASE_URL;
  if (!apiUrl) {
    throw new Error("EXPO_PUBLIC_BASE_URL not set");
  }
  const baseUrl = apiUrl.endsWith("/") ? apiUrl : `${apiUrl}/`;
  const token = await getAuthToken();
  const timeoutMs = 8000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${baseUrl}area-types`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return (await response.json()) as AreaTypeListResponse;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw createTimeoutError();
    }
    if (isNetworkError(error)) {
      throw createOfflineError(
        "Voce esta offline. Conecte-se para carregar as areas."
      );
    }
    console.error(error);
    throw error;
  } finally {
    clearTimeout(timeoutId);
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
    if (isNetworkError(error)) {
      throw createOfflineError(
        "Voce esta offline. Conecte-se para enviar a imagem."
      );
    }
    console.error(error);
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
