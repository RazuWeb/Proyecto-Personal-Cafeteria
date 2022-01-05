const {Router} = require('express');
const router = Router();

const { postPyament } = require('../controllers/paymentIntes.controllers')

router.post('/create-checkout-session', postPyament);

module.exports = router;