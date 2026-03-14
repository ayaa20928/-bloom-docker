CREATE DATABASE IF NOT EXISTS bloom_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bloom_db;

CREATE TABLE IF NOT EXISTS users (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  username   VARCHAR(60) NOT NULL UNIQUE,
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

INSERT INTO users (username, role) VALUES
  ('aya','user'),('omar','user'),('fatima','user'),('admin','admin');

INSERT INTO tasks (text, emoji, owner, tag, priority, done) VALUES
  ('Finir le rapport de stage','task','aya','etude','haute',0),
  ('Reviser le cours C++','task','aya','etude','normale',1),
  ('Preparer la presentation DevOps','task','omar','travail','haute',0),
  ('Faire les courses','task','fatima','personnel','basse',0);
