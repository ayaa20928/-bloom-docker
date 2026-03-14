require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const mysql   = require('mysql2/promise');

const app  = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

// Connexion DB - deja configuree, ne pas toucher
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

// Health check - deja fait, ne pas toucher
app.get('/api/health', async (_req, res) => {
  let dbOk = false;
  try { if (pool) { await pool.query('SELECT 1'); dbOk = true; } } catch {}
  res.json({ status: 'ok', db: dbOk });
});

// ══════════════════════════════════════════
//  TRAVAIL : DEV BACKEND
// ══════════════════════════════════════════
//
//  OBJECTIF : Créer les routes API REST
//  pour que le frontend puisse fonctionner
//
//  ── ROUTES A CRÉER ──────────────────────
//
//  1. POST /api/login
//     - Reçoit : { username, password }
//     - Vérifie dans la table users
//     - Retourne : { success, data: { id, username, role } }
//     - Erreur si user introuvable ou mauvais password
//
//  2. GET /api/tasks
//     - Paramètres : ?owner=aya&role=user
//     - Si role=admin → retourner TOUTES les taches
//     - Sinon → retourner seulement les taches de owner
//     - Retourne : { success, data: [ liste ] }
//
//  3. POST /api/tasks
//     - Reçoit : { text, owner, tag, priority }
//     - Insère dans la table tasks
//     - Retourne : { success, data: { tache créée } }
//
//  4. PATCH /api/tasks/:id/toggle
//     - Change done de 0 a 1 ou de 1 a 0
//     - Retourne : { success, data: { tache modifiee } }
//
//  5. DELETE /api/tasks/:id
//     - Supprime la tache avec cet id
//     - Retourne : { success, message }
//
//  6. GET /api/users
//     - Retourne tous les utilisateurs
//     - Retourne : { success, data: [ liste ] }
//
//  ── EXEMPLE D UNE ROUTE ─────────────────
//
//  app.get('/api/exemple', async (req, res) => {
//    try {
//      const [rows] = await pool.query('SELECT * FROM tasks');
//      res.json({ success: true, data: rows });
//    } catch (err) {
//      res.status(500).json({ success: false, error: err.message });
//    }
//  });
//
//  ── TABLES DISPONIBLES ──────────────────
//
//  users  : id, username, password, role, created_at
//  tasks  : id, text, emoji, owner, tag, priority, done, created_at
//
//  ── TESTER TES ROUTES ───────────────────
//
//  http://localhost:5000/api/health   (deja fait)
//  http://localhost:5000/api/tasks    (a faire)
//  http://localhost:5000/api/login    (a faire, avec Postman)
//
// ══════════════════════════════════════════

// Ecris tes routes ici


// Demarrage serveur - ne pas toucher
app.listen(PORT, async () => {
  console.log('Backend demarre -> http://localhost:' + PORT);
  await initDB();
});
