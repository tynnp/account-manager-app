const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET;
const DEFAULT_PIN = process.env.DEFAULT_PIN;

async function ensureUserExists() {
  const existing = await User.findOne();
  if (!existing) {
    await User.create({ pin: DEFAULT_PIN });
    console.log(`Default user created with PIN: ${DEFAULT_PIN}`);
  }
}

async function login(req, res) {
  try {
    const { pin } = req.body;
    if (!pin) return res.status(400).json({ message: 'Thiếu PIN' });

    const user = await User.findOne();
    if (!user) return res.status(500).json({ message: 'Chưa có user' });

    if (pin !== user.pin) {
      return res.status(401).json({ message: 'PIN sai' });
    }

    const token = jwt.sign({ sub: user._id }, JWT_SECRET, { expiresIn: '1m' });
    res.json({ token });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Lỗi server' });
  }
}

async function changePin(req, res) {
  try {
    const { oldPin, newPin } = req.body;
    if (!oldPin || !newPin) return res.status(400).json({ message: 'Thiếu dữ liệu' });

    const user = await User.findOne();
    if (!user) return res.status(500).json({ message: 'Chưa có user' });

    if (user.pin !== oldPin) {
      return res.status(401).json({ message: 'PIN cũ sai' });
    }

    user.pin = newPin;
    await user.save();
    res.json({ message: 'Đổi PIN thành công' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Lỗi server' });
  }
}

module.exports = { ensureUserExists, login, changePin };
