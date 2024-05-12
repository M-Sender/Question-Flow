import sqlite3 from 'sqlite3';
import { config, tables } from './config';
import { compiledTree, questionSet, stepLogic } from '../../interfaces';
import { promisify } from 'util';

const db = new sqlite3.Database("./database/" + config.databasePath, (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Database connected successfully.');
    }
});

const dbGetAsync: Function = promisify(db.get).bind(db);
const dbRunAsync: Function = promisify(db.run).bind(db);

async function grabCompiledTree(municipality: Number): Promise<compiledTree> {
    const query = `SELECT ${tables.compiledTrees.columns.compiledTree} FROM ${tables.compiledTrees.tableName} WHERE ${tables.compiledTrees.columns.municipality_id} = ${municipality}`;
    try {
        const row = await dbGetAsync(query);
        return JSON.parse(row.compiledTree);
    } catch (err) {
        console.error(err);
        throw err;
    }
}

async function grabStep(id: string): Promise<stepLogic> {
    const query = `SELECT ${tables.steps.columns.prompt},${tables.steps.columns.subText} FROM ${tables.steps.tableName} WHERE ${tables.steps.columns.id} = ${id}`;
    try {
        const row = await dbGetAsync(query);
        row.subText = JSON.parse(row.subText);
        return row;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

function storeResults(answers: [Number[]], municipality: number,result:number): void {
    const query=`INSERT INTO ${tables.questionnaireResults.tableName} (${tables.questionnaireResults.columns.answers}, ${tables.questionnaireResults.columns.municipality}, ${tables.questionnaireResults.columns.result
    })
    VALUES (?, ?,?)`;
    try{
    return dbRunAsync(query, [JSON.stringify(answers), municipality,result]);
    }
 catch (err) {
    console.error(err);
    throw err;
}
}

async function buildQuestionSet(tree: compiledTree): Promise<questionSet> {
    const steps: questionSet = {};
    if (!tree) {
        return steps;
    }
    for (const [id, value] of Object.entries<any>(tree)) {
        if (id !== '0' && !(id in steps)) {
            steps[id] = await grabStep(id);
        }
        if (value && value.workflow) {
            await Promise.all(value.workflow.map(async (stepID: string) => {
                if (!(stepID in steps)) {
                    steps[stepID] = await grabStep(stepID);
                }
            }));
        }
    }
    return steps;
}

export { grabCompiledTree, storeResults, buildQuestionSet };
