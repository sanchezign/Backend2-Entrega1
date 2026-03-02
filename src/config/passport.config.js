import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '../models/User.js';   // ← Asegúrate que esta ruta sea correcta

// Función que extrae el token de la cookie (nombre que usamos en el login)
const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['coderCookieToken'];   // ← mismo nombre que en sessionsRouter
    }
    return token;
};

// Opciones de la estrategia JWT
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
    secretOrKey: process.env.JWT_SECRET || 'unaClaveMuyLargaYSecreta123', // ← fallback por si no hay .env
};

// Estrategia "current" ← nombre exacto que pide la consigna
passport.use(
    'current',
    new JwtStrategy(jwtOptions, async (jwt_payload, done) => {
        try {
            // Buscamos al usuario por el id que viene en el token
            const user = await User.findById(jwt_payload.id);

            if (!user) {
                // Token válido pero usuario ya no existe → no autorizado
                return done(null, false, { message: 'Usuario no encontrado' });
            }

            // Todo ok → devolvemos el usuario completo
            return done(null, user);
        } catch (error) {
            console.error('Error en estrategia current:', error);
            return done(error, false);
        }
    })
);

// Opcional: si querés serializar/deserializar (no es necesario con JWT puro)
passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

export default passport;
