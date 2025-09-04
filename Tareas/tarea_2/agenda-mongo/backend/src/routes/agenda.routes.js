import { Router } from 'express';
import Joi from 'joi';
import { agendasCollection } from '../db.js';
import { ObjectId } from 'mongodb'; // para convertir id string a ObjectId. :contentReference[oaicite:4]{index=4}

const router = Router();

const schema = Joi.object({
  nombres: Joi.string().min(2).max(100).required(),
  apellidos: Joi.string().min(2).max(100).required(),
  fecha_nacimiento: Joi.string().isoDate().required(), // "YYYY-MM-DD"
  direccion: Joi.string().allow('', null),
  celular: Joi.string().pattern(/^[0-9+\s-]{7,20}$/).required(),
  correo: Joi.string().email().required(),
});

router.get('/', async (_req, res) => {
  const items = await agendasCollection().find().sort({ _id: -1 }).toArray();
  res.json(items);
});

router.get('/:id', async (req, res) => {
  try {
    const _id = new ObjectId(req.params.id);
    const doc = await agendasCollection().findOne({ _id });
    if (!doc) return res.status(404).json({ error: 'No encontrado' });
    res.json(doc);
  } catch {
    res.status(400).json({ error: 'ID inválido' });
  }
});

router.post('/', async (req, res) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false });
  if (error) return res.status(400).json({ error: 'Validación', details: error.details });
  try {
    const now = new Date();
    const doc = { ...value, createdAt: now, updatedAt: now };
    const r = await agendasCollection().insertOne(doc);
    res.status(201).json({ _id: r.insertedId, ...doc });
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ error: 'Correo ya existe' });
    res.status(500).json({ error: 'Error al crear' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const _id = new ObjectId(req.params.id);
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) return res.status(400).json({ error: 'Validación', details: error.details });

    const r = await agendasCollection().findOneAndUpdate(
      { _id },
      { $set: { ...value, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );
    if (!r.value) return res.status(404).json({ error: 'No encontrado' });
    res.json(r.value);
  } catch {
    res.status(400).json({ error: 'ID inválido' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const _id = new ObjectId(req.params.id);
    const r = await agendasCollection().deleteOne({ _id });
    if (r.deletedCount === 0) return res.status(404).json({ error: 'No encontrado' });
    res.status(204).end();
  } catch {
    res.status(400).json({ error: 'ID inválido' });
  }
});

export default router;
