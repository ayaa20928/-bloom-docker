CREATE DATABASE IF NOT EXISTS bloom_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bloom_db;

CREATE TABLE IF NOT EXISTS users (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  username   VARCHAR(60) NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,
  role       ENUM('user','admin') DEFAULT 'user',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tasks (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  text       VARCHAR(255) NOT NULL,
  emoji      VARCHAR(10) DEFAULT 'task',
  owner      VARCHAR(60) NOT NULL,
  tag        ENUM('travail','personnel','etude','urgent') DEFAULT 'personnel',
  priority   ENUM('haute','normale','basse') DEFAULT 'normale',
  done       TINYINT(1) DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 10 utilisateurs avec username + password
INSERT INTO users (username, password, role) VALUES
  ('aya',     'aya123',     'user'),
  ('omar',    'omar123',    'user'),
  ('fatima',  'fatima123',  'user'),
  ('youssef', 'youssef123', 'user'),
  ('sara',    'sara123',    'user'),
  ('karim',   'karim123',   'user'),
  ('nadia',   'nadia123',   'user'),
  ('hamza',   'hamza123',   'user'),
  ('leila',   'leila123',   'user'),
  ('mehdi',   'mehdi123',   'user'),
  ('admin',   'admin123',   'admin');

-- Quelques tâches de démo pour chaque utilisateur
INSERT INTO tasks (text, emoji, owner, tag, priority, done) VALUES
  ('Finir le rapport de stage',        'task', 'aya',     'etude',     'haute',   0),
  ('Reviser le cours C++',             'task', 'aya',     'etude',     'normale', 1),
  ('Preparer la presentation DevOps',  'task', 'omar',    'travail',   'haute',   0),
  ('Lire le chapitre Docker',          'task', 'omar',    'etude',     'normale', 0),
  ('Faire les courses',                'task', 'fatima',  'personnel', 'basse',   0),
  ('Reviser les maths',                'task', 'fatima',  'etude',     'haute',   0),
  ('Finir le projet web',              'task', 'youssef', 'travail',   'haute',   0),
  ('Sport 30 minutes',                 'task', 'sara',    'personnel', 'normale', 0),
  ('Lire un livre',                    'task', 'karim',   'personnel', 'basse',   1),
  ('Preparer lexamen',                 'task', 'nadia',   'etude',     'haute',   0);
