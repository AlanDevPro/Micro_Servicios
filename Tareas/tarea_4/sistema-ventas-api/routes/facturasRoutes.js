const express = require('express');
const router = express.Router();
const facturasController = require('../controllers/facturasController');

// Obtener todas las facturas
router.get('/', facturasController.getFacturas);

// Obtener una factura por ID
router.get('/:id', facturasController.getFacturaById);

// Crear una nueva factura
router.post('/', facturasController.createFactura);

// Actualizar una factura existente
router.put('/:id', facturasController.updateFactura);

// Eliminar una factura
router.delete('/:id', facturasController.deleteFactura);

// Obtener todas las facturas de un cliente específico
router.get('/cliente/:clienteId', facturasController.getFacturasByCliente);

module.exports = router;
