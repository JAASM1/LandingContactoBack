import Contact from "../models/Contact.js";
import { body, validationResult } from "express-validator";
import { transporter } from "../Mail/mail.js";

export const validateContact = [
  body("nombreCompleto")
    .trim()
    .isLength({ min: 2, max: 100 })
    .matches(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/),
  body("correo").trim().isEmail().normalizeEmail(),
  body("telefono").trim().notEmpty(),
  body("mensaje").trim().isLength({ min: 10, max: 1000 }),
];

export const createContact = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Datos invalidos",
        errors: errors.array(),
      });
    }

    const { nombreCompleto, correo, telefono, mensaje } = req.body;

    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const existingContact = await Contact.findOne({
      correo,
      fechaCreacion: { $gte: yesterday },
    });

    if (existingContact) {
      return res.status(429).json({
        success: false,
        message: "Ya enviaste una solicitud en las últimas 24 horas",
      });
    }

    const contact = new Contact({
      nombreCompleto,
      correo,
      telefono,
      mensaje,
    });

    await contact.save();

    if (contact) {
      try {
        const adminEmails = process.env.ADMINS.split(",");

        await transporter.sendMail({
          from: `"CRM Notifier" <${process.env.GMAIL_USER}>`,
          to: adminEmails,
          subject: "📩 Nuevo contacto desde el formulario",
          html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                  <h2 style="color: #4CAF50;">Nuevo contacto en el CRM</h2>
                  <p>Un cliente ha enviado un formulario de contacto.</p>
                  <p style="margin-top: 20px;">
                    <a href="https://tu-crm.com" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: #fff; text-decoration: none; border-radius: 4px;">
                      Ver en el CRM
                    </a>
                  </p>
                  <hr style="margin-top: 30px;" />
                  <p style="font-size: 12px; color: #888;">Este correo es solo una notificación automática.</p>
                </div>
              `,
        });

        return res
          .status(200)
          .json({ message: "Notificación enviada al Administrador" });
      } catch (error) {
        console.error("Error al enviar correo:", error);
        return res
          .status(500)
          .json({ error: "No se pudo enviar la notificación" });
      }
    }

    res.status(201).json({
      success: true,
      message: "Solicitud enviada exitosamento",
      data: { id: contact._id },
    });
  } catch (error) {
    console.error("Error al crear contacto:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

//Estos se quedaran si es que necesitaramos hacer dash para gestionar las solicitudes
//En caso de que no los eliminamos

export const getContacts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const contacts = await Contact.find()
      .sort({ fechaCreacion: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Contact.countDocuments();

    res.json({
      success: true,
      data: contacts,
      pagination: {
        currentPage: page,
        totalPage: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    console.error("Error al obtener contactos:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { leido: true },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contacto no encontrado",
      });
    }

    res.json({
      success: true,
      message: "Marcado como leido",
    });
  } catch (error) {
    console.error("Error al actualizar contacto:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const contact = Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contacto no encontrado",
      });
    }
    res.json({
      success: true,
      message: "Contacto eliminado exitosamente",
    });
  } catch (error) {
    console.error("Error al actualizar contacto:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};
