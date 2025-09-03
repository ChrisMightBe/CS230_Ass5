const db = require('../models/db');

// Get all travel logs for the logged-in user
exports.getAllTravelLogs = async (req, res) => {
  const userId = req.user.id;
  try {
    const [logs] = await db.execute(
      'SELECT * FROM travel_logs WHERE user_id = ? ORDER BY post_date DESC',
      [userId]
    );
    res.json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch travel logs' });
  }
};

// Create a new travel log
exports.createTravelLog = async (req, res) => {
  const userId = req.user.id;
  const { title, description, start_date, end_date, post_date, tags } = req.body;

  try {
    await db.execute(
      'INSERT INTO travel_logs (user_id, title, description, start_date, end_date, post_date, tags) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [userId, title, description, start_date, end_date, post_date, JSON.stringify(tags)]
    );
    res.status(201).json({ message: 'Travel log created' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create travel log' });
  }
};

// Update an existing travel log
exports.updateTravelLog = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { title, description, start_date, end_date, post_date, tags } = req.body;

  try {
    const [result] = await db.execute(
      'UPDATE travel_logs SET title = ?, description = ?, start_date = ?, end_date = ?, post_date = ?, tags = ? WHERE id = ? AND user_id = ?',
      [title, description, start_date, end_date, post_date, JSON.stringify(tags), id, userId]
    );

    if (result.affectedRows === 0) return res.status(404).json({ error: 'Travel log not found or unauthorized' });

    res.json({ message: 'Travel log updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update travel log' });
  }
};

// Delete a travel log
exports.deleteTravelLog = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const [result] = await db.execute(
      'DELETE FROM travel_logs WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (result.affectedRows === 0) return res.status(404).json({ error: 'Travel log not found or unauthorized' });

    res.json({ message: 'Travel log deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete travel log' });
  }
};