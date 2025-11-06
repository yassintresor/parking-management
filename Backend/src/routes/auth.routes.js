const router = require('express').Router();
const { register, login, verify } = require('../controllers/auth.controller');
const { auth } = require('../middlewares/auth.middleware');

router.post('/register', register);
router.post('/login', login);
router.get('/verify', auth, verify);

module.exports = router;