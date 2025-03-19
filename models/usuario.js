const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  Id: { type: Number, unique: true },
  Nombre: String,
  Email: String,
  Contraseña: String,
  IdRol: Number,
});

//autoincrementar el Id
usuarioSchema.pre('save', async function (next) {
  if (!this.Id) { // Si no tiene un Id asignado
    const ultimoUsuario = await mongoose.model('Usuario').findOne().sort({ Id: -1 });
    this.Id = ultimoUsuario ? ultimoUsuario.Id + 1 : 1;
  }
  next();
});

const Usuario = mongoose.model('Usuario', usuarioSchema);
module.exports = Usuario;
