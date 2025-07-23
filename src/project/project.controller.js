import Project from "./project.model.js";
import Cluster from "../cluster/cluster.model.js";
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
