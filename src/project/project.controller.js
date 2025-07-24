import Project from "./project.model.js";
import Cluster from "../cluster/cluster.model.js";
import User from "../user/user.model.js";
import Task from "../task/task.model.js";
import Event from "../event/event.model.js";
import Sprint from "../sprint/sprint.model.js";
import { createNotification } from "../helpers/notifications-validators.js";

export const addProject = async (req, res) => {
  try {
    const id = req.usuario._id;
    const data = req.body;

    const scrumMasterId = id;

    const group = await Cluster.findById(data.cluster);

    if (!group) {
      return res.status(404).json({
        message: "Group not found",
      });
    }

    const proyectoExistente = await Project.findOne({
      title: data.title.trim(),
      cluster: data.cluster,
    });

    if (proyectoExistente) {
      return res.status(400).json({
        message: "Ya existe un proyecto con ese nombre en este grupo",
      });
    }

    const allUserIds = group.integrantes.map((int) => int.usuario.toString());

    const developers = allUserIds.filter(
      (userId) =>
        userId !== scrumMasterId.toString() && userId !== data.productOwner
    );

    const projectData = {
      title: data.title,
      description: data.description,
      startDate: data.startDate,
      endDate: data.endDate,
      projectType: data.projectType,
      cluster: data.cluster,
      scrumMaster: scrumMasterId,
      productOwner: data.productOwner,
    };

    const project = await Project.create(projectData);

    const notificados = [scrumMasterId, data.productOwner, ...developers];

    for (const userId of notificados) {
      await createNotification({
        user: userId,
        title: `Nuevo proyecto: ${data.title}`,
        message: `Se ha creado el proyecto "${data.title}" en el grupo "${group.nombre}".`,
        relatedTo: project._id,
        relatedType: "Project",
      });
    }

    if (!project) {
      return res.status(400).json({
        message: "Error creating project",
      });
    }

    res.status(201).json({
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error adding project",
      error: error.message,
    });
  }
};

export const getProjects = async (req, res) => {
  try {
    const { idGroup } = req.params;
    const projects = await Project.find({ cluster: idGroup, state: true })
      .populate("scrumMaster", "name surname username")
      .populate("productOwner", "name surname username")
      .populate("cluster", "name");

    if (!projects || projects.length === 0) {
      return res.status(404).json({
        message: "No projects found",
      });
    }

    res.status(200).json({
      message: "Projects fetched successfully",
      projects,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching projects",
      error: error.message,
    });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { idProject } = req.params;
    const data = req.body;

    const project = await Project.findByIdAndUpdate(idProject, data, {
      new: true,
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.status(200).json({
      message: "Project updated successfully",
      project,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating project",
      error: error.message,
    });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { idProject } = req.params;

    const project = await Project.findByIdAndUpdate(
      idProject,
      { state: false },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const group = await Cluster.findById(project.cluster);

    if (group) {
      const usuarios = group.integrantes.map((int) => int.usuario);

      for (const userId of usuarios) {
        await createNotification({
          user: userId,
          title: `Proyecto eliminado: ${project.title}`,
          message: `El proyecto "${project.title}" ha sido eliminado del grupo "${group.nombre}".`,
          relatedTo: project._id,
          relatedType: "Project",
        });
      }
    }

    res.status(200).json({
      message: "Project deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting project",
      error: error.message,
    });
  }
};

export const listUserProjects = async (req, res) => {
  try {
    const userId = req.usuario._id;

    const userClusters = await Cluster.find({
      integrantes: { $elemMatch: { usuario: userId } },
    });

    const clusterIds = userClusters.map((cluster) => cluster._id);

    const projects = await Project.find({
      cluster: { $in: clusterIds },
      state: true,
    })
      .populate("scrumMaster", "name surname username")
      .populate("productOwner", "name surname username")
      .populate("cluster", "nombre");

    if (!projects) {
      return res.status(404).json({
        message: "No projects found for this user",
      });
    }

    return res.status(200).json({
      message: "User projects fetched successfully",
      projects,
    });

  } catch (error) {
    res.status(500).json({
      message: "Error fetching user projects",
      error: error.message,
    });
  }
};

export const getProjectStats = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId).populate("cluster");
    if (!project) return res.status(404).json({ message: "Proyecto no encontrado" });

    const cluster = await Cluster.findById(project.cluster._id).populate("integrantes.usuario");
    if (!cluster) return res.status(404).json({ message: "Grupo no encontrado para el proyecto" });

    const sprints = await Sprint.find({ project: projectId });
    const sprintIds = sprints.map(s => s._id);

    const tareas = await Task.find({ sprint: { $in: sprintIds }, status: true })
      .populate("assignedTo", "name email")
      .populate("sprint", "number")
      .populate("project", "title");

    const eventos = await Event.find({ sprint: { $in: sprintIds }, status: true })
      .populate("participantes", "name email")
      .populate("asistencia.usuario", "name email")
      .populate({ path: "sprint", populate: { path: "project", select: "title" } });

    const usuariosStats = cluster.integrantes.map(({ usuario }) => {
      const userId = usuario._id.toString();
      const tareasUsuario = tareas.filter(t => t.assignedTo && t.assignedTo._id.toString() === userId);

      const entregadas = tareasUsuario.filter(t => t.attachments.length > 0);
      const pendientes = tareasUsuario.filter(t => t.attachments.length === 0);

      const tareasPorSprint = {};
      tareasUsuario.forEach(t => {
        const key = `Sprint ${t.sprint.number}`;
        if (!tareasPorSprint[key]) tareasPorSprint[key] = [];
        tareasPorSprint[key].push({
          titulo: t.title,
          estado: t.attachments.length > 0 ? "Entregada" : "Pendiente",
          proyecto: t.project.title
        });
      });

      const asistencias = eventos.filter(ev => ev.asistencia.some(a => a.usuario && a.usuario._id.toString() === userId && a.presente)).length;
      const totalEventos = eventos.filter(ev => ev.participantes.some(p => p._id.toString() === userId)).length;

      return {
        usuario: { id: userId, nombre: usuario.name, email: usuario.email },
        totalTareas: tareasUsuario.length,
        entregadas: entregadas.length,
        pendientes: pendientes.length,
        detallePorSprint: tareasPorSprint,
        eventosParticipados: totalEventos,
        asistencias,
        porcentajeAsistencia: totalEventos > 0 ? Math.round((asistencias / totalEventos) * 100) : 0
      };
    });

    const totalTareas = tareas.length;
    const tareasEntregadas = tareas.filter(t => t.attachments.length > 0).length;
    const tareasPendientes = totalTareas - tareasEntregadas;

    const informeGeneral = {
      totalTareas,
      tareasEntregadas,
      tareasPendientes,
      porcentajeEntregadas: totalTareas > 0 ? Math.round((tareasEntregadas / totalTareas) * 100) : 0,
      sprints: sprints.length,
      integrantes: cluster.integrantes.length,
      totalEventos: eventos.length
    };

    return res.status(200).json({
      mensaje: "Estadísticas del proyecto generadas correctamente",
      informeGeneral,
      estadisticasUsuarios: usuariosStats
    });

  } catch (err) {
    return res.status(500).json({
      message: "Error generando estadísticas del proyecto",
      error: err.message
    });
  }
};