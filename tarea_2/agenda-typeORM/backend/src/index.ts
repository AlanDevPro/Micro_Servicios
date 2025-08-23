import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();

import { AppDataSource } from "./data-source";
import express from "express";
import cors from "cors";
import { Contact } from "./entity/Contact";
import { ObjectId } from "mongodb";

const PORT = process.env.PORT || 4000;


AppDataSource.initialize().then(async () => {
const app = express();
app.use(cors());
app.use(express.json());


const repo = AppDataSource.getMongoRepository(Contact);


// Listar todos
app.get('/api/contacts', async (req, res) => {
const contacts = await repo.find();
res.json(contacts);
});


// Obtener por id
app.get('/api/contacts/:id', async (req, res) => {
try {
const id = req.params.id;
const contact = await repo.findOne({ where: { _id: new ObjectId(id) } as any });
if (!contact) return res.status(404).json({ message: 'Contacto no encontrado' });
res.json(contact);
} catch (err) {
res.status(400).json({ message: 'Id inválido' });
}
});


// Crear
app.post('/api/contacts', async (req, res) => {
const data = req.body;
// validaciones básicas (omitir/añadir según convenga)
if (!data.nombres || !data.apellidos) return res.status(400).json({ message: 'Faltan nombres/apellidos' });


const contact = repo.create({
...data,
fecha_nacimiento: data.fecha_nacimiento ? new Date(data.fecha_nacimiento) : null,
} as any);


const saved = await repo.save(contact);
res.status(201).json(saved);
});


// Actualizar
app.put('/api/contacts/:id', async (req, res) => {
try {
const id = req.params.id;
const existing = await repo.findOne({ where: { _id: new ObjectId(id) } as any });
if (!existing) return res.status(404).json({ message: 'No encontrado' });


Object.assign(existing, req.body);
if (req.body.fecha_nacimiento) existing.fecha_nacimiento = new Date(req.body.fecha_nacimiento);


await repo.save(existing);
res.json(existing);
} catch (err) {
res.status(400).json({ message: 'Id inválido' });
}
});


// Eliminar
app.delete('/api/contacts/:id', async (req, res) => {
try {
const id = req.params.id;
const result = await repo.delete({ _id: new ObjectId(id) } as any);
if ((result as any).deletedCount === 1) return res.json({ message: 'Eliminado' });
return res.status(404).json({ message: 'No encontrado' });
} catch (err) {
res.status(400).json({ message: 'Id inválido' });
}
});


app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
}).catch(err => console.error('TypeORM init error', err));