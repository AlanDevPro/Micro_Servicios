import "reflect-metadata";
import { DataSource } from "typeorm";
import { Contact } from "./entity/Contact";


export const AppDataSource = new DataSource({
type: "mongodb",
url: process.env.MONGO_URL || "mongodb://localhost:27017/agenda",
database: process.env.DB_NAME || "agenda",
synchronize: true,
logging: false,
entities: [Contact],
});