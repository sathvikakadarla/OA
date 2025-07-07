import Profile from '../model/Profile.js';

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

// @desc   Add money to user's wallet
// @route  PUT /api/profile/:mobileNumber/add-money
export const addMoneyToWallet = async (req, res) => {
  const { amount } = req.body;

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

    res.json({ message: 'Money added successfully', updatedProfile: profile });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
