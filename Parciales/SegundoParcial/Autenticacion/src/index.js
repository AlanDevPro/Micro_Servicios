import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());


app.use("/auth", authRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Auth Service en puerto ${process.env.PORT}`);
});
