const db = require('../models/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

exports.register = async (req, res) => {
    const{username, email, password, address} = req.body;

    if (!username || !password || password.length < 8 || !email || !address) {
        return res.status(400).json({ error: 'Invalid input fields' });
      }
    
      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.execute(
          'INSERT INTO users (username, password, email, address) VALUES (?, ?, ?, ?)',
          [username, hashedPassword, email, address]
        );
        res.status(201).json({ message: 'User registered successfully' });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Registration failed' });
      }
    };

    //login user
    exports.login = async (req, res) => {
        const { username, password } = req.body;
      
        try {
          const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
      
          if (rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
      
          const user = rows[0];
          const passwordMatch = await bcrypt.compare(password, user.password);
      
          if (!passwordMatch) return res.status(401).json({ error: 'Invalid credentials' });
      
          const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: '2h' });
      
          res.json({ message: 'Login successful', token, user: { id: user.id, username: user.username, email: user.email, address: user.address } });
        } catch (err) {
          console.error(err);
          res.status(500).json({ error: 'Login failed' });
        }
      };
      
      // Get logged-in user info
      exports.getProfile = async (req, res) => {
        const userId = req.user.id;
        try {
          const [rows] = await db.execute('SELECT id, username, email, address FROM users WHERE id = ?', [userId]);
          if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
          res.json(rows[0]);
        } catch (err) {
          console.error(err);
          res.status(500).json({ error: 'Failed to fetch profile' });
        }
      };