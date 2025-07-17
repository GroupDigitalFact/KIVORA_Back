import Project from "../project/project.model.js";
import Sprint from "../sprint/sprint.model.js";
import Cluster from "../cluster/cluster.model.js";
import Task from "./task.model.js";
import cloudinary from "cloudinary";
import { createNotification } from "../helpers/notifications-validators.js";

export const addTask = async (req, res) => {
  try {
    const { title, description, sprint, assignedTo } = req.body;
    const attachments = req.files.map((file) => file.filename);

    const sprintDoc = await Sprint.findById(sprint);

    if (!sprintDoc)
      return res.status(404).json({
        message: "Sprint not found",
      });

    const project = await Project.findById(sprintDoc.project);
    if (!project)
      return res.status(404).json({
        message: "Project not found",
      });

    const group = await Cluster.findById(project.cluster);
    if (!group)
      return res.status(404).json({
        message: "Group not found",
      });

    const isMember = group.integrantes.some(
      (i) => i.usuario.toString() === assignedTo
    );
    if (!isMember) {
      return res.status(400).json({
        message: "Assigned user is not in the group",
      });
    }

    const task = await Task.create({
      title,
      description,
      sprint,
      assignedTo,
      attachments,
      project: project._id,
    });
    await Sprint.findByIdAndUpdate(sprint, { $push: { task: task._id } });

    await createNotification({
      user: assignedTo,
      title: `Nueva tarea asignada: ${title}`,
      message: `Se te ha asignado una nueva tarea en el sprint ${sprintDoc.number} del proyecto "${project.title}".`,
      relatedTo: task._id,
      relatedType: "Task",
    });

    return res.status(200).json({
      message: "Task created successfully",
      task: task,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error adding task",
      error: error.message,
    });
  }
};

export const listTasks = async (req, res) => {
  try {
    const filter = req.body || {};

    const tasks = await Task.find(filter);

    return res.status(200).json({
      tasks,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error listing tasks",
      error: err.message,
    });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.body;  
    const data = req.body;

    const task = await Task.findByIdAndUpdate(id, data, { new: true });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    const sprintDoc = await Sprint.findById(task.sprint);
    const project = await Project.findById(task.project);

    await createNotification({
      user: task.assignedTo,
      title: `Actualización en la tarea: ${task.title}`,
      message: `La tarea "${task.title}" del sprint ${sprintDoc?.number} en el proyecto "${project?.title}" ha sido actualizada.`,
      relatedTo: task._id,
      relatedType: "Task",
    });

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
    const { id } = req.body;  

    const service = await Task.findByIdAndUpdate(
      id,
      { state: "deleted" },  
    );

    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    return res.status(200).json({
      message: "Service deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
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
        populate: { path: "cluster" },
      },
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

    await createNotification({
      user: newUserId,
      title: `Nueva tarea asignada: ${task.title}`,
      message: `Se te ha reasignado la tarea "${task.title}" en el proyecto "${task.sprint.project.title}".`,
      relatedTo: task._id,
      relatedType: "Task",
    });

    return res.status(200).json({
      message: "Task reassigned successfully",
      task,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error reassigning task",
      error: err.message,
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

    await createNotification({
      user: task.assignedTo,
      title: `Tarea marcada como urgente: ${task.title}`,
      message: `La tarea "${task.title}" ha sido marcada como urgente. Por favor, dale prioridad.`,
      relatedTo: task._id,
      relatedType: "Task",
    });

    return res.status(200).json({
      message: "Tarea marcada como urgente",
      task,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error al marcar como urgente",
      error: err.message,
    });
  }
};

export const setTaskTags = async (req, res) => {
  try {
    const { taskId, tags } = req.body;

    if (!Array.isArray(tags)) {
      return res
        .status(400)
        .json({ message: "Tags debe ser un array de strings" });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    task.tags = tags;
    await task.save();

    await createNotification({
      user: task.assignedTo,
      title: ` Etiquetas actualizadas en la tarea: ${task.title}`,
      message: `Se han actualizado las etiquetas de la tarea "${
        task.title
      }". Nuevas etiquetas: ${tags.join(", ")}`,
      relatedTo: task._id,
      relatedType: "Task",
    });

    return res.status(200).json({
      message: "Etiquetas asignadas correctamente",
      task,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error al asignar etiquetas",
      error: err.message,
    });
  }
};

export const addTaskAttachments = async (req, res) => {
  try {
    const { taskId } = req.params;
    const files = req.files;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    if (files && files.length > 0) {
      const newAttachments = files.map((file) => file.filename);
      task.attachments = [...task.attachments, ...newAttachments];

      await task.save();
    }

    const taskObj = task.toObject();
    taskObj.attachmentUrls = task.attachments.map((filename) =>
      cloudinary.v2.url(filename)
    );

    return res.status(200).json({
      success: true,
      message: "Attachments added successfully",
      task: taskObj,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error adding attachments",
      error: err.message,
    });
  }
};

export const deleteTaskAttachments = async (req, res) => {
  try {
    const { taskId } = req.params;
    let { filenames } = req.body;

    filenames = Array.isArray(filenames) ? filenames : [filenames];

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    for (const filename of filenames) {
      if (task.attachments.includes(filename)) {
        await cloudinary.v2.uploader.destroy(filename);
        task.attachments = task.attachments.filter(
          (attachment) => attachment !== filename
        );
      }
    }

    await task.save();

    const taskObj = task.toObject();
    taskObj.attachmentUrls = task.attachments.map((filename) =>
      cloudinary.v2.url(filename)
    );

    return res.status(200).json({
      success: true,
      message: "Attachments deleted successfully",
      task: taskObj,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error deleting attachments",
      error: err.message,
    });
  }
};

//Pa devyn

export const getMyTasks = async (req, res) => {
  try {
    const userId = req.user._id;

    const tasks = await Task.find({ assignedTo: userId });

    return res.status(200).json({
      success: true,
      tasks,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al obtener las tareas del usuario",
      error: err.message,
    });
  }
};


export const updateTaskState = async (req, res) => {
  try {
    const { id } = req.params;
    const { state } = req.body;

    const allowedStates = ["Late", "In Progress", "In Review", "finalized"];
    if (!allowedStates.includes(state)) {
      return res.status(400).json({
        success: false,
        message: `El estado debe ser uno de: ${allowedStates.join(", ")}`,
      });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Tarea no encontrada",
      });
    }

    task.state = state;
    await task.save();

    return res.status(200).json({
      success: true,
      message: "Estado de la tarea actualizado correctamente",
      task,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al actualizar el estado de la tarea",
      error: err.message,
    });
  }
};