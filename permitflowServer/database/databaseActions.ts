import sqlite3 from 'sqlite3';
import { config, tables } from './config';
import { compiledTree, questionSet, stepLogic } from '../../interfaces'
const db = new sqlite3.Database(config.databasePath);

function grabCompiledTree(municipality : Number) : [questionSet,JSON] {
    const query = `SELECT ${tables.compiledTrees.columns.compiledTree} FROM ${tables.compiledTrees.tableName} WHERE ${tables.compiledTrees.columns.municipality_id} = ${municipality}`;
    const compiledTree : any = {};
    
    db.get(query, [1], (err: string, row :string) => {
        if (err) {
            console.error('Error executing query:', err);
            return;
        }
        compiledTree["JSON"] = JSON.parse(row);
    });

    return [buildQuestionSet(compiledTree["JSON"]),compiledTree["JSON"]];
}

function grabStep(id : string) : stepLogic{
    const query = `SELECT (${tables.steps.columns.prompt},${tables.steps.columns.subText}) FROM ${tables.steps.tableName} WHERE ${tables.steps.columns.id} = ${id}`;
    const step : any ={} ;
    
    db.get(query, [1], (err :string, row :string) => {
        if (err) {
            console.error('Error executing query:', err);
            return;
        }
        step["JSON"] = JSON.parse(row);
    });

    return step["JSON"];
}

function storeResults(answers : Number[] , municipality : Number ) : void {
    const query = `INSERT INTO ${tables.questionnaireResults.tableName} (${tables.questionnaireResults.columns.id},${tables.questionnaireResults.columns.municipality}) VALUES (?,?) ` 

    db.run(query, [answers,municipality], (err: string, row:JSON) => {
        if (err) {
            console.error('Error executing query:', err);
            return;
        }
    });
}
/*{
    0:[1,[1,2,3,4]],
    7:[0,[9],['sub']]
} 
*/
function buildQuestionSet(tree : compiledTree ) : questionSet {
    const steps : questionSet= {};
    for(const [id,value]  of Object.entries<any>(tree)){ 
        if(!(id in steps)){
            steps[id]= grabStep(id);
        }
        const nextSteps : [] = value[1];
        if(value && value[1]){
        value[1].forEach((stepID:string) => {
                if(!(stepID in steps)){
                    steps[stepID]= grabStep(stepID);
                }
                
            });
       }
    }
    return steps;
}

export {grabCompiledTree,storeResults}


