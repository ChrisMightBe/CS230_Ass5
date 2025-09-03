const db = require('../models/db');

// Get all journey plans for the logged-in user
exports.getAllJourneyPlans = async (req, res) => {
  const userId = req.user.id;

  try {
    const [plans] = await db.execute(
      'SELECT * FROM journey_plans WHERE user_id = ? ORDER BY start_date ASC',
      [userId]
    );
    res.json(plans);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch journey plans' });
  }
};

// Create a new journey plan
exports.createJourneyPlan = async (req, res) => {
  const userId = req.user.id;
  const { name, locations, start_date, end_date, activities, description } = req.body;

  try {
    await db.execute(
      'INSERT INTO journey_plans (user_id, name, locations, start_date, end_date, activities, description) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [userId, name, JSON.stringify(locations), start_date, end_date, JSON.stringify(activities), description]
    );
    res.status(201).json({ message: 'Journey plan created' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create journey plan' });
  }
};

// Update an existing journey plan
exports.updateJourneyPlan = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { name, locations, start_date, end_date, activities, description } = req.body;

  try {
    const [result] = await db.execute(
      'UPDATE journey_plans SET name = ?, locations = ?, start_date = ?, end_date = ?, activities = ?, description = ? WHERE id = ? AND user_id = ?',
      [name, JSON.stringify(locations), start_date, end_date, JSON.stringify(activities), description, id, userId]
    );

    if (result.affectedRows === 0) return res.status(404).json({ error: 'Journey plan not found or unauthorized' });

    res.json({ message: 'Journey plan updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update journey plan' });
  }
};

// Delete a journey plan
exports.deleteJourneyPlan = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const [result] = await db.execute(
      'DELETE FROM journey_plans WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (result.affectedRows === 0) return res.status(404).json({ error: 'Journey plan not found or unauthorized' });

    res.json({ message: 'Journey plan deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete journey plan' });
  }
};
