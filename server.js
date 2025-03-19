const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://localhost:27017/BACKSTOCK'; // Para base de datos local

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Conectado a MongoDB'))
.catch(err => console.error('❌ Error al conectar a MongoDB:', err));

const usuario = require('./models/usuario');

const nuevoUsuario = new usuario({
  Nombre: 'Sofia',
  Email: 'SOfia@mail.com',
  Contraseña: '456a894',
  IdRol: 82,
})

nuevoUsuario.save()
.then(() => console.log('Usuario creado con éxito'))
.catch(err => console.error('usuario no registrado', err)); 