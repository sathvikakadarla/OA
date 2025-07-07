import History from '../model/HistoryModel.js';

// @desc   Create a new history log entry
// @route  POST /api/history
export const addHistoryEntry = async (req, res) => {
  try {
    const { employeeName, employeeEmail, creditedAmount, userEmail, userMobile } = req.body;

    const newEntry = new History({
      employeeName,
      employeeEmail,
      creditedAmount,
      userEmail,
      userMobile,
      
    });

    await newEntry.save();
    res.status(201).json({ message: 'History log added successfully' });
  } catch (err) {
    console.error('Error adding history:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc   Fetch all history logs
// @route  GET /api/history
export const getAllHistory = async (req, res) => {
  try {
    const logs = await History.find().sort({ creditedAt: -1 });
    res.status(200).json(logs);
  } catch (err) {
    console.error('Error fetching history:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
