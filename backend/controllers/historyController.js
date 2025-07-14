import History from '../model/HistoryModel.js';


// @desc   Add a new history log entry
// @route  POST /api/history/add
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

    res.status(201).json({ message: 'History log added successfully ✅' });
  } catch (err) {
    console.error('Error adding history:', err);
    res.status(500).json({ message: 'Server error' });
  }
};



// @desc   Fetch all history logs
// @route  GET /api/history
export const getAllHistory = async (req, res) => {
  try {
    const logs = await History.find().sort({ createdAt: -1 });
    res.status(200).json(logs);
  } catch (err) {
    console.error('Error fetching history:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc   Log wallet credit usage (deduction)
// @route  POST /api/history/use
export const logCreditUsage = async (req, res) => {
  try {
    const { userEmail, userMobile, amountUsed } = req.body;

    if (!userMobile || !amountUsed) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newUsageEntry = new History({
      employeeName: "System", // or "User" or leave blank
      employeeEmail: "system@auto.com",
      creditedAmount: -Math.abs(amountUsed), // always store as negative
      userEmail,
      userMobile,
      timestamp: new Date(),
    });

    await newUsageEntry.save();
    res.status(201).json({ message: "Credit usage logged successfully ✅" });
  } catch (err) {
    console.error("Error logging usage:", err);
    res.status(500).json({ message: "Server error" });
  }
};

