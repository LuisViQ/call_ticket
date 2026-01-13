import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
// Controle do splash screen no fluxo inicial do app.
import * as SplashScreen from "expo-splash-screen";
// Servico que verifica o token de autenticacao.
import { verifyToken } from "../services/auth.service";

// Impede o splash de fechar automaticamente.
SplashScreen.preventAutoHideAsync().catch(() => {});

// Contrato dos valores expostos pelo contexto.
type AuthContextValue = {
  isAuth: boolean | null;
  setIsAuth: (value: boolean) => void;
  refreshAuth: () => Promise<void>;
};

// Instancia interna do contexto com valor indefinido.
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Provider que envolve a arvore do app.
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  // Revalida o token no backend.
  const refreshAuth = useCallback(async () => {
    const result = await verifyToken();
    setIsAuth(result);
  }, []);

  // Executa a validacao inicial ao montar.
  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  // Esconde o splash quando o status estiver resolvido.
  useEffect(() => {
    if (isAuth !== null) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [isAuth]);

  // Memoiza o valor do contexto para reduzir renders.
  const value = useMemo(
    () => ({ isAuth, setIsAuth, refreshAuth }),
    [isAuth, refreshAuth]
  );

  // Renderiza o provider e repassa o valor.
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook para consumir o contexto de auth.
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
