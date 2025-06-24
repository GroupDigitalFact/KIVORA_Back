import Project from "../project/project.model.js";

export const hasRoles = (...roles) => {
    return (req, res, next) =>{
        const projectId = req.params.projectId;
        
        const project = Project.findById(projectId);
        
        if(!req.usuario){
            return res.status(500).json({
                success: false,
                message: "Se quiere verificar un role antes de validar el token"
            })
        }

        if(!roles.includes(req.usuario.role)){
            return res.status(401).json({
                success: false,
                message:`El servicio requiere uno de estos roles ${roles}`
            })
        }
        next()
    }
}