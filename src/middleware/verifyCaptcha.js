import fetch from "node-fetch";

const secretKey = "6LdZaGsrAAAAAFMEexjTLkoS_DPcuUN6n4ESs9vY"; // Asegúrate de tenerlo en tu .env

export const verifyCaptcha = async (req, res, next) => {
  const token = req.body.tokenCaptcha;

  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Falta el token del captcha",
    });
  }

  if (!secretKey) {
    console.error("RECAPTCHA_SECRET_KEY no está configurada");
    console.log(secretKey);
    
    return res.status(500).json({
      success: false,
      message: "Error de configuración del servidor",
    });
  }

  try {
    const params = new URLSearchParams();
    params.append("secret", secretKey);
    params.append("response", token);

    console.log("Verificando captcha...", {
      token: token.substring(0, 20) + "...",
    });

    const response = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "YourApp/1.0",
        },
        body: params.toString(),
      }
    );

    const data = await response.json();

    if (!data.success) {
      return res.status(400).json({
        success: false,
        message: "Captcha inválido. Por favor verifica que no eres un robot.",
      });
    }

    next(); // captcha válido → sigue al siguiente middleware
  } catch (error) {
    console.error("Error al verificar captcha:", error);
    return res.status(500).json({
      success: false,
      message: "Error al verificar captcha",
    });
  }
};
