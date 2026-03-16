CREATE TABLE IF NOT EXISTS users (
  id         SERIAL PRIMARY KEY,
  username   VARCHAR(60) NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,
  role       VARCHAR(10) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tasks (
  id         SERIAL PRIMARY KEY,
  text       VARCHAR(255) NOT NULL,
  emoji      VARCHAR(20) DEFAULT 'pin',
  owner      VARCHAR(60) NOT NULL,
  tag        VARCHAR(20) DEFAULT 'personnel',
  priority   VARCHAR(10) DEFAULT 'normale',
  done       BOOLEAN DEFAULT FALSE,
  date       DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
  ('admin',   'admin123',   'admin')
ON CONFLICT (username) DO NOTHING;

INSERT INTO tasks (text, emoji, owner, tag, priority, done, date) VALUES
  ('Finir le rapport de stage',       'pin', 'aya',    'etude',     'haute',   false, CURRENT_DATE),
  ('Reviser le cours C++',            'pin', 'aya',    'etude',     'normale', true,  CURRENT_DATE - 1),
  ('Preparer la presentation DevOps', 'pin', 'omar',   'travail',   'haute',   false, CURRENT_DATE),
  ('Faire les courses',               'pin', 'fatima', 'personnel', 'basse',   false, CURRENT_DATE + 1),
  ('Sport 30 minutes',                'pin', 'aya',    'personnel', 'normale', false, CURRENT_DATE);
