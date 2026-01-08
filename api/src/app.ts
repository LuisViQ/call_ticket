import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import path from "node:path";


const app = express();
/** responsavel por subir as rotas e aceitar .json e 
liberar acesso por alguem que não vem do mesmo endereço **/
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));
app.use("/v1", routes);

export default app;
