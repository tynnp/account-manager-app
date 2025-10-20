const express = require('express');
const router = express.Router();
const {
  listAccounts,
  getAccount,
  createAccount,
  updateAccount,
  deleteAccount
} = require('../controllers/accountsController');

router.get('/', listAccounts);
router.get('/:id', getAccount);
router.post('/', createAccount);
router.put('/:id', updateAccount);
router.delete('/:id', deleteAccount);

module.exports = router;
