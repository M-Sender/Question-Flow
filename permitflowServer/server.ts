import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import { v4 as uuidv4 } from 'uuid';
import './database/databaseActions.ts';
import { grabCompiledTree, storeResults } from './database/databaseActions.ts';
import { questionSet, sessionHolder } from '../interfaces.ts';

function generateCookie(): string {
  return uuidv4().substr(0, 15);
}


const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());

const tempSessions: sessionHolder ={};

app.get('/getInitialQuestions', (req: Request, res: Response) => {
  const municipality : Number=0;
  const treeInfo : [questionSet, JSON ]  = grabCompiledTree(municipality);
  const questions = treeInfo[0];
  const compiledTree = treeInfo[1];
  let answerTree : [number[]] = [[]];
  if(req.cookie in tempSessions){
    answerTree=tempSessions[req.cookie];
    }
  else{
    var cookie : string = generateCookie();
    while (cookie in tempSessions){
      cookie = generateCookie();
    }
    res.cookie('sessionID',cookie,{
      maxAge: 7 * 24 * 60 * 60 * 1000, 
      httpOnly: true, 
      secure: true
      });
    }
  res.json({ compiledTree: compiledTree, questions: questions , answerTree : answerTree});
});

app.post('/saveTempSession', (req: Request, res: Response) => {
  const { cookie, answers} = req.body;
  tempSessions[cookie] = answers;
  res.json({ message: 'Temporary session data saved successfully'});
});

app.post('/saveResults', (req: Request, res: Response) => {
  const { cookie, answers} = req.body;
  const municipality : Number=0;
  storeResults(answers,municipality);
  delete tempSessions[cookie];
  res.json({ message: 'Results saved successfully'});
});






app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
