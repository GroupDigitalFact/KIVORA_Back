import { body, param } from "express-validator";
import { validarCampos } from "./validar-campos.js";
import { handleErrors } from "./handle-errors.js";
import { validateJWT } from "./validate-jwt.js";

export const validatorCrearGrupo = [
  validateJWT,
  body("nombre").notEmpty().withMessage("El nombre es obligatorio").isLength({ max: 10 }).withMessage("El nombre no puede tener más de 50 caracteres"),
  body("descripcion").optional().isLength({ max: 200 }).withMessage("La descripción no puede tener más de 200 caracteres"),
  validarCampos,
  handleErrors,
];

export const validatorAgregarIntegrante = [
  validateJWT,
  body("grupoId").notEmpty().withMessage("El ID del grupo es obligatorio").isMongoId().withMessage("ID de grupo no válido"),
  body("username").optional().isString().withMessage("El nombre de usuario debe ser un texto"),
  body("email").optional().isEmail().withMessage("Debe ser un correo electrónico válido"),
  validarCampos,
  handleErrors,
];

export const validatorEliminarIntegrante = [
  validateJWT,
  body("grupoId").notEmpty().withMessage("El ID del grupo es obligatorio").isMongoId().withMessage("ID de grupo no válido"),
  body("integrante").optional().isString().withMessage("El nombre de usuario o correo electrónico debe ser un texto"),
  validarCampos,
  handleErrors,
];

export const validatorEditarDescripcion = [
  validateJWT,
  body("grupoId").notEmpty().withMessage("El ID del grupo es obligatorio").isMongoId().withMessage("ID de grupo no válido"),
  body("descripcion").notEmpty().withMessage("La descripción es obligatoria").isLength({ max: 200 }).withMessage("La descripción no puede tener más de 200 caracteres"),
  validarCampos,
  handleErrors,
];