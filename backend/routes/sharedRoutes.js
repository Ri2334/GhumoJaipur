import express from 'express';
import { findMatches, joinSharedRide, createSharedRide } from '../controllers/sharedController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/matches', protect, findMatches);
router.post('/join', protect, joinSharedRide);
router.post('/create', protect, createSharedRide);

export default router;
