const mongoose = require('mongoose');

const productoShema = new mongoose.Schema({
    IdProducto: Number,
    Descripcion: String, //ver articulo y modelo
    FechaIngreso: String,
    CantidadActual: Number
});

module.exports = mongoose.model('producto', productoShema , 'productos');