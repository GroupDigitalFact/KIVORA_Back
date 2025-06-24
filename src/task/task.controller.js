import Project from "../project/project.model.js";
import Sprint from "../sprint/sprint.model.js";
import Cluster from "../cluster/cluster.model.js";
import Task from "./task.model.js";

export const addTask = async (req, res) => {
  try {
    const { title, description, sprint, assignedTo, scrumMasterId } = req.body; 

    const sprintDoc = await Sprint.findById(sprint);
    
    if (!sprintDoc) return res.status(404).json({ 
      message: "Sprint not found" 
    });

    const project = await Project.findById(sprintDoc.project);
    if (!project) return res.status(404).json({ 
      message: "Project not found" 
    });

    if (project.scrumMaster.toString() !== scrumMasterId) {
      return res.status(403).json({ 
        message: "Only the scrumMaster can assign tasks" 
      });
    }

    const group = await Cluster.findById(project.cluster);
    if (!group) return res.status(404).json({ 
      message: "Group not found" 
    });

    const isMember = group.integrantes.some(
      (i) => i.usuario.toString() === assignedTo
    );
    if (!isMember) {
      return res.status(400).json({ 
        message: "Assigned user is not in the group" 
      });
    }

    const task = await Task.create({ title, description, sprint, assignedTo });

    await Sprint.findByIdAndUpdate(sprint, { $push: { task: task._id } });

    return res.status(200).json({
      message: "Task created successfully",
      task: task
    });
  } catch (error) {
    res.status(500).json({
      message: "Error adding task",
      error: error.message
    });
  }
};

export const listTasks = async (req, res) => {
  try {
    const filter = req.body || {};

    const tasks = await Task.find(filter);

    return res.status(200).json({ 
      tasks 
    });

  } catch (err) {

    return res.status(500).json({ 
      message: "Error listing tasks", 
      error: err.message 
    });
  }
};


export const updateTask = async (req, res) => {
  try {
    const data = req.body;

    const task = await Task.findByIdAndUpdate(id, data, { new: true });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "task not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task: task,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error updating task",
      error: err.message,
    });
  }
};


export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Task.findByIdAndUpdate(
      id,
      { estado: true },
      { new: true }
    );
    if (!service) {
      return res.status(404).json({
        message: "service not found",
      });
    }

    return res.status(200).json({
      message: "Service deleted success fully",
    });
  } catch (err) {
    return res.status(500).json({
      succes: false,
      message: "Error deleting service",
      error: err.message,
    });
  }
};

export const reassignTask = async (req, res) => {
  try {
    const { taskId, newUserId } = req.body;

    const task = await Task.findById(taskId).populate({
      path: "sprint",
      populate: {
        path: "project",
        populate: { path: "cluster" }
      }
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const group = task.sprint.project.cluster;
    const isMember = group.integrantes.some(
      (i) => i.usuario.toString() === newUserId
    );
    if (!isMember) {
      return res.status(400).json({ message: "User is not in the group" });
    }

    task.assignedTo = newUserId;
    await task.save();

    return res.status(200).json({
      message: "Task reassigned successfully",
      task
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error reassigning task",
      error: err.message
    });
  }
};

export const markTaskUrgent = async (req, res) => {
  try {
    const { taskId } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    task.isUrgent = true;
    await task.save();

    return res.status(200).json({
      message: "Tarea marcada como urgente",
      task
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error al marcar como urgente",
      error: err.message
    });
  }
};


export const setTaskTags = async (req, res) => {
  try {
    const { taskId, tags } = req.body;

    if (!Array.isArray(tags)) {
      return res.status(400).json({ message: "Tags debe ser un array de strings" });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    task.tags = tags;
    await task.save();

    return res.status(200).json({
      message: "Etiquetas asignadas correctamente",
      task
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error al asignar etiquetas",
      error: err.message
    });
  }
};

