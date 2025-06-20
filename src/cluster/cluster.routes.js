import { Router } from "express";
import {crearGrupo,listarGrupos,agregarIntegrante,eliminarIntegrante,editarDescripcion,} from "./cluster.controller.js";
import {validatorCrearGrupo,validatorAgregarIntegrante,validatorEliminarIntegrante,validatorEditarDescripcion,} from "../middlewares/cluster-validate.js";
import { uploadProfilePicture } from "../middlewares/multer-uploads.js";


const router = Router();

// Crear grupo
router.post("/crear",uploadProfilePicture.single("profilePicture"),crearGrupo);

// Listar grupos donde el usuario es integrante
router.get("/listar", listarGrupos);

// Agregar integrante con username o email (grupoId en body)
router.post("/agregar", validatorAgregarIntegrante, agregarIntegrante);

// Eliminar integrante con username o email (grupoId en body)
router.delete("/eliminar", validatorEliminarIntegrante, eliminarIntegrante);

// Editar descripción del grupo (grupoId en body)
router.put("/editar", validatorEditarDescripcion, editarDescripcion);

export default router;