const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Event = require('../models/Event');

// @route   GET api/events
// @desc    Get all events
// @access  Public
router.get('/', async (req, res) => {
    try {
        const events = await Event.find().sort({ date: 1 });
        res.json(events);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/events
// @desc    Create an event
// @access  Private
router.post('/', [
    auth,
    [
        check('title', 'Title is required').not().isEmpty(),
        check('description', 'Description is required').not().isEmpty(),
        check('date', 'Date is required').not().isEmpty(),
        check('location', 'Location is required').not().isEmpty(),
        check('capacity', 'Capacity is required').isNumeric()
    ]
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const newEvent = new Event({
            ...req.body,
            organizer: req.user.id
        });

        const event = await newEvent.save();
        res.json(event);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/events/:id
// @desc    Update an event
// @access  Private
router.put('/:id', auth, async (req, res) => {
    try {
        let event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ msg: 'Event not found' });
        }

        // Make sure user owns the event
        if (event.organizer.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        event = await Event.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        res.json(event);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/events/:id
// @desc    Delete an event
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ msg: 'Event not found' });
        }

        // Make sure user owns the event
        if (event.organizer.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await event.remove();
        res.json({ msg: 'Event removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/events/:id/register
// @desc    Register for an event
// @access  Private
router.put('/:id/register', auth, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ msg: 'Event not found' });
        }

        // Check if user is already registered
        if (event.attendees.includes(req.user.id)) {
            return res.status(400).json({ msg: 'Already registered for this event' });
        }

        // Check if event is full
        if (event.attendees.length >= event.capacity) {
            return res.status(400).json({ msg: 'Event is full' });
        }

        event.attendees.push(req.user.id);
        await event.save();

        res.json(event);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router; 