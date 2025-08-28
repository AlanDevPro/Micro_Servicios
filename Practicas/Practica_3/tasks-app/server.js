require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/tasksdb';

// Vistas y assets
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

/* --- MODELO (Mongoose) --- */
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now }
});

const Task = mongoose.model('Task', taskSchema);

/* --- RUTAS CRUD --- */

// Lista todas las tareas
app.get('/', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.render('index', { tasks, error: null });
  } catch (err) {
    res.render('index', { tasks: [], error: 'Error al cargar tareas: ' + err.message });
  }
});

// Formulario nueva tarea
app.get('/tasks/new', (req, res) => {
  res.render('new', { error: null, form: { title: '', description: '', status: 'pending' } });
});

// Crear tarea
app.post('/tasks', async (req, res) => {
  const { title, description, status } = req.body;
  if (!title) return res.render('new', { error: 'El título es obligatorio.', form: req.body });

  try {
    await Task.create({ title, description, status });
    res.redirect('/');
  } catch (err) {
    res.render('new', { error: 'Error al crear tarea: ' + err.message, form: req.body });
  }
});

// Ver tarea individual
app.get('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.redirect('/');
    res.render('show', { task });
  } catch (err) {
    res.redirect('/');
  }
});

// Formulario editar tarea
app.get('/tasks/:id/edit', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.redirect('/');
    res.render('edit', { task, error: null });
  } catch (err) {
    res.redirect('/');
  }
});

// Actualizar tarea
app.post('/tasks/:id/update', async (req, res) => {
  const { title, description, status } = req.body;
  if (!title) return res.render('edit', { task: { _id: req.params.id, title, description, status }, error: 'El título es obligatorio.' });

  try {
    await Task.findByIdAndUpdate(req.params.id, { title, description, status }, { runValidators: true });
    res.redirect('/');
  } catch (err) {
    res.render('edit', { task: { _id: req.params.id, title, description, status }, error: 'Error al actualizar: ' + err.message });
  }
});

// Eliminar tarea
app.post('/tasks/:id/delete', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
  } catch (err) {
    console.error('Error al eliminar:', err.message);
  }
  res.redirect('/');
});

/* --- Conexión a Mongo con reintentos (útil al arrancar con Docker Compose) --- */
async function connectWithRetry(retries = 12, delayMs = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      await mongoose.connect(MONGO_URI, { dbName: 'tasksdb' });
      console.log('Conectado a MongoDB en', MONGO_URI);
      return;
    } catch (err) {
      console.log(`Intento ${i+1}/${retries} fallo: ${err.message}. Reintentando en ${delayMs}ms...`);
      await new Promise(r => setTimeout(r, delayMs));
    }
  }
  console.error('No se pudo conectar a MongoDB después de varios reintentos.');
  process.exit(1);
}

/* Iniciar */
connectWithRetry().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`App escuchando en http://localhost:${PORT}`);
  });
});
