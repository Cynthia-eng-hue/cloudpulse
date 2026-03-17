import express from 'express';
import { searchLogs } from '../controllers/logsController.js';

const router = express.Router();

router.get('/search', searchLogs);

export default router;
