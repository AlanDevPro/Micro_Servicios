import dotenv from 'dotenv';
import { MongoClient, ServerApiVersion } from 'mongodb';

dotenv.config();

const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
});

let db;

export async function connectDB() {
  if (!db) {
    await client.connect(); // desde v4.7 es opcional, pero recomendado. :contentReference[oaicite:3]{index=3}
    db = client.db(process.env.DB_NAME || 'agenda_db');
    await db.collection('agendas').createIndex({ correo: 1 }, { unique: true });
  }
  return db;
}

export function agendasCollection() {
  if (!db) throw new Error('DB no inicializada. Llama a connectDB() primero.');
  return db.collection('agendas');
}
