import { body, param } from "express-validator";
import { validarCampos } from "./validar-campos.js";
import { handleErrors } from "./handle-errors.js";
import { validateJWT } from "./validate-jwt.js";
import { hasRoles } from "./validate-roles.js";

export const validatorCreateSprint = [
    validateJWT,
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('state').notEmpty().withMessage('State is required'),
    body('project').notEmpty().withMessage('Project is required'),
    body('startDate').notEmpty().withMessage('Start date is required')
        .isISO8601().withMessage('Start date must be a valid ISO8601 date'),
    body('endDate').notEmpty().withMessage('End date is required')
        .isISO8601().withMessage('End date must be a valid ISO8601 date'),
    body().custom(body => {
        if (body.startDate && body.endDate) {
            const start = new Date(body.startDate);
            const end = new Date(body.endDate);
            if (start > end) {
                throw new Error('Start date must be before end date');
            }
        }
        return true;
    }),
    validarCampos,
    handleErrors
]

export const validatorDeleteSprint = [
    validateJWT,
    param('id').notEmpty().withMessage('Id is required'),
    param('id').isMongoId().withMessage('Invalid ID format'),
    validarCampos,
    handleErrors
]

export const validatorUpdateSprint = [
    validateJWT,
    param('id').notEmpty().withMessage('Id is required'),
    param('id').isMongoId().withMessage('Invalid ID format'),
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('description').optional().notEmpty().withMessage('Description cannot be empty'),
    body('task').optional().notEmpty().withMessage('Task cannot be empty'),
    body('state').optional().notEmpty().withMessage('State cannot be empty'),
    body('project').optional().notEmpty().withMessage('Project cannot be empty'),
    body('startDate').optional().isISO8601().withMessage('Start date must be a valid ISO8601 date'),
    body('endDate').optional().isISO8601().withMessage('End date must be a valid ISO8601 date'),
    body().custom(body => {
        if (body.startDate && body.endDate) {
            const start = new Date(body.startDate);
            const end = new Date(body.endDate);
            if (start > end) {
                throw new Error('Start date must be before end date');
            }
        }
        return true;
    }),
    validarCampos,
    handleErrors
]