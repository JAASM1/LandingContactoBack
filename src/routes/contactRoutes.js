import express from "express";
import rateLimit from "express-rate-limit";
import {
  validateContact,
  createContact,
  getContacts,
  markAsRead,
  deleteContact,
} from "../controllers/contactControllers.js";
import { verifyCaptcha } from "../middleware/verifyCaptcha.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5,
  message: { error: "Ups. Demasiadas solicitudes. Intenta en 15 minutos." },
});

// Ruta pública para enviar contacto
router.post("/contact", limiter, verifyCaptcha, validateContact, createContact);

// Rutas protegidas (solo con token)
router.get("/contacts", verifyToken, getContacts);
// router.get("/contacts", getContacts);

router.patch("/contact/:id/read", verifyToken, markAsRead);
router.delete("/contact/:id/delete", verifyToken, deleteContact);

export default router;
