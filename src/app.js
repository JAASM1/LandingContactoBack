import express from "express";
import cors from "cors";
import helmet from "helmet";
import contactRouter from "./routes/contactRoutes.js";
import authRouter from "./routes/authRoutes.js";

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors({
  origin: process.env.FRONT_URL || "https://landing-contacto-au5k.vercel.app",
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use("/api", contactRouter);
app.use("/api", authRouter); 

app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Ruta no encontrada" });
});

export default app;
