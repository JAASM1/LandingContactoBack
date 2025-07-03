import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  nombreCompleto: {
    type: String,
    required: true,
    trim: true,
    minLength: 2,
    maxLength: 100,
  },
  correo: {
    type: String,
    required: true,
    trim: true,
    lowerCase: true,
    match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
  },
  telefono: {
    type: String,
    required: true,
    trim: true,
  },
  mensaje: {
    type: String,
    required: true,
    trim: true,
    minLength: 10,
    maxLength: 1000,
  },
  fechaCreacion: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Contact", contactSchema);