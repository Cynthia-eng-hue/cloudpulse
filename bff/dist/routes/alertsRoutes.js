import express from 'express';
import { getAlertRules, createAlertRule, updateAlertRule, deleteAlertRule, getAlertHistory } from '../controllers/alertsController.js';
const router = express.Router();
router.get('/rules', getAlertRules);
router.post('/rules', createAlertRule);
router.put('/rules/:id', updateAlertRule);
router.delete('/rules/:id', deleteAlertRule);
router.get('/history', getAlertHistory);
export default router;
