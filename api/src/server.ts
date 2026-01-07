import "dotenv/config";
import app from "./app.js";

const port = Number(process.env.PORT) || 3000;
// responsavel por subir o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
