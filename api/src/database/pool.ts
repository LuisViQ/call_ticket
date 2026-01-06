import mysql from "mysql2/promise";
import "dotenv/config";

function env(name: string): string {
  const value = process.env[name];
   if (value === undefined) {
    throw new Error(`Variável de ambiente ausente: ${name}`);
  }

  return value;

}

const pool = mysql.createPool({
  host: env("DB_HOST"),
  user: env("DB_USER"),
  password: env("DB_PASSWORD"),
  database: env("DB_NAME"),
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  waitForConnections: true,
  connectionLimit: 10
});

export default pool;
