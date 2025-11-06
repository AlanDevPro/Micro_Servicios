import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const generarToken = (usuario) => {
  const payload = {
    id: usuario.id,
    correo: usuario.correo
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h" });
};
