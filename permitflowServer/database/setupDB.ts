import sqlite3 from 'sqlite3';
import { config, tables } from './config';

const db = new sqlite3.Database(config.databasePath);

// Clear existing tables (if any) and create new ones (will remove)
db.serialize(() => {
  db.run(`DROP TABLE IF EXISTS ${tables.compiledTrees}`);
  db.run(`DROP TABLE IF EXISTS ${tables.municipalities}`);
  db.run(`DROP TABLE IF EXISTS ${tables.steps}`);
  db.run(`DROP TABLE IF EXISTS ${tables.questionnaireResults}`);

  db.run(`CREATE TABLE ${tables.compiledTrees} (
    id INTEGER PRIMARY KEY,
    municipality_id INTEGER,
    compiledTree JSON,
    FOREIGN KEY (municipality_id) REFERENCES ${tables.municipalities}(id)
  )`);

  db.run(`CREATE TABLE ${tables.municipalities} (
    id INTEGER PRIMARY KEY,
    name TEXT
  )`);

  db.run(`CREATE TABLE ${tables.steps} (
    id INTEGER PRIMARY KEY,
    prompt TEXT
  )`);

  db.run(`CREATE TABLE ${tables.questionnaireResults} (
    id INTEGER PRIMARY KEY,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    results JSON,
    FOREIGN KEY (results) REFERENCES ${tables.steps}(id)
  )`);
});


//Write code to seed DB with example for notion

db.close();