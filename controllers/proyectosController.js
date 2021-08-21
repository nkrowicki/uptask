const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');

exports.proyectosHome = async (req, res) => {
  const usuarioId = res.locals.usuario.id;
  const proyectos = await Proyectos.findAll({ where: { usuarioId } });

  res.render('index', {
    nombrePagina: 'Proyectos',
    proyectos
  });
};

exports.formularioProyecto = async (req, res) => {
  const usuarioId = res.locals.usuario.id;
  const proyectos = await Proyectos.findAll({ where: { usuarioId } });
  res.render('nuevoProyecto', {
    nombrePagina: 'Nuevo proyecto',
    proyectos
  });
};

exports.nuevoProyecto = async (req, res) => {
  const usuarioId = res.locals.usuario.id;
  const proyectos = await Proyectos.findAll({ where: { usuarioId } });

  const { nombre } = req.body;
  let errores = [];
  if (!nombre) {
    errores.push({ texto: 'Agrega nombre al proyecto!' });
  }

  if (errores.length > 0) {
    res.render('nuevoProyecto', {
      nombrePagina: 'Nuevo Proyecto',
      errores,
      proyectos
    });
  } else {
    const usuarioId = res.locals.usuario.id;
    await Proyectos.create({ nombre, usuarioId });
    res.redirect('/');
  }
};

exports.actualizarProyecto = async (req, res) => {
  const { nombre } = req.body;
  let errores = [];
  if (!nombre) {
    errores.push({ texto: 'Agrega nombre al proyecto!' });
  }

  if (errores.length > 0) {
    res.render('nuevoProyecto', {
      nombrePagina: 'Nuevo Proyecto',
      errores
    });
  } else {
    await Proyectos.update({ nombre: nombre }, { where: { id: req.params.id } });
    res.redirect('/');
  }
};

exports.proyectoUrl = async (req, res, next) => {
  const usuarioId = res.locals.usuario.id;
  const proyectosPromise = Proyectos.findAll({ where: { usuarioId } });

  const proyectoPromise = Proyectos.findOne({
    where: {
      url: req.params.url,
      usuarioId
    }
  });

  const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

  const tareas = await Tareas.findAll({
    where: {
      proyectoId: proyecto.id
    }
  });

  if (!proyecto) return next();

  res.render('tareas', {
    nombrePagina: 'Tareas del proyecto',
    proyecto,
    proyectos,
    tareas
  });
};

exports.formularioEditar = async (req, res) => {
  const usuarioId = res.locals.usuario.id;
  const proyectosPromise = Proyectos.findAll({ where: { usuarioId } });

  const proyectoPromise = Proyectos.findOne({
    where: {
      id: req.params.id,
      usuarioId
    }
  });

  const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

  res.render('nuevoProyecto', {
    nombrePagina: 'Editar Proyecto',
    proyectos,
    proyecto
  });
};

exports.eliminarProyecto = async (req, res, next) => {
  const { urlProyecto } = req.query;

  const resultado = await Proyectos.destroy({ where: { url: urlProyecto } });

  if (!resultado) {
    return next();
  }

  res.status(200).send('Proyecto eliminado correctamente');
};
