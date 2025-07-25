import Event from "./event.model.js";
import Sprint from "../sprint/sprint.model.js";
import User from "../user/user.model.js";

export const createEvent = async (req, res) => {
  try {
    const { tipoEvento, descripcion, fecha, sprint, participantes } = req.body;

    const sprintDoc = await Sprint.findById(sprint)
      .populate({
        path: "project",
        populate: { path: "cluster", populate: { path: "integrantes.usuario" } }
      });

    if (!sprintDoc) return res.status(404).json({ 
        message: "Sprint no encontrado" 
    });

    const grupo = sprintDoc.project.cluster;
    if (!grupo || !grupo.integrantes) {
      return res.status(404).json({ 
        message: "Grupo no encontrado en el proyecto" 
    });
    }

    const event = await Event.create({
      tipoEvento,
      descripcion,
      fecha,
      sprint,
      participantes,
    });

    return res.status(201).json({ 
        message: "Evento creado", 
        event 
    });

  } catch (err) {
    return res.status(500).json({ 
        message: "Error creando evento", 
        error: err.message 
    });
  }
};

export const listEvents = async (req, res) => {
  try {
    const { sprintId, tipoEvento, fecha } = req.query;
    let filter = { status: true };

    if (sprintId) filter.sprint = sprintId;
    if (tipoEvento) filter.tipoEvento = tipoEvento;
    if (fecha) {
      const start = new Date(fecha);
      const end = new Date(fecha);
      end.setHours(23, 59, 59, 999);
      filter.fecha = { $gte: start, $lte: end };
    }

    const userId = req.usuario?._id;
    if (!userId) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    const events = await Event.find(filter)
      .populate({
        path: "sprint",
        populate: {
          path: "project",
          populate: {
            path: "cluster",
            populate: { path: "integrantes.usuario" }
          }
        }
      })
      .populate("participantes", "name email");

    const filtered = events.filter(evento => {
      const cluster = evento?.sprint?.project?.cluster;
      return cluster?.integrantes?.some(i => i.usuario?._id?.toString() === userId.toString());
    });

    return res.status(200).json({ events: filtered });

  } catch (err) {
    return res.status(500).json({
      message: "Error listando eventos",
      error: err.message
    });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, ...data } = req.body;

    const event = await Event.findById(id).populate({
      path: "sprint",
      populate: { path: "project" }
    });
    if (!event) return res.status(404).json({ message: "Evento no encontrado" });

    Object.assign(event, data);
    await event.save();

    return res.status(200).json({ 
        message: "Evento actualizado", 
        event 
    });
  } catch (err) {
    return res.status(500).json({ 
        message: "Error actualizando evento", 
        error: err.message 
    });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    const event = await Event.findById(id).populate({
      path: "sprint",
      populate: { path: "project" }
    });

    if (!event) return res.status(404).json({ 
        message: "Evento no encontrado" 
    });

    event.status = false;
    await event.save();

    return res.status(200).json({ 
        message: "Evento eliminado" 
    });

  } catch (err) {
    return res.status(500).json({ 
        message: "Error eliminando evento", 
        error: err.message 
    });
  }
};

export const markAttendance = async (req, res) => {
  try {
    const { eventId, userId, presente } = req.body;

    const event = await Event.findById(eventId).populate({
      path: "sprint",
      populate: { path: "project", populate: { path: "cluster", populate: { path: "integrantes.usuario" } } }
    });

    if (!event) return res.status(404).json({ 
        message: "Evento no encontrado" 
    });

    const grupo = event.sprint.project.cluster;
    if (!grupo || !grupo.integrantes.some(i => i.usuario && i.usuario._id.toString() === userId)) {
      return res.status(403).json({ 
        message: "No eres miembro del grupo" 
    });
    }

    const idx = event.asistencia.findIndex(a => a.usuario.toString() === userId);
    if (idx >= 0) {
      event.asistencia[idx].presente = presente;
      event.asistencia[idx].timestamp = new Date();
    } else {
      event.asistencia.push({ usuario: userId, presente, timestamp: new Date() });
    }
    await event.save();

    return res.status(200).json({ 
        message: "Asistencia registrada", 
        event 
    });

  } catch (err) {
    return res.status(500).json({ 
        message: "Error marcando asistencia", 
        error: err.message 
    });
  }
};

export const userAttendanceHistory = async (req, res) => {
  try {
    const { userId } = req.body;
    const events = await Event.find({ status: true })
      .populate({
        path: "sprint",
        populate: { path: "project", populate: { path: "cluster", populate: { path: "integrantes.usuario" } } }
      })
      .populate("participantes");

    const filtered = events.filter(ev => {
      const cluster = ev.sprint.project.cluster;
      return cluster && cluster.integrantes && cluster.integrantes.some(i => i.usuario && i.usuario._id.toString() === userId);
    });

    if (filtered.length === 0) {
      return res.status(200).json({ 
        message: "Tu no tienes asistencia en este evento" 
    });
    }

    const result = filtered.map(ev => {
      const tieneAsistencia = ev.asistencia && ev.asistencia.some(a => a.usuario && a.usuario.toString() === userId);
      return {
        eventId: ev._id,
        userId: userId,
        tieneAsistencia: tieneAsistencia,
        event: ev
      };
    });

    return res.status(200).json({ 
        events: result 
    });

  } catch (err) {
    return res.status(500).json({ 
        message: "Error obteniendo historial", 
        error: err.message 
    });
  }
};

export const filterEventsByTypeOrDate = async (req, res) => {
  try {
    const { tipoEvento, fecha } = req.body; 
    let filter = { status: true };

    if (tipoEvento) filter.tipoEvento = tipoEvento;
    if (fecha) {
      const start = new Date(fecha);
      const end = new Date(fecha);
      end.setHours(23, 59, 59, 999);
      filter.fecha = { $gte: start, $lte: end };
    }

    const events = await Event.find(filter)
      .populate({
        path: "sprint",
        populate: { path: "project", populate: { path: "cluster", populate: { path: "integrantes.usuario" } } }
      })
      .populate("participantes");

    return res.status(200).json({ events });
  } catch (err) {
    return res.status(500).json({ message: "Error filtrando eventos", error: err.message });
  }
};