const express = require('express');
const router = express.Router();
const { createLead, getLeads, updateLead, deleteLead } = require('../controllers/leadController');
const auth = require('../middleware/authMiddleware');

// All routes here are protected
router.use(auth);

const { check, validationResult } = require('express-validator');

// @route   POST /api/leads
// @desc    Create a lead
router.post('/', [
    auth,
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('phone', 'Phone number is required').not().isEmpty(),
    ]
], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, createLead);

// @route   GET /api/leads
// @desc    Get all leads with pagination/search/filter
router.get('/', getLeads);

// @route   PUT /api/leads/:id
// @desc    Update a lead
router.put('/:id', updateLead);

// @route   DELETE /api/leads/:id
// @desc    Delete a lead
router.delete('/:id', deleteLead);

module.exports = router;
