const express = require('express');
const mongoose = require('mongoose');
const Usuario = require('./models/usuario'); 
const Producto = require('./models/productos');
const Role = require('./models/Role')
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

//MANEJO DE USUARIOS//

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




//MANEJO DE PRODUCTOS//

app.get('/productos', async (req, res) => {
  const productos = await Producto.find();
  res.json(productos);
});

// Agregar producto
app.post('/productos', async (req, res) => {
  try {
    const { Descripcion, FechaIngreso, CantidadActual } = req.body;
    const ultimo = await Producto.findOne().sort({ IdProducto: -1 });
    const nuevoId = ultimo ? ultimo.IdProducto + 1 : 1;

    const nuevoProducto = new Producto({
      IdProducto: nuevoId,
      Descripcion,
      FechaIngreso,
      CantidadActual
    });

    await nuevoProducto.save();
    res.status(201).json({ mensaje: 'Producto agregado', producto: nuevoProducto });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al agregar producto', error });
  }
});

// Eliminar producto
app.delete('/productos/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await Producto.deleteOne({ IdProducto: id });
    res.json({ mensaje: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar producto', error });
  }
});

// Editar producto (PUT)
app.put('/productos/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { Descripcion, FechaIngreso, CantidadActual } = req.body;

    const actualizado = await Producto.findOneAndUpdate(
      { IdProducto: id },
      { Descripcion, FechaIngreso, CantidadActual },
      { new: true }
    );

    if (!actualizado) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    res.json({ mensaje: 'Producto actualizado', producto: actualizado });

  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar producto', error });
  }
});

//MANEJO DE ROLES//

app.get('/Role', async (req, res) => {
  const roles = await Role.find();
  res.json(roles);
});

// Agregar Role
app.post('/Role', async (req, res) => {
  try {
    const { Nombre, Edit, Add, Delete, View } = req.body;
    const ultimo = await Role.findOne().sort({ IdRole: -1 });
    const nuevoId = ultimo ? ultimo.IdRole + 1 : 1;

    const nuevoRole = new Role({
      IdRole: nuevoId,
      Nombre, 
      Edit, 
      Add, 
      Delete, 
      View
    });

    await nuevoRole.save();
    res.status(201).json({ mensaje: 'Role agregado', Role: nuevoRole });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al agregar Role', error });
  }
});

// Eliminar role
app.delete('/Role/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await Role.deleteOne({ IdRole: id });
    res.json({ mensaje: 'Role eliminado' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar Role', error });
  }
});

// Editar role (PUT)
app.put('/Role/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { Nombre, Edit, Add, Delete, View } = req.body;

    const actualizado = await Role.findOneAndUpdate(
      { IdRole: id },
      { Nombre, Edit, Add, Delete, View },
      { new: true }
    );

    if (!actualizado) {
      return res.status(404).json({ mensaje: 'Role no encontrado' });
    }

    res.json({ mensaje: 'Role actualizado', Role: actualizado });

  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar producto', error });
  }
});




app.listen(3000, () => console.log('🚀 Servidor corriendo en http://localhost:3000'));