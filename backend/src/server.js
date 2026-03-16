require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const mysql   = require('mysql2/promise');

const app  = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

const dbConfig = {
  host    : process.env.DB_HOST     || 'database',
  port    : process.env.DB_PORT     || 3306,
  database: process.env.DB_NAME     || 'bloom_db',
  user    : process.env.DB_USER     || 'bloom_user',
  password: process.env.DB_PASSWORD || 'bloom_pass',
};

let pool;
async function initDB() {
  try {
    pool = await mysql.createPool(dbConfig);
    await pool.query('SELECT 1');
    console.log('Base de donnees connectee !');
  } catch (err) {
    console.error('DB pas encore prete, retry dans 5s...', err.message);
    setTimeout(initDB, 5000);
  }
}

app.get('/api/health', async (_req, res) => {
  let dbOk = false;
  try { if (pool) { await pool.query('SELECT 1'); dbOk = true; } } catch {}
  res.json({ status: 'ok', db: dbOk, time: new Date().toISOString() });
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ success: false, error: 'Champs requis' });
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (!rows.length) return res.status(401).json({ success: false, error: 'Utilisateur introuvable' });
    if (rows[0].password !== password) return res.status(401).json({ success: false, error: 'Mot de passe incorrect' });
    res.json({ success: true, data: { id: rows[0].id, username: rows[0].username, role: rows[0].role } });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.get('/api/tasks', async (req, res) => {
  try {
    const { owner, role } = req.query;
    let q = 'SELECT * FROM tasks ORDER BY created_at DESC';
    let p = [];
    if (role !== 'admin' && owner) {
      q = 'SELECT * FROM tasks WHERE owner = ? ORDER BY created_at DESC';
      p = [owner];
    }
    const [rows] = await pool.query(q, p);
    res.json({ success: true, data: rows });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const { text, emoji, owner, tag, priority, date } = req.body;
    if (!text || !owner) return res.status(400).json({ success: false, error: 'text et owner requis' });
    const [result] = await pool.query(
      'INSERT INTO tasks (text, emoji, owner, tag, priority, date) VALUES (?, ?, ?, ?, ?, ?)',
      [text, emoji || 'pin', owner, tag || 'personnel', priority || 'normale', date || null]
    );
    const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.patch('/api/tasks/:id/toggle', async (req, res) => {
  try {
    await pool.query('UPDATE tasks SET done = NOT done WHERE id = ?', [req.params.id]);
    const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [req.params.id]);
    res.json({ success: true, data: rows[0] });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM tasks WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Tache supprimee' });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.get('/api/users', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, username, role, created_at FROM users');
    res.json({ success: true, data: rows });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.listen(PORT, async () => {
  console.log('Backend demarre -> http://localhost:' + PORT + '/api/health');
  await initDB();
});
