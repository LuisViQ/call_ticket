import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUserByEmail } from "../repository/user.repository.js";

const jwtSecret = process.env.JWT_SECRET || "dev-secret";
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || "1d";

export async function authenticateUser(email: string, password: string) {
  const user = await findUserByEmail(email);
  if (!user) return null;

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return null;

  const token = jwt.sign({ sub: String(user.id) }, jwtSecret, { expiresIn: jwtExpiresIn as any });
  const { password_hash, ...safeUser } = user;

  return { user: safeUser, token };
}

export function verifyToken(token: string) {
  try {
    const payload = jwt.verify(token, jwtSecret) as any;
    return typeof payload?.sub === "string" ? payload.sub : null;
  } catch {
    return null;
  }
}
