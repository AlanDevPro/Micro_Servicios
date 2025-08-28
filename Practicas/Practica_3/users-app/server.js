require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));

const dbConfig = {
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'user',
  password: process.env.DB_PASS || 'userpassword',
  database: process.env.DB_NAME || 'usersdb',
  waitForConnections: true,
  connectionLimit: 10
};

let pool;

async function initDbWithRetry(retries = 12, delayMs = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      pool = mysql.createPool(dbConfig);
      // crear tabla si no existe (idempotente)
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;
      await pool.query(createTableSQL);
      console.log('Conectado a DB y tabla "users" asegurada.');
      return;
    } catch (err) {
      console.log(`Intento ${i+1}/${retries} - DB no lista todavía: ${err.message}`);
      await new Promise(r => setTimeout(r, delayMs));
    }
  }
  throw new Error('No se pudo conectar a la base de datos luego de varios intentos.');
}

/* RUTAS */

app.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name, email, created_at FROM users ORDER BY id DESC');
    res.render('index', { users: rows, error: null });
  } catch (err) {
    res.render('index', { users: [], error: 'Error al leer usuarios: ' + err.message });
  }
});

app.get('/users/new', (req, res) => {
  res.render('new', { error: null, form: { name: '', email: '' } });
});

app.post('/users', async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.render('new', { error: 'Nombre y correo son obligatorios.', form: { name, email } });
  }
  try {
    await pool.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email]);
    res.redirect('/');
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.render('new', { error: 'El correo ya existe.', form: { name, email } });
    }
    res.render('new', { error: 'Error al guardar: ' + err.message, form: { name, email } });
  }
});

app.post('/users/:id/delete', async (req, res) => {
  const id = req.params.id;
  try {
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
    res.redirect('/');
  } catch (err) {
    res.render('index', { users: [], error: 'Error al eliminar: ' + err.message });
  }
});

/* Inicializar DB y arrancar servidor */
initDbWithRetry()
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('No se pudo iniciar la app por fallo en DB:', err.message);
    process.exit(1);
  });
