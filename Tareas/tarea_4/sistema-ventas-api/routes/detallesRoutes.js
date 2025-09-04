const express = require('express');
const router = express.Router();
const detallesController = require('../controllers/detallesController');

router.get('/factura/:facturaId', detallesController.getDetallesByFactura);
router.post('/', detallesController.createDetalle);
router.put('/:id', detallesController.updateDetalle);
router.delete('/:id', detallesController.deleteDetalle);

module.exports = router;
