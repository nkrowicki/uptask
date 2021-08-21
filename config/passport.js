const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const Usuario = require('../models/Usuarios');

// local strategy - login con credenciales propias (user y pw)
passport.use(
  new LocalStrategy(
    // x default espera user y pw
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done) => {
      try {
        const usuario = await Usuario.findOne({
          where: {
            email,
            activo: 1
          }
        });
        // Puede ser que el password sea incorrecto
        if (!usuario.verificarPassword(password)) {
          return done(null, false, {
            message: 'Password incorrecto'
          });
        }
        // El email existe y pw correcto
        return done(null, usuario);
      } catch (error) {
        //   El usuario no existe
        return done(null, false, { message: 'Esta cuenta no existe' });
      }
    }
  )
);

// Serializar el usuario

passport.serializeUser((usuario, callback) => {
  callback(null, usuario);
});

// Deserializar el usuario
passport.deserializeUser((usuario, callback) => {
  callback(null, usuario);
});

module.exports = passport;
