const Lead = require('../models/Lead');
const User = require('../models/User');

// @desc    Create a lead
// @route   POST /api/leads
exports.createLead = async (req, res) => {
    try {
        const { name, email, phone, status, assignedTo } = req.body;
        
        let assigneeName = assignedTo;

        if (!assigneeName) {
            const user = await User.findById(req.user.id);
            assigneeName = user.username;
        }

        const newLead = new Lead({
            name,
            email,
            phone,
            status,
            assignedTo: assigneeName
        });

        const lead = await newLead.save();
        res.status(201).json(lead);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Get all leads with pagination, search, and status filter
// @route   GET /api/leads
exports.getLeads = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', status = '' } = req.query;
        
        const user = await User.findById(req.user.id);
        const query = { assignedTo: user.username };

        if (status) {
            query.status = status;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } }
            ];
        }

        const leads = await Lead.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Lead.countDocuments(query);

        res.json({
            leads,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            totalLeads: count
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Update lead
// @route   PUT /api/leads/:id
exports.updateLead = async (req, res) => {
    try {
        let lead = await Lead.findById(req.params.id);

        if (!lead) {
            return res.status(404).json({ message: 'Lead not found' });
        }

        const user = await User.findById(req.user.id);
        if (lead.assignedTo !== user.username) {
            return res.status(401).json({ message: 'Not authorized to update this lead' });
        }

        lead = await Lead.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        res.json(lead);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Delete a lead
// @route   DELETE /api/leads/:id
exports.deleteLead = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id);

        if (!lead) {
            return res.status(404).json({ message: 'Lead not found' });
        }

        const user = await User.findById(req.user.id);
        if (lead.assignedTo !== user.username) {
            return res.status(401).json({ message: 'Not authorized to delete this lead' });
        }

        await Lead.findByIdAndDelete(req.params.id);

        res.json({ message: 'Lead removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
