import Notification from "../notifications/notifications.model.js";

export const createNotification = async (data) => {
  try {
    const notification = new Notification(data);
    return await notification.save();
  } catch (error) {
    throw new Error("Error al crear la notificación: " + error.message);
  }
};
