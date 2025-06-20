import { body, param } from "express-validator";
import { usernameExist, emailExist } from "../helpers/db-validators.js";
import { validarCampos } from "./validar-campos.js";
import { handleErrors } from "./handle-errors.js";
import { validateJWT } from "./validate-jwt.js";

export const validatorRegister = [
  body("name").notEmpty().withMessage("Name is required").isLength({ max: 30 }).withMessage("Name cannot exceed 30 characters"),
  body("surname").notEmpty().withMessage("Surname is required").isLength({ max: 30 }).withMessage("Surname cannot exceed 30 characters"),
  body("username").notEmpty().withMessage("Username is required").isLength({ max: 30 }).withMessage("Username cannot exceed 30 characters").custom(usernameExist),
  body("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Invalid email format").custom(emailExist),
  body("password").notEmpty().withMessage("Password is required").isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    }),
  body("phone").notEmpty().withMessage("Phone number is required").isLength({ min: 8 }).withMessage("Phone number must be at least 8 digits"),
    validarCampos,
    handleErrors
];

export const validatorLogin = [
    body("email").notEmpty().withMessage("El usuario o correo es obligatorio"),
    body("password").notEmpty().withMessage("La contraseña es obligatoria"),
    validarCampos,
    handleErrors
];

export const validatorUpdateUser = [
  validateJWT,
  body("name").optional().isLength({ max: 30 }).withMessage("Name cannot exceed 30 characters"),
  body("surname").optional().isLength({ max: 30 }).withMessage("Surname cannot exceed 30 characters"),
  body("username").optional().isLength({ max: 30 }).withMessage("Username cannot exceed 30 characters"),
  body("email").optional().isEmail().withMessage("Invalid email format"),
  body("phone").optional().isLength({ min: 8 }).withMessage("Phone number must be at least 8 digits"),
  validarCampos,
  handleErrors
];