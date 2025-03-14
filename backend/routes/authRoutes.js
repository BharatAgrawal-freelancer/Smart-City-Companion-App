const router = require('express').Router();
const { signup, login , getUserDetail } = require('../controllers/authController');

router.post('/signup', signup);
router.post('/login', login);
router.post('/get-user', getUserDetail);

module.exports = router;
