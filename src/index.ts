import express from "express";
import crawlerRoutes from "./routes/crawlerRoutes";

const app = express();
const PORT = process.env.PORT || 3000;

app.use("/api", crawlerRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
