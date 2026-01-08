import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import * as SplashScreen from "expo-splash-screen";
import { verifyToken } from "../services/auth.service";

type AuthContextValue = {
  isAuth: boolean | null;
  setIsAuth: (value: boolean) => void;
  refreshAuth: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
  }, []);

  const refreshAuth = useCallback(async () => {
    const result = await verifyToken();
    setIsAuth(result);
  }, []);

  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  useEffect(() => {
    if (isAuth !== null) {
      SplashScreen.hideAsync();
    }
  }, [isAuth]);

  const value = useMemo(
    () => ({ isAuth, setIsAuth, refreshAuth }),
    [isAuth, refreshAuth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
