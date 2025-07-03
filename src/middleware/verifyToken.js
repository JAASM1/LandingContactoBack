import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  
  
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    console.log("Token no proporcionado")
    return res.status(401).json({ error: "Token requerido" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log("Token inválido o expirado:", err.message);
      return res.status(403).json({ error: "Token inválido o expirado" });
    }
    console.log("Token verificado correctamente:", user);
    req.user = user;
    next();
  });
};
