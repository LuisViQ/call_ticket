import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  showTicketService,
  type TicketItem,
  type TicketListResponse,
} from "../services/tickets.service";
import { useAuth } from "./AuthContext";

// Valores expostos para a lista de chamados.
type CardGridContentListContextValue = {
  tickets: TicketItem[];
  isLoading: boolean;
  error: string | null;
  refreshTickets: () => Promise<void>;
};

// Instancia interna do contexto com valor indefinido.
const CardGridContentListContext = createContext<
  CardGridContentListContextValue | undefined
>(undefined);
// Provider que envolve a arvore do app.
export function CardGridContentListProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOffline } = useAuth();
  // Estado principal da lista de chamados.
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Evita setState apos desmontar o provider.
  const isMountedRef = useRef(true);

  // Marca o provider como desmontado.
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Busca os chamados e atualiza estado.
  const refreshTickets = useCallback(async () => {
    if (!isMountedRef.current) {
      return;
    }
    if (isOffline) {
      if (tickets.length === 0) {
        setError("Voce esta offline. Conecte-se para carregar seus chamados.");
      } else {
        setError(null);
      }
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      // Consulta os chamados do usuario logado.
      const data = (await showTicketService()) as TicketListResponse;
      if (!isMountedRef.current) {
        return;
      }
      if (!data.ok) {
        setTickets([]);
        setError("Nao ha chamados.");
        return;
      }
      setTickets(data.data || []);
    } catch (err) {
      console.error(err);
      if (isMountedRef.current) {
        setError("Nao foi possivel carregar os chamados.");
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [isOffline, tickets.length]);

  // Carrega os chamados ao montar.
  useEffect(() => {
    refreshTickets();
  }, [refreshTickets]);

  // Memoiza o valor para evitar renders desnecessarios.
  const value = useMemo(
    () => ({ tickets, isLoading, error, refreshTickets }),
    [tickets, isLoading, error, refreshTickets]
  );

  return (
    <CardGridContentListContext.Provider value={value}>
      {children}
    </CardGridContentListContext.Provider>
  );
}

// Hook para consumir o contexto da lista.
export function useCardGridContentList() {
  const context = useContext(CardGridContentListContext);
  if (!context) {
    throw new Error(
      "useCardGridContentList must be used within a CardGridContentListProvider"
    );
  }
  return context;
}
