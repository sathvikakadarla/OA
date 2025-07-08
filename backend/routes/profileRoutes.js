import express from 'express';
import {
  getProfileByMobile,
  addMoneyToWallet,
  resetWalletBalance
} from '../controllers/profileController.js';

const router = express.Router();

// Route to get profile details
router.get('/:mobileNumber', getProfileByMobile);

// Route to add money to wallet
router.put('/:mobileNumber/add-money', addMoneyToWallet);

router.put('/:mobileNumber/reset-balance', resetWalletBalance);

export default router;
