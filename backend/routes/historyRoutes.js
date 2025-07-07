import express from 'express';
import { addHistoryEntry, getAllHistory } from '../controllers/historyController.js';

const router = express.Router();

router.post('/add', addHistoryEntry);
router.get('/', getAllHistory);

export { router as historyRoutes };
