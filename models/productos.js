const mongoose = require('mongoose');

const productoShema = new mongoose.Schema({
    IdProducto: Number,
    Descripcion: String,
    FechaIngreso: String,
    CantidadActual: Number
});

module.exports = mongoose.model('producto', productoShema , 'productos');