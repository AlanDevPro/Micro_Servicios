import express from "express";
import {
  listarVehiculos,
  crearVehiculo,
  actualizarVehiculo,
  eliminarVehiculo,
} from "../controllers/vehiculos.controller.js";
import { verificarToken } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Vehículos
 *   description: Endpoints del microservicio de gestión de vehículos
 */

/**
 * @swagger
 * /vehiculos:
 *   get:
 *     summary: Lista todos los vehículos
 *     tags: [Vehículos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de vehículos obtenida correctamente
 */
router.get("/", verificarToken, listarVehiculos);

/**
 * @swagger
 * /vehiculos:
 *   post:
 *     summary: Crea un nuevo vehículo
 *     tags: [Vehículos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               placa:
 *                 type: string
 *                 example: "ABC123"
 *               tipo:
 *                 type: string
 *                 enum: [camión, furgón, moto]
 *                 example: "camión"
 *               capacidad:
 *                 type: number
 *                 example: 1500
 *               estado:
 *                 type: string
 *                 enum: [disponible, en ruta, mantenimiento]
 *                 example: "disponible"
 *     responses:
 *       201:
 *         description: Vehículo creado correctamente
 */
router.post("/", verificarToken, crearVehiculo);

/**
 * @swagger
 * /vehiculos/{id}:
 *   put:
 *     summary: Actualiza un vehículo por ID
 *     tags: [Vehículos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del vehículo
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               estado:
 *                 type: string
 *                 example: "en ruta"
 *     responses:
 *       200:
 *         description: Vehículo actualizado correctamente
 */
router.put("/:id", verificarToken, actualizarVehiculo);

/**
 * @swagger
 * /vehiculos/{id}:
 *   delete:
 *     summary: Elimina un vehículo por ID
 *     tags: [Vehículos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del vehículo
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Vehículo eliminado correctamente
 */
router.delete("/:id", verificarToken, eliminarVehiculo);

export default router;
