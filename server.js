const express = require('express');
const mongoose = require('mongoose');
const Usuario = require('./models/usuario'); 
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const MONGO_URI = 'mongodb://localhost:27017/BACKSTOCK';
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Conectado a MongoDB'))
.catch(err => console.error('❌ Error al conectar a MongoDB:', err));

app.post('/register', async (req, res) => {
  try {
    const { nombreUsuario, email, contraseña } = req.body;
    const idRol = `ROL-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    
    const nuevoUsuario = new Usuario({
      Nombre: nombreUsuario,
      Email: email,
      Contraseña: contraseña,
      IdRol: idRol,
    });

    await nuevoUsuario.save();
    console.log('Usuario guardado', nuevoUsuario);
    res.json({ mensaje: 'Usuario registrado con éxito', usuario: nuevoUsuario.toObject() });

  } catch (error) {
    res.status(500).json({ mensaje: 'Error al registrar usuario', error });
  }
});

app.listen(3000, () => console.log('🚀 Servidor corriendo en http://localhost:3000'));
