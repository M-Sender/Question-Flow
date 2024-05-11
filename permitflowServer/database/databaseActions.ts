import sqlite3 from 'sqlite3';
import { config, tables } from './config';

const db = new sqlite3.Database(config.databasePath);

function grabCompiledTree(municipality : Number) : JSON {
    const query = `SELECT ${tables.compiledTrees.columns.compiledTree} FROM ${tables.compiledTrees.tableName} WHERE ${tables.compiledTrees.columns.municipality_id} = ${municipality}`;
    const compiledTree = {};
    
    db.get(query, [1], (err, row :JSON) => {
        if (err) {
            console.error('Error executing query:', err);
            return;
        }
        compiledTree["JSON"] = row;
    });

    return compiledTree["JSON"];
}

function storeResults(answers : Number[] , municipality : Number ) : void {
    const query = `INSERT INTO ${tables.questionnaireResults.tableName} (${tables.questionnaireResults.columns.id},${tables.questionnaireResults.columns.municipality}) VALUES (?,?) ` 

    db.run(query, [answers,municipality], (err, row) => {
        if (err) {
            console.error('Error executing query:', err);
            return;
        }
    });
}

export {grabCompiledTree,storeResults}


