import bcrypt from "bcrypt";
import { db } from "../config/db.js";
import { generarToken } from "../utils/jwt.js";


export const register = async (req, res) => {
  const { correo, password } = req.body;

  try {
   
    const [rows] = await db.query("SELECT * FROM usuarios WHERE correo = ?", [correo]);
    if (rows.length > 0) {
      return res.status(400).json({ mensaje: "El usuario ya existe" });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

   
    await db.query("INSERT INTO usuarios (correo, password) VALUES (?, ?)", [correo, hashedPassword]);

    res.status(201).json({ mensaje: "Usuario registrado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const login = async (req, res) => {
  const { correo, password } = req.body;

  try {
    const [rows] = await db.query("SELECT * FROM usuarios WHERE correo = ?", [correo]);

    if (rows.length === 0) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    const usuario = rows[0];

   
    const passwordValido = await bcrypt.compare(password, usuario.password);
    if (!passwordValido) {
      return res.status(401).json({ mensaje: "Contraseña incorrecta" });
    }

    
    const token = generarToken(usuario);

    res.status(200).json({
      mensaje: "Login correcto",
      token,
      usuario: {
        id: usuario.id,
        correo: usuario.correo
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
