import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUserByEmail } from "../repository/user.repository.js";

const jwtSecret = process.env.JWT_SECRET || "dev-secret";
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || "1d";

//aqui faz a autenticação do usuario pelo email e senha escrita
export async function authenticateUser(email: string, password: string) {
  const user = await findUserByEmail(email);
  if (!user) return null;
  // aqui compara se o hash é igual a senha
  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) return null;
  // aqui emite a o token que expira em (process.env.JWT_EXPIRES_IN) vem do .env
  const token = jwt.sign({ sub: String(user.id) }, jwtSecret, { expiresIn: jwtExpiresIn as any });
  const { password_hash: passwordHash, ...safeUser } = user;
  // aqui retorna as informações do usuario e o token
  return { user: safeUser, token };
}
// aqui é a função responsavel por verificar se um token já existente ainda é valido
export function verifyToken(token: string) {
  try {
    const payload = jwt.verify(token, jwtSecret) as any;
    return payload.sub;
  } catch {
    return null;
  }
}
