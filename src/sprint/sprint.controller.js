import Sprint from "./sprint.model.js";
import Project from "../project/project.model.js";
import Backlog from "../backlog/backlog.model.js";

export const createSprint = async (req, res) => {
  try {
    const data = req.body;

    const backlogIds = data.backlog || [];

    const validBacklogs = await Backlog.find({
      _id: { $in: backlogIds },
      status: true,
    });

    if (validBacklogs.length !== backlogIds.length) {
      return res.status(400).json({
        message: "Uno o más backlog no existen o están inactivos",
      });
    }

    for (const backlogId of backlogIds) {
      await Backlog.findByIdAndUpdate(
        backlogId,
        { state: "ReadySprint" },
        { new: true }
      );
    }

    const project = await Project.findById(data.project).where({ state: true });
    if (!project) {
      return res.status(404).json({ message: "Project not found or inactive" });
    }

    const nextSprintNumber =
      project.sprints.length === 0
        ? 1
        : project.sprints[project.sprints.length - 1].noSprint + 1;

    const sprint = await Sprint.create({
      ...data,
      number: nextSprintNumber,
    });

    project.sprints.push({
      idSprint: sprint._id,
      noSprint: nextSprintNumber,
    });
    await project.save();

    return res.status(201).json({
      message: "Sprint has been created",
      sprint: {
        ...sprint.toObject(),
        number: nextSprintNumber,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: "Sprint creation failed",
      error: err.message,
    });
  }
};

export const getSprints = async (req, res) => {
  try {
    const { projectId } = req.params;
    const sprints = await Sprint.find({
      project: projectId,
      status: true,
    }).populate("project");

    return res.status(200).json({
      message: "Sprints fetched successfully",
      sprints,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error fetching sprints",
      error: err.message,
    });
  }
};

export const getSprint = async (req, res) => {
  try {
    const { id } = req.params;

    const sprint = await Sprint.findById(id).populate("project");

    if (!sprint) {
      return res.status(404).json({
        message: "Sprint not found",
      });
    }

    return res.status(200).json({
      message: "Sprint fetched successfully",
      sprint,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error fetching sprint",
      error: err.message,
    });
  }
};

export const updateSprint = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const sprint = await Sprint.findByIdAndUpdate(id, data, { new: true });

    if (data.state == "Finalizado") {
      for (const backlogId of sprint.backlog) {
        await Backlog.findByIdAndUpdate(
          backlogId,
          { state: "Discarded" },
          { new: true }
        );
      }
    }

    if (!sprint) {
      return res.status(404).json({
        message: "Sprint not found",
      });
    }

    return res.status(200).json({
      message: "Sprint updated successfully",
      sprint,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error updating sprint",
      error: err.message,
    });
  }
};

export const stateDurationSprint = async (req, res) => {
  try {
    const { id } = req.params;
    const { state } = req.body;

    const sprint = await Sprint.findByIdAndUpdate(
      id,
      { state: state },
      { new: true }
    );

    if (state == "Finalizado") {
      for (const backlogId of sprint.backlog) {
        await Backlog.findByIdAndUpdate(
          backlogId,
          { state: "Discarded" },
          { new: true }
        );
      }
    }

    if (!sprint) {
      return res.status(404).json({
        message: "Sprint not found",
      });
    }

    return res.status(200).json({
      message: "Sprint updated successfully",
      sprint,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error updating sprint",
      error: err.message,
    });
  }
};

export const deleteSprint = async (req, res) => {
  try {
    const { id } = req.params;

    const sprint = await Sprint.findByIdAndUpdate(
      id,
      { status: false },
      { new: true }
    );

    if (!sprint) {
      return res.status(404).json({
        message: "Sprint not found",
      });
    }

    return res.status(200).json({
      message: "Sprint deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error deleting sprint",
      error: err.message,
    });
  }
};

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
      .populate("task")
      .populate("project");
    return res.status(200).json({
      message: "Sprints fetched successfully",
      sprints,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error searching sprints",
      error: err.message,
    });
  }
};

export const addBacklogToSprint = async (req, res) => {
  try {
    const { id } = req.params;
    const { backlogId } = req.body;

    const sprint = await Sprint.findOne({ _id: id, status: true });

    if (!sprint) {
      return res.status(404).json({ message: "Sprint not found" });
    }

    const backlog = await Backlog.findOne({ _id: backlogId, status: true });
    if (!backlog) {
      return res.status(404).json({ message: "Backlog not found " });
    }

    if (sprint.backlog.includes(backlogId)) {
      return res.status(400).json({ message: "Backlog already in sprint" });
    }

    sprint.backlog.push(backlogId);
    await sprint.save();

    backlog.state = "ReadySprint";
    await backlog.save();

    return res.status(200).json({
      message: "Backlog added to sprint successfully",
      sprint,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error adding backlog to sprint",
      error: err.message,
    });
  }
};

export const removeBacklogFromSprint = async (req, res) => {
  try {
    const { id } = req.params;
    const { backlogId } = req.body;

    const sprint = await Sprint.findOne({ _id: id, status: true });
    if (!sprint) {
      return res.status(404).json({ message: "Sprint not found" });
    }

    if (!sprint.backlog.includes(backlogId)) {
      return res.status(404).json({ message: "Backlog not found in sprint" });
    }

    sprint.backlog = sprint.backlog.filter(
      id => id.toString() !== backlogId
    );
    await sprint.save();

    await Backlog.findByIdAndUpdate(backlogId, {state: "Pending"}, {new: true,});

    return res.status(200).json({
      message: "Backlog removed from sprint",
      sprint
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error removing backlog from sprint",
      error: err.message
    });
  }
};
