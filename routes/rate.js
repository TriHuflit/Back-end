const express = require('express');
const router = express.Router();
const rateController = require('../controllers/RateController');

router.post('/:id', rateController.rate);

module.exports = router;