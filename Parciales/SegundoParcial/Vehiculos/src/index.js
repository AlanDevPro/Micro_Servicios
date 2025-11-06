import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { conectarDB } from "./config/db.js";
import vehiculosRoutes from "./routes/vehiculos.routes.js";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

conectarDB();


const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Vehículos - Sistema Logístico",
      version: "1.0.0",
      description:
        "Documentación automática de los endpoints del microservicio de vehículos.",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Servidor local",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/routes/*.js"], 
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));


app.use("/vehiculos", vehiculosRoutes);


app.listen(process.env.PORT, () => {
  console.log(` Vehiculos Service corriendo en puerto ${process.env.PORT}`);
  console.log(` Swagger disponible en: http://localhost:${process.env.PORT}/api-docs`);
});
