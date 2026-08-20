import express from "express";
import cors from "cors";
import bitacoraRouter from "./routes/bitacora.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "sidco-dashboard-api" });
});

app.use("/api/bitacora", bitacoraRouter);

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`API SIDCO escuchando en http://localhost:${port}`);
});
