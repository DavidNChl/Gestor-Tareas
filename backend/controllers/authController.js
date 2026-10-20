const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Hashing nativo seguro (scrypt) sin fallos de compilación/red
function hashPassword(password) {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString('hex');
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(`${salt}.${derivedKey.toString('hex')}`);
    });
  });
}

function verifyPassword(password, storedHash) {
  return new Promise((resolve, reject) => {
    const [salt, key] = storedHash.split('.');
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(key === derivedKey.toString('hex'));
    });
  });
}

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Correo y contraseña son obligatorios' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado' });
    }

    const hashedPassword = await hashPassword(password);
    const newUser = await User.create({ email, password: hashedPassword });

    res.status(201).json({ message: 'Usuario registrado exitosamente', userId: newUser.id });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: error.message || 'Error en el servidor al registrar' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: 'Credenciales inválidas' });
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email }, 
      process.env.JWT_SECRET || 'secreto_desarrollo', 
      { expiresIn: '8h' }
    );

    res.json({ message: 'Autenticación exitosa', token, user: { email: user.email } });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error en el servidor al iniciar sesión' });
  }
};