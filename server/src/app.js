require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const authRoutes = require('./routes/auth');
const accountRoutes = require('./routes/accounts');
const { ensureUserExists } = require('./controllers/authController');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

// Middleware xác thực JWT
function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: 'Thiếu token' });

  const [type, token] = header.split(' ');
  if (type !== 'Bearer' || !token) return res.status(401).json({ message: 'Token không hợp lệ' });

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Token sai hoặc hết hạn' });
  }
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/accounts', authMiddleware, accountRoutes);

// Check server
app.get('/', (req, res) => res.json({ message: 'API hoạt động' }));

ensureUserExists();

module.exports = app;
