import express from 'express';
import { addHistoryEntry, getAllHistory,logCreditUsage, } from '../controllers/historyController.js';

const router = express.Router();

router.post('/add', addHistoryEntry);
router.get('/', getAllHistory);
router.post("/use", logCreditUsage);

export { router as historyRoutes };
