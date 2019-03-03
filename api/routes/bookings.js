const router = require('express').Router();
const BookingsController = require('../controller/BookingsController');

router.post('/', BookingsController.create);
router.get('/', BookingsController.viewBookings);

module.exports = router;