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
  emoji      VARCHAR(20) DEFAULT 'pin',
  owner      VARCHAR(60) NOT NULL,
  tag        ENUM('travail','personnel','etude','urgent') DEFAULT 'personnel',
  priority   ENUM('haute','normale','basse') DEFAULT 'normale',
  done       TINYINT(1) DEFAULT 0,
  date       DATE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

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

INSERT INTO tasks (text, emoji, owner, tag, priority, done, date) VALUES
  ('Finir le rapport de stage',       'pin', 'aya',    'etude',    'haute',   0, CURDATE()),
  ('Reviser le cours C++',            'pin', 'aya',    'etude',    'normale', 1, DATE_SUB(CURDATE(),INTERVAL 1 DAY)),
  ('Preparer la presentation DevOps', 'pin', 'omar',   'travail',  'haute',   0, CURDATE()),
  ('Faire les courses',               'pin', 'fatima', 'personnel','basse',   0, DATE_ADD(CURDATE(),INTERVAL 1 DAY)),
  ('Sport 30 minutes',                'pin', 'aya',    'personnel','normale', 0, CURDATE());
