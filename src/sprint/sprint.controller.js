import Sprint from './sprint.model.js';
import Project from '../project/project.model.js';

export const createSprint = async (req, res) => {
    try {
        const data = req.body;
        
        const project = await Project.findById(data.project).where({ state: true });
        if (!project) {
            return res.status(404).json({ message: 'Project not found or inactive' });
        }

        const nextSprintNumber = project.sprints.length === 0 
            ? 1 
            : project.sprints[project.sprints.length - 1].noSprint + 1;

        const sprint = await Sprint.create({
            ...data,
            number: nextSprintNumber
        });

        project.sprints.push({
            idSprint: sprint._id,
            noSprint: nextSprintNumber
        });
        await project.save();

        return res.status(201).json({
            message: 'Sprint has been created',
            sprint: {
                ...sprint.toObject(),
                number: nextSprintNumber
            }
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Sprint creation failed',
            error: err.message
        });
    }
}

export const getSprints = async (req, res) => {
    try {
        const { projectId }= req.params;
        const sprints = await Sprint.find({project: projectId, status: true })
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

        if (!sprint) {
            return res.status(404).json({
                message: 'Sprint not found'
            });
        }

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


export const stateDurationSprint = async (req, res) => {
    try {
        const { id } = req.params;
        const {state} = req.body;

        const sprint = await Sprint.findByIdAndUpdate(id, {state: state},{ new: true });

        if (!sprint) {
            return res.status(404).json({
                message: 'Sprint not found'
            });
        }

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