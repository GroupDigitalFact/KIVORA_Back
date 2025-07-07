import Notification from "../notifications/notifications.model.js";

export const getMyNotifications = async (req, res) => {
  try {
    const userId = req.usuario._id;

    const notifications = await Notification.find({ user: userId, state: ["Pendiente", "Vista"]}).sort({
      createdAt: -1,
    });
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