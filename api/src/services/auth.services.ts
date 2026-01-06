import { compare } from "bcrypt";

export function comparePassword (password: string, password_hash:string) {
    return compare(password, password_hash)
}