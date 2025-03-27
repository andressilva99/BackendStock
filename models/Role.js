const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  IdRole: { type: Number, unique: true },
  Nombre: String,
  Edit: Boolean,
  Add: Boolean,
  Delete: Boolean,
  View: Boolean,
});

//autoincrementar el Id
usuarioSchema.pre('save', async function (next) {
  if (!this.Id) { // Si no tiene un Id asignado
    const ultimoRole = await mongoose.model('Role').findOne().sort({ Id: -1 });
    this.Id = ultimoRole ? ultimoRole.Id + 1 : 1;
  }
  next();
});

const Role = mongoose.model('Role', roleSchema);
module.exports = Role;
