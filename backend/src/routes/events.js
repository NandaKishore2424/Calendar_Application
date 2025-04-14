const express = require('express');
const eventsController = require('../controllers/eventsController');
const router = express.Router();

router.get('/', eventsController.getEvents); 

router.post('/', eventsController.createEvent); 

router.put('/:id', eventsController.updateEvent);
router.delete('/:id', eventsController.deleteEvent);

module.exports = router;