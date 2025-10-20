const Account = require('../models/Account');

async function listAccounts(req, res) {
  try {
    const accounts = await Account.find().sort({ updatedAt: -1 });
    res.json(accounts);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Lỗi server' });
  }
}

async function getAccount(req, res) {
  try {
    const acc = await Account.findById(req.params.id);
    if (!acc) return res.status(404).json({ message: 'Không tìm thấy' });
    res.json(acc);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Lỗi server' });
  }
}

async function createAccount(req, res) {
  try {
    const acc = await Account.create(req.body);
    res.status(201).json(acc);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Lỗi server' });
  }
}

async function updateAccount(req, res) {
  try {
    const acc = await Account.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!acc) return res.status(404).json({ message: 'Không tìm thấy' });
    res.json(acc);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Lỗi server' });
  }
}

async function deleteAccount(req, res) {
  try {
    const acc = await Account.findByIdAndDelete(req.params.id);
    if (!acc) return res.status(404).json({ message: 'Không tìm thấy' });
    res.json({ message: 'Đã xóa' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Lỗi server' });
  }
}

module.exports = { listAccounts, getAccount, createAccount, updateAccount, deleteAccount };
