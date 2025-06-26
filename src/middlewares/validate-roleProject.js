import Project from "../project/project.model.js";

export const validateRoleProject = async (req, res, next) => {
  try {
    const projectId = req.params.projectId  || req.body.project ;
    ;
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Proyecto no encontrado",
      });
    }

    if (String(req.usuario._id) !== String(project.productOwner)) {
      return res.status(401).json({
        success: false,
        message: "El usuario no es el Product Owner del proyecto",
      });
    }

    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al validar el rol del usuario en el proyecto",
      error: err.message,
    });
  }
};