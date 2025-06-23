import Sprint from './sprint.model.js';

export const createSprint = async (req, res) => {
    try {
        const data = req.body;

        const sprint = await Sprint.create(data);

        return res.status(201).json({
            message: 'Sprint has been created',
            sprint
        })
    } catch ( err ) {
        return res.status(500).json({
            message: 'Sprint creation failed',
            error: err.message
        });
    }
}

export const getSprints = async (req, res) => {
    try {
        const sprints = await Sprint.find({ status: true })
            .populate('task')
            .populate('project');

        return res.status(200).json({
            message: 'Sprints fetched successfully',
            sprints
        })
    } catch (err) {
        return res.status(500).json({
            message: 'Error fetching sprints',
            error: err.message
        })
    }
}

export const getSprint = async (req, res) => {
    try {
        const { id } = req.params;

        const sprint = await Sprint.findById(id)
            .populate('task')
            .populate('project');

        if (!sprint) {
            return res.status(404).json({
                message: 'Sprint not found'
            });
        }

        return res.status(200).json({
            message: 'Sprint fetched successfully',
            sprint
        })
    } catch (err) {
        return res.status(500).json({
            message: 'Error fetching sprint',
            error: err.message
        });
    }
}

export const updateSprint = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const sprint = await Sprint.findByIdAndUpdate(id, data, { new: true });
        return res.status(200).json({
            message: 'Sprint updated successfully',
            sprint
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Error updating sprint',
            error: err.message
        })
    }
}

export const deleteSprint = async (req, res) => {
    try {
        const { id } = req.params;

        const sprint = await Sprint.findByIdAndUpdate(id, { status: false }, { new: true });

        if (!sprint) {
            return res.status(404).json({
                message: 'Sprint not found'
            })
        }

        return res.status(200).json({
            message: 'Sprint deleted successfully',
            sprint
        })
    } catch (err) {
        return res.status(500).json({
            message: 'Error deleting sprint',
            error: err.message
        })
    }
}

export const searchSprints = async (req, res) => {
    try {
        const { number, state, dateStart, dateEnd } = req.query;
        const filter = { status: true };
        if (number) filter.number = Number(number);
        if (state) filter.state = state;
        if (dateStart || dateEnd) {
            filter.date = {};
            if (dateStart) filter.date.$gte = new Date(dateStart);
            if (dateEnd) filter.date.$lte = new Date(dateEnd);
        }
        const sprints = await Sprint.find(filter)
            .populate('task')
            .populate('project');
        return res.status(200).json({
            message: 'Sprints fetched successfully',
            sprints
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Error searching sprints',
            error: err.message
        });
    }
}