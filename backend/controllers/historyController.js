import History from '../model/HistoryModel.js';

// @desc   Add or update a history log entry
// @route  POST /api/history/add
export const addHistoryEntry = async (req, res) => {
  try {
    const { employeeName, employeeEmail, creditedAmount, userEmail, userMobile } = req.body;

    // Find existing entry for the same mobile number
    const existingEntry = await History.findOne({ userMobile });

    if (existingEntry) {
      // Update the existing entry
      existingEntry.creditedAmount += creditedAmount;
      existingEntry.employeeName = employeeName;
      existingEntry.employeeEmail = employeeEmail;
      existingEntry.userEmail = userEmail;
      existingEntry.timestamp = new Date(); // Optional: Update timestamp
      await existingEntry.save();

      res.status(200).json({ message: 'Updated existing history log ✅', updated: true });
    } else {
      // Create a new entry
      const newEntry = new History({
        employeeName,
        employeeEmail,
        creditedAmount,
        userEmail,
        userMobile,
      });

      await newEntry.save();
      res.status(201).json({ message: 'History log added successfully ✅', updated: false });
    }
  } catch (err) {
    console.error('Error adding/updating history:', err);
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
