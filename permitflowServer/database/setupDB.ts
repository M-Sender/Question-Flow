import sqlite3 from 'sqlite3';
import { config, tables } from './config';
import { promisify } from 'util';

const db = new sqlite3.Database(config.databasePath);
const dbRunAsync: Function = promisify(db.run).bind(db);

function createCompiledTreesTable() {
  return dbRunAsync(`CREATE TABLE ${tables.compiledTrees.tableName} (
    ${tables.compiledTrees.columns.id} INTEGER PRIMARY KEY,
    ${tables.compiledTrees.columns.municipality_id} INTEGER,
    ${tables.compiledTrees.columns.compiledTree} JSON,
    FOREIGN KEY (${tables.compiledTrees.columns.municipality_id}) REFERENCES ${tables.municipalities.tableName}(${tables.municipalities.columns.id})
  )`);
}

function createMunicipalitiesTable() {
  return dbRunAsync(`CREATE TABLE ${tables.municipalities.tableName} (
    ${tables.municipalities.columns.id} INTEGER PRIMARY KEY,
    ${tables.municipalities.columns.name} TEXT
  )`);
}

function createStepsTable() {
  return dbRunAsync(`CREATE TABLE ${tables.steps.tableName} (
    ${tables.steps.columns.id} INTEGER PRIMARY KEY,
    ${tables.steps.columns.prompt} TEXT,
    ${tables.steps.columns.subText} JSON
  )`);
}

function createQuestionnaireResultsTable() {
  return dbRunAsync(`CREATE TABLE ${tables.questionnaireResults.tableName} (
    ${tables.questionnaireResults.columns.id} INTEGER PRIMARY KEY,
    ${tables.questionnaireResults.columns.timestamp} DATETIME DEFAULT CURRENT_TIMESTAMP,
    ${tables.questionnaireResults.columns.answers} JSON,
    ${tables.questionnaireResults.columns.municipality} INTEGER, 
    ${tables.questionnaireResults.columns.result} INTEGER,
    FOREIGN KEY (${tables.questionnaireResults.columns.municipality}) REFERENCES ${tables.municipalities.tableName}(${tables.municipalities.columns.id})
    FOREIGN KEY (${tables.questionnaireResults.columns.result}) REFERENCES ${tables.steps.tableName}(${tables.steps.columns.id})
  )`);
}

function insertCompiledTree(municipalityId: number, compiledTree: Object) {
  return dbRunAsync(`INSERT INTO ${tables.compiledTrees.tableName} (${tables.compiledTrees.columns.municipality_id}, ${tables.compiledTrees.columns.compiledTree})
          VALUES (?, ?)`, [municipalityId, JSON.stringify(compiledTree)]);
}

function insertMunicipality(id: number, name: string) {
  return dbRunAsync(`INSERT INTO ${tables.municipalities.tableName} (${tables.municipalities.columns.id},${tables.municipalities.columns.name})
          VALUES (?,?)`, [id, name]);
}

function insertStep(id: number, prompt: string, extraText?: string[]) {
  const JSONextraText: string = JSON.stringify(extraText);
  return dbRunAsync(`INSERT INTO ${tables.steps.tableName} (${tables.steps.columns.id},${tables.steps.columns.prompt},${tables.steps.columns.subText})
          VALUES (?,?,?)`, [id, prompt, JSONextraText]);
}

async function buildTables(): Promise<void> {
  try {
    await createCompiledTreesTable();
    await createMunicipalitiesTable();
    await createStepsTable();
    await createQuestionnaireResultsTable();
  } catch (error) {
    console.error(error);
  }
}

async function seedDB(): Promise<void> {
  try {
    await insertMunicipality(0, "New York");

    await insertStep(1, "Interior work");
    await insertStep(2, "Exterior work");
    await insertStep(3, "Bathroom remodel");
    await insertStep(4, "New bathroom");
    await insertStep(5, "New laundry room");
    await insertStep(6, "Other");
    await insertStep(7, "Over-the-Counter Submission Process", ["A building permit is required.", "Submit application for OTC review"]);
    await insertStep(8, "In-House Review Process", ["A building permit is required", "Include plans sets.", "Submit application for in-house review."]);
    await insertStep(9, "Garage door replacement");
    await insertStep(10, "Exterior doors");
    await insertStep(11, "Fencing");
    await insertStep(12, "Other");
    await insertStep(13, "No Permit", ["Nothing is required! You're set to build."]);

    await insertCompiledTree(0, {
      0: {
        prompt:"What residential work are you doing?",
        formType: 1,
        workflow: [1, 2],
        importance: 0
      },
      1: {
        prompt:"What interior work are you doing?",
        formType: 2,
        workflow: [3, 4, 5, 6],
        importance: 0
      },
      3: {
        prompt:"",
        formType: 3,
        workflow: [7],
        importance: 2
      },
      4: {
        prompt:"",
        formType: 3,
        workflow: [8],
        importance: 1
      },
      5: {
        prompt:"",
        formType: 3,
        workflow: [8],
        importance: 1
      },
      6: {
        prompt:"",
        formType: 3,
        workflow: [8],
        importance: 1
      },
      2: {
        prompt:"What exterior work are you doing?",
        formType: 2,
        workflow: [9, 10, 11, 12],
        importance: 0
      },
      9: {
        prompt:"",
        formType: 3,
        workflow: [7],
        importance: 2
      },
      10: {
        prompt:"",
        formType: 3,
        workflow: [7],
        importance: 2
      },
      11: {
        prompt:"",
        formType: 3,
        workflow: [13],
        importance: 1
      },
      12: {
        prompt:"",
        formType: 3,
        workflow: [8],
        importance: 3
      }
    });
  } catch (error) {
    console.error(error);
  }
}

async function handleExecution() {
  try {
    await buildTables();
    console.log("Made Tables")
    await seedDB();
    console.log("Seeded tables");
  } catch (error) {
    console.error(error);
  } finally {
    db.close();
  }
}

handleExecution();
