import Project from "./project.model.js";
import Cluster from "../cluster/cluster.model.js"

export const addProject = async (req, res) => {
  try {
    const id = req.usuario._id;
    const data = req.body;

    const scrumMasterId = id;

    const group = await Cluster.findById(data.cluster);

    if(!group) {
        return res.status(404).json({
            message: "Group not found",
        });
    }

    const allUserIds = group.integrantes.map((int) => int.usuario.toString());
    
    const developers = allUserIds.filter(
        (userId) => userId !== scrumMasterId.toString() && userId !== data.productOwner
    );

    const projectData ={
        title: data.title,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        projectType: data.projectType,
        cluster: data.cluster,
        scrumMaster: scrumMasterId,
        productOwner: data.productOwner,
        developers: developers,
        state: true

    }
    const project = await Project.create(projectData);

    if(!project) {
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
    try{
        const idGroup = req.params.idGroup;
        const projects = await Project.find({group: idGroup})
            .populate("scrumMaster", "name surname username")
            .populate("productOwner", "name surname username")
            .populate("developers", "name surname username")
            .populate("group", "name");

        if(!projects || projects.length === 0) {
            return res.status(404).json({
                message: "No projects found",
            });
        }

        res.status(200).json({
            message: "Projects fetched successfully",
            projects,
        });

    }catch(error){
        res.status(500).json({
            message: "Error fetching projects",
            error: error.message,
        });
    }
}


export const updateProject = async (req, res) => {
    try{
        const idProject = req.params.idProject;
        const data = req.body;

        const project = await Project.findByIdAndUpdate(idProject, data, { new: true });

        if(!project) {
            return res.status(404).json({
                message: "Project not found",
            });
        }

        res.status(200).json({
            message: "Project updated successfully",
            project,
        });

    }catch(error){
        res.status(500).json({
            message: "Error updating project",
            error: error.message,
        });
    }
}

export const deleteProject = async (req, res) => {
    try{
        const idProject = req.params.idProject;

        const project = await Project.findByIdAndUpdate(idProject, { state: false }, { new: true });

        if(!project) {
            return res.status(404).json({
                message: "Project not found",
            });
        }

        res.status(200).json({
            message: "Project deleted successfully",
        });

    }catch(error){
        res.status(500).json({
            message: "Error deleting project",
            error: error.message,
        });
    }
}