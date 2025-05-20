require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Usuario = require('./models/usuario'); 
const Producto = require('./models/productos');
const Role = require('./models/Role');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// ========== CONEXIÓN A MONGODB ATLAS ==========

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: { version: '1', strict: true, deprecationErrors: true }
})
.then(() => console.log('✅ Conectado a MongoDB Atlas'))
.catch(err => console.error('❌ Error al conectar a MongoDB Atlas:', err));

// ========== MANEJO DE USUARIOS ==========

app.get('/usuarios', async (req, res) => {   //GET USUARIOS
  try {
    const usuarios = await Usuario.find();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener usuarios', error });
  }
});


app.post('/usuarios', async (req, res) => {  //POST USUARIOS
  try {
    const { nombreUsuario, email, contraseña } = req.body;
    
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

app.put('/usuarios/:id', async (req, res) => {   //PUT USUARIOS
  try {
    const id = parseInt(req.params.id);
    const { Nombre, Email, Contraseña, IdRol } = req.body;

    const actualizado = await Usuario.findOneAndUpdate(
      { Id: id },
      { Nombre, Email, Contraseña, IdRol },
      { new: true }
    );

    if (!actualizado) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.json({ mensaje: 'Usuario actualizado', usuario: actualizado });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar usuario', error });
  }
});


app.delete('/usuarios/:id', async (req, res) => {   //DELETE USUARIOS
  try {
    const id = parseInt(req.params.id);
    const eliminado = await Usuario.deleteOne({ Id: id });

    if (eliminado.deletedCount === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.json({ mensaje: 'Usuario eliminado' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar usuario', error });
  }
});





// ========== MANEJO DE PRODUCTOS ==========

app.get('/productos', async (req, res) => {  // GET PRODUCTOS
  const productos = await Producto.find();
  res.json(productos);
});

app.post('/productos', async (req, res) => {  // POST PRODUCTOS
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

app.put('/productos/:id', async (req, res) => {  // PUT PRODUCTOS
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

app.delete('/productos/:id', async (req, res) => {  // DELETE PRODUCTOS
  try {
    const id = parseInt(req.params.id);
    await Producto.deleteOne({ IdProducto: id });
    res.json({ mensaje: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar producto', error });
  }
});

// ========== MANEJO DE ROLES ==========

app.get('/roles', async (req, res) => {  // GET ROLES
  const roles = await Role.find();
  res.json(roles);
});

app.post('/roles', async (req, res) => {  // POST ROLES
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
    res.status(201).json({ mensaje: 'Rol agregado', rol: nuevoRole });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al agregar rol', error });
  }
});

app.put('/roles/:id', async (req, res) => {  // PUT ROLES
  try {
    const actualizado = await Role.findOneAndUpdate(
      { IdRole: parseInt(req.params.id) },
      req.body,
      { new: true }
    );
    res.json({ mensaje: 'Rol actualizado', rol: actualizado });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar rol', error });
  }
});

app.delete('/roles/:id', async (req, res) => {  // DELETE ROLES
  try {
    await Role.deleteOne({ IdRole: parseInt(req.params.id) });
    res.json({ mensaje: 'Rol eliminado' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar rol', error });
  }
});

//========================== MANEJO DE USUARIOS - BACK Y FRONT =======================================


app.post('/login', async (req, res) => {
  const { usuario, contraseña } = req.body;

  try {
    const usuarioEncontrado = await Usuario.findOne({
      $or: [
        { Nombre: usuario },
        { Email: usuario }
      ]
    });

    if (!usuarioEncontrado) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    if (usuarioEncontrado.Contraseña !== contraseña) {
      return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
    }

    res.json(usuarioEncontrado);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el login', error });
  }
});


app.listen(3000, () => console.log('🚀 Servidor corriendo en http://localhost:3000'));
