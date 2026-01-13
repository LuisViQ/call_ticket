# Contextos

src/contexts/AuthContext.tsx
-> Fornece estado isAuth e helpers no app.
-> refreshAuth() chama verifyToken() para validar a sessao.
-> Usa expo-splash-screen para manter o splash visivel ate o estado de auth ser conhecido.
-> useAuth() obriga o uso do provider e lanca erro se estiver ausente.
