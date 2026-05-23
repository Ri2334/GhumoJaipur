import express from 'express';
import { 
  findMatches, 
  joinSharedRide, 
  createSharedRide,
  getAvailableSharedRides,
  driverAcceptSharedRide,
  driverRequestStart,
  passengerApproveStart,
  driverConfirmStart
} from '../controllers/sharedController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/matches', protect, findMatches);
router.post('/join', protect, joinSharedRide);
router.post('/create', protect, createSharedRide);

// Driver endpoints
router.get('/available', protect, getAvailableSharedRides);
router.post('/accept', protect, driverAcceptSharedRide);
router.post('/request-start', protect, driverRequestStart);
router.post('/confirm-start', protect, driverConfirmStart);

// Passenger endpoints
router.post('/approve', protect, passengerApproveStart);

export default router;
