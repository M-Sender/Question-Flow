import sqlite3 from 'sqlite3';
import { config, tables } from './config';

const db = new sqlite3.Database(config.databasePath);

function createCompiledTreesTable() {
  db.run(`CREATE TABLE ${tables.compiledTrees.tableName} (
    ${tables.compiledTrees.columns.id} INTEGER PRIMARY KEY,
    ${tables.compiledTrees.columns.municipality_id} INTEGER,
    ${tables.compiledTrees.columns.compiledTree} JSON,
    FOREIGN KEY (${tables.compiledTrees.columns.municipality_id}) REFERENCES ${tables.municipalities.tableName}(${tables.municipalities.columns.id})
  )`, () => {
  });
}

function createMunicipalitiesTable() {
  db.run(`CREATE TABLE ${tables.municipalities.tableName} (
    ${tables.municipalities.columns.id} INTEGER PRIMARY KEY,
    ${tables.municipalities.columns.name} TEXT
  )`, () => {
  });
}

function createStepsTable() {
  db.run(`CREATE TABLE ${tables.steps.tableName} (
    ${tables.steps.columns.id} INTEGER PRIMARY KEY,
    ${tables.steps.columns.prompt} TEXT
  )`, () => {
  });
}

function createQuestionnaireResultsTable() {
  db.run(`CREATE TABLE ${tables.questionnaireResults.tableName} (
    ${tables.questionnaireResults.columns.id} INTEGER PRIMARY KEY,
    ${tables.questionnaireResults.columns.timestamp} DATETIME DEFAULT CURRENT_TIMESTAMP,
    ${tables.questionnaireResults.columns.results} JSON,
    ${tables.questionnaireResults.columns.municipality} INTEGER, 
    FOREIGN KEY (${tables.questionnaireResults.columns.municipality}) REFERENCES ${tables.municipalities.tableName}(${tables.municipalities.columns.id})
  )`, () => {
  });
}

createCompiledTreesTable();
createMunicipalitiesTable();
createStepsTable();
createQuestionnaireResultsTable();

//Write code to seed DB with example for notion

db.close();