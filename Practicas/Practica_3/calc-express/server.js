const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Motor de vistas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Para leer body de formularios (x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));

function calcular(a, b, op) {
  switch (op) {
    case 'sumar': return a + b;
    case 'restar': return a - b;
    case 'multiplicar': return a * b;
    case 'dividir': return a / b;
    default: throw new Error('Operación no soportada');
  }
}

app.get('/', (req, res) => {
  res.render('index', {
    result: null,
    error: null,
    form: { a: '', b: '', operation: 'sumar' }
  });
});

app.post('/calcular', (req, res) => {
  const { a, b, operation } = req.body;
  const numA = parseFloat(a);
  const numB = parseFloat(b);

  if (Number.isNaN(numA) || Number.isNaN(numB)) {
    return res.render('index', {
      result: null,
      error: 'Ingrese números válidos en A y B.',
      form: { a, b, operation }
    });
  }

  if (operation === 'dividir' && numB === 0) {
    return res.render('index', {
      result: null,
      error: 'No se puede dividir entre cero.',
      form: { a, b, operation }
    });
  }

  const result = calcular(numA, numB, operation);

  res.render('index', {
    result,
    error: null,
    form: { a, b, operation }
  });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
