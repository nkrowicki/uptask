const passport = require('passport');
const Usuarios = require('../models/Usuarios');
const crypto = require('crypto');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const bcrypt = require('bcrypt');
const enviarEmail = require('../handlers/email');

exports.autenticarUsuario = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/iniciar-sesion',
  failureFlash: true,
  badRequestMessage: 'Ambos Campos son Obligatorios'
});

// Revisar si el usuario esta logead

exports.usuarioAutenticado = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect('iniciar-sesion');
};

exports.cerrarSesion = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};

exports.enviarToken = async (req, res) => {
  const { email } = req.body;
  const usuario = await Usuarios.findOne({ where: { email } });

  if (!usuario) {
    req.flash('error', 'No existe esa cuenta');
    res.render('reestablecer', {
      nombrePagina: 'Reestablecer contraseña',
      mensajes: req.flash()
    });
  }

  usuario.token = crypto.randomBytes(20).toString('hex');
  usuario.expiracion = Date.now() + 3600000;

  await usuario.save();

  const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;

  await enviarEmail.enviar({
    usuario,
    subject: 'Password Reset',
    resetUrl,
    archivo: 'reestablecer-password'
  });

  req.flash('correcto', 'Se envio un mensaje a tu correo');
  res.redirect('/iniciar-sesion');
};

exports.validarToken = async (req, res) => {
  const usuario = await Usuarios.findOne({
    where: {
      token: req.params.token
    }
  });

  if (!usuario) {
    req.flash('error', 'No valido');
    res.redirect('/reestablecer');
  }

  res.render('resetPassword', {
    nombrePagina: 'Reestablecer contraseña'
  });
};

exports.actualizarPassword = async (req, res) => {
  const { token } = req.params;

  const usuario = await Usuarios.findOne({
    where: {
      token,
      expiracion: {
        [Op.gte]: Date.now()
      }
    }
  });

  if (!usuario) {
    req.flash('error', 'No valido');
    res.redirect('/reestablecer');
  }

  console.log(`req.body.password: `, req.body.password);

  usuario.password = bcrypt.hashSync(req.body.password, 10);
  usuario.token = null;
  usuario.expiracion = null;

  usuario.save();

  req.flash('correcto', 'Tu password se ha modificado correctamente ');
  res.redirect('/iniciar-sesion');
};
