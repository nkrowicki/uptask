const Usuarios = require('../models/Usuarios');

exports.formCrearCuenta = (req, res) => {
  res.render('crearCuenta', {
    nombrePagina: 'Crear cuenta en uptask'
  });
};

exports.formIniciarSesion = (req, res) => {
  const { error } = res.locals.mensajes;
  res.render('iniciarSesion', {
    nombrePagina: 'Iniciar sesion en uptask',
    error
  });
};

exports.crearCuenta = async (req, res) => {
  const { email, password } = req.body;

  try {
    await Usuarios.create({
      email,
      password
    });

    const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;
    const usuario = {
      email
    };

    await enviarEmail.enviarEmail({
      usuario,
      subject: 'Confirma tu cuenta UpTask',
      confirmarUrl,
      archivo: 'confirmar-cuenta'
    });

    req.flash('correcto', 'Enviarmos un correo, confirma tu cuenta.');
    res.redirect('/iniciar-sesion');
  } catch (error) {
    req.flash(
      'error',
      error.errors.map(error => error.message)
    );
    res.render('crearCuenta', {
      mensajes: req.flash(),
      nombrePagina: 'Crear cuenta en uptask',
      email,
      password
    });
  }
};

exports.formRestablecerPassword = (req, res) => {
  res.render('reestablecer', {
    nombrePagina: 'Reestablecer tu contraseña'
  });
};

exports.confirmarCuenta = async (req, res) => {
  const usuario = await Usuarios.findOne({
    where: {
      email: req.params.correo
    }
  });

  if (!usuario) {
    req.flash('error', 'No valido');
    res.redirect('/crear-cuenta');
  }

  usuario.activo = 1;
  await usuario.save();

  req.flash('correcto', 'Cuenta activada correctamente');
  res.redirect('/iniciar-sesion');
};
