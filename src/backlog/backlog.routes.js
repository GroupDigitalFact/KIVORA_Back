import {Router} from 'express';
import { createBacklog, deleteBacklog, exportBacklogToPDF, getBacklogs, updateBacklog } from './backlog.controller.js';
import { authProductOwnerMiddleware } from '../middlewares/auth-validate.js';
const router = Router();

router.post('/createBacklog', authProductOwnerMiddleware, createBacklog);

router.get('/getBacklogs/:projectId', getBacklogs);

router.get('/exportBacklogToPDF/:projectId', exportBacklogToPDF);

router.put('/updateBacklog/:projectId/:backlogId', authProductOwnerMiddleware, updateBacklog);

router.delete('/deleteBacklog/:projectId/:backlogId', authProductOwnerMiddleware, deleteBacklog);


export default router;