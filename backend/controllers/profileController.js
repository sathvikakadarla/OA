import Profile from '../model/Profile.js';
import History from '../model/HistoryModel.js'; // ⬅ import

// @desc   Get profile by mobile number
// @route  GET /api/profile/:mobileNumber
export const getProfileByMobile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ mobileNumber: req.params.mobileNumber });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addMoneyToWallet = async (req, res) => {
  const { amount, employeeName, employeeEmail } = req.body;

  if (!amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ message: 'Invalid amount' });
  }

  try {
    const profile = await Profile.findOne({ mobileNumber: req.params.mobileNumber });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    profile.currentBalance += Number(amount);
    await profile.save();

    // ✅ Create history only if wallet is updated
    const historyEntry = new History({
      employeeName: employeeName || 'Unknown',
      employeeEmail: employeeEmail || 'Unknown',
      creditedAmount: Number(amount),
      userEmail: profile.email,
      userMobile: profile.mobileNumber,
    });
    await historyEntry.save();

    res.json({
      message: 'Money added successfully',
      updatedProfile: profile,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// @desc   Reset currentBalance to 0
// @route  PUT /api/profile/:mobileNumber/reset-balance
export const resetWalletBalance = async (req, res) => {
  try {
    const profile = await Profile.findOne({ mobileNumber: req.params.mobileNumber });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    profile.currentBalance = 0;
    await profile.save();

    res.json({ message: 'Wallet balance reset to ₹0', updatedProfile: profile });
  } catch (err) {
    console.error('Error resetting balance:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

