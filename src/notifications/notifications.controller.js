import Notification from "../notifications/notifications.model.js";
import Task from "../task/task.model.js";
import Sprint from "../sprint/sprint.model.js";
import Project from "../project/project.model.js";

export const getClusterNotifications = async (req, res) => {
  try {
    const userId = req.usuario._id;
    const { clusterId } = req.params;

    const projects = await Project.find({ cluster: clusterId }).select("_id");
    const projectIds = projects.map((p) => p._id);

    const sprints = await Sprint.find({ project: { $in: projectIds } }).select("_id");
    const sprintIds = sprints.map((s) => s._id);

    const tasks = await Task.find({
      project: { $in: projectIds },
      sprint: { $in: sprintIds },
      assignedTo: userId
    }).select("_id");

    const taskIds = tasks.map((t) => t._id);

    const notifications = await Notification.find({
      $or: [
        {
          relatedType: "Cluster",
          relatedTo: clusterId,
          user: { $ne: userId },
        },
        {
          relatedType: "Project",
          relatedTo: { $in: projectIds },
          user: { $ne: userId },
        },
        {
          relatedType: "Sprint",
          relatedTo: { $in: sprintIds },
          user: { $ne: userId },
        },
        {
          relatedType: "Task",
          relatedTo: { $in: taskIds },
          user: userId,
        },
      ],
      state: { $in: ["Pendiente", "Vista"] },
    })
      .sort({ dateCreation: -1 })
      .limit(5);

    return res.status(200).json({
      message: "Notificaciones relacionadas al cluster obtenidas exitosamente",
      notifications,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener notificaciones relacionadas al cluster",
      error: error.message,
    });
  }
};

export const getMyNotifications = async (req, res) => {
  try {
    const userId = req.usuario._id;

    const notifications = await Notification.find({
      user: userId,
      state: ["Pendiente", "Vista"],
    }).sort({ dateCreation: -1 }); 

    const pendingCount = await Notification.countDocuments({
      user: userId,
      state: "Pendiente",
    });

    if (!notifications) {
      return res.status(400).json({
        message: "Problems listing notifications",
      });
    }

    return res.status(200).json({
      message: "Notificaciones obtenidas exitosamente",
      notifications,
      pendientes: pendingCount,
    });
  } catch (error) {
    return res.status(500).json({
      message: "failed to find your notifications",
      error: error.message,
    });
  }
};


export const updateNotificationState = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const { state } = req.body;

    const allowedStates = ["Pendiente", "Vista", "Eliminada", "Archivada"];
    if (!allowedStates.includes(state)) {
      return res.status(400).json({
        message: "Estado de notificación no válido",
      });
    }

    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId},
      { state },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        message: "Notificación no encontrada",
      });
    }

    return res.status(200).json({
      message: "Estado de notificación actualizado exitosamente",
      notification,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al actualizar el estado de la notificación",
      error: error.message,
    });
  }
};


export const getNotificationById = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.usuario._id;

    const notification = await Notification.findOne({
      _id: notificationId,
      user: userId,
    });

    if (!notification) {
      return res.status(404).json({
        message: "Notificación no encontrada",
      });
    }

    return res.status(200).json({
      message: "Notificación obtenida exitosamente",
      notification,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener la notificación",
      error: error.message,
    });
  }
};