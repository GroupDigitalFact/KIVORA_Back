import { body, param } from "express-validator";
import { validarCampos } from "./validar-campos.js";
import { handleErrors } from "./handle-errors.js";
import { validateJWT } from "./validate-jwt.js";
import {validateRoleProject, validateScrumProject} from "./validate-roleProject.js"

export const authMiddleware = [
    validateJWT,
    handleErrors
];

export const authProductOwnerMiddleware = [
    validateJWT,
    validateRoleProject,
    handleErrors
];


export const authScrumMasterMiddleware = [
    validateJWT,
    validateScrumProject,
    handleErrors
];

