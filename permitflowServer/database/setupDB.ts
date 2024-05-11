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
    ${tables.steps.columns.prompt} TEXT,
    ${tables.steps.columns.subText} JSON
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

function insertCompiledTree(municipalityId : number, compiledTree : Object) {
  db.run(`INSERT INTO ${tables.compiledTrees.tableName} (${tables.compiledTrees.columns.municipality_id}, ${tables.compiledTrees.columns.compiledTree})
          VALUES (?, ?)`, [municipalityId, JSON.stringify(compiledTree)], (err) => {
      if (err) {
          console.error('Error inserting compiled tree:', err);
      } else {
          console.log('Compiled tree inserted successfully');
      }
  });
}

function insertMunicipality(id : number, name : string) {
  db.run(`INSERT INTO ${tables.municipalities.tableName} (${tables.municipalities.columns.id},${tables.municipalities.columns.name})
          VALUES (?,?)`, [id,name], (err) => {
      if (err) {
          console.error('Error inserting municipality:', err);
      } else {
          console.log('Municipality inserted successfully');
      }
  });
}

function insertStep(id : number, prompt : string, extraText? : string[] ) {
  const JSONextraText : string = JSON.stringify(extraText);
  db.run(`INSERT INTO ${tables.steps.tableName} (${tables.steps.columns.id},${tables.steps.columns.prompt},${tables.steps.columns.subText})
          VALUES (?,?,?)`, [id,prompt,JSONextraText], (err) => {
      if (err) {
          console.error('Error inserting step:', err);
      } else {
          console.log('Step inserted successfully');
      }
  });
}

function insertQuestionnaireResult(results : number[], municipalityId : number) {
  db.run(`INSERT INTO ${tables.questionnaireResults.tableName} (${tables.questionnaireResults.columns.results}, ${tables.questionnaireResults.columns.municipality})
          VALUES (?, ?)`, [JSON.stringify(results), municipalityId], (err) => {
      if (err) {
          console.error('Error inserting questionnaire result:', err);
      } else {
          console.log('Questionnaire result inserted successfully');
      }
  });
}


async function buildTables() : Promise<void> {
  return new Promise<void>((_resolve,_reject) => {
    createCompiledTreesTable();
    createMunicipalitiesTable();
    createStepsTable();
    createQuestionnaireResultsTable();
  });
}
//Write code to seed DB with example from notion
async function seedDB() : Promise<void>{
  return new Promise<void>((_resolve,_reject) => {
    insertMunicipality(0,"New York");

    insertStep(1,"Interior work");
    insertStep(2,"Exterior work");
    insertStep(3,"Bathroom remodel");
    insertStep(4,"New bathroom");
    insertStep(5,"New laundry room");
    insertStep(6,"Other");
    insertStep(7,"Over-the-Counter Submission Process",["A building permit is required.","Submit application for OTC review"]);
    insertStep(8,"In-House Review Process",["A building permit is required","Include plans sets.","Submit application for in-house review."]);
    insertStep(9,"Garage door replacement");
    insertStep(10,"Exterior doors");
    insertStep(11,"Fencing");
    insertStep(12,"Other");
    insertStep(14,"No Permit",["Nothing is required! You're set to build."]);

    insertCompiledTree(0,{
      0:[1,[1,2]],
      1:[2,[3,4,5,6]],//multi select need importance level
      3:[0,[7],2],
      4:[0,[8],1],
      5:[0,[8],1],
      6:[0,[8],1],
      2:[2,[9,10,11,12]],//multi select need importance level
      9:[0,[7],2],
      10:[0,[7],2],
      11:[0,[14],1],
      12:[0,[8],3]}) 

    });
  
}

async function handleExecution() {
  try {
  //await buildTables();
  await seedDB();
  console.log("Made and seeded")
}
catch{
  console.log("Errors");
}
finally{
  console.log("finished");
  db.close()
}
}

handleExecution();