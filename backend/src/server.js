require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const { Pool } = require('pg');

const app  = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const pool = new Pool({
  host    : process.env.DB_HOST     || 'database',
  port    : process.env.DB_PORT     || 5432,
  database: process.env.DB_NAME     || 'bloom_db',
  user    : process.env.DB_USER     || 'bloom_user',
  password: process.env.DB_PASSWORD || 'bloom_pass',
});

async function initDB() {
  try {
    await pool.query('SELECT 1');
    console.log('Base de donnees PostgreSQL connectee !');
  } catch (err) {
    console.error('DB pas encore prete, retry dans 5s...', err.message);
    setTimeout(initDB, 5000);
  }
}

app.get('/api/health', async (_req, res) => {
  let dbOk = false;
  try { await pool.query('SELECT 1'); dbOk = true; } catch {}
  res.json({ status: 'ok', db: dbOk, time: new Date().toISOString() });
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ success: false, error: 'Champs requis' });
    const result = await pool.query('SELECT * FROM users WHERE username = ', [username]);
    if (!result.rows.length) return res.status(401).json({ success: false, error: 'Utilisateur introuvable' });
    if (result.rows[0].password !== password) return res.status(401).json({ success: false, error: 'Mot de passe incorrect' });
    const u = result.rows[0];
    res.json({ success: true, data: { id: u.id, username: u.username, role: u.role } });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.get('/api/tasks', async (req, res) => {
  try {
    const { owner, role } = req.query;
    let result;
    if (role !== 'admin' && owner) {
      result = await pool.query('SELECT * FROM tasks WHERE owner =  ORDER BY created_at DESC', [owner]);
    } else {
      result = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC');
    }
    res.json({ success: true, data: result.rows });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const { text, emoji, owner, tag, priority, date } = req.body;
    if (!text || !owner) return res.status(400).json({ success: false, error: 'text et owner requis' });
    const result = await pool.query(
      'INSERT INTO tasks (text, emoji, owner, tag, priority, date) VALUES (, , , , , ) RETURNING *',
      [text, emoji || 'pin', owner, tag || 'personnel', priority || 'normale', date || null]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.patch('/api/tasks/:id/toggle', async (req, res) => {
  try {
    const result = await pool.query(
      'UPDATE tasks SET done = NOT done WHERE id =  RETURNING *',
      [req.params.id]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM tasks WHERE id = ', [req.params.id]);
    res.json({ success: true, message: 'Tache supprimee' });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.get('/api/users', async (_req, res) => {
  try {
    const result = await pool.query('SELECT id, username, role, created_at FROM users');
    res.json({ success: true, data: result.rows });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.listen(PORT, async () => {
  console.log('Backend demarre -> http://localhost:' + PORT + '/api/health');
  await initDB();
});
