import express from 'express';
import { getSystemStatus, getMetricsHistory } from '../controllers/monitorController.js';


const router = express.Router();

router.get('/status', getSystemStatus);
router.get('/history', getMetricsHistory);


export default router;
