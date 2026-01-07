import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUserByEmail } from "../repository/user.repository.js";

const jwtSecret = process.env.JWT_SECRET || "dev-secret";
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || "1d";

/** Authenticate user credentials and return user data + token. */
export async function authenticateUser(email: string, password: string) {
  const user = await findUserByEmail(email);
  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) return null;

  const token = jwt.sign({ sub: String(user.id) }, jwtSecret, { expiresIn: jwtExpiresIn as any });
  const { password_hash: passwordHash, ...safeUser } = user;

  return { user: safeUser, token };
}

/** Validate a JWT and return the user id (sub) or null. */
export function verifyToken(token: string) {
  try {
    const payload = jwt.verify(token, jwtSecret) as any;
    return payload.sub;
  } catch {
    return null;
  }
}
