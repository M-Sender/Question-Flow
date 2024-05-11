import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

import './database/databaseActions.ts';
import { grabCompiledTree, storeResults } from './database/databaseActions.ts';

function generateCookie(): string {
  return uuidv4().substr(0, 15);
}


const app = express();
const PORT = 3000;

app.use(express.json());

interface sessionHolder {
  [key: string]: [number, number[]];
}

const tempSessions: sessionHolder ={};

app.get('/getInitialQuestions', (req: Request, res: Response) => {
  const municipality : Number=0;
  const questions : JSON = grabCompiledTree(municipality);
  var cookie : string = generateCookie();
  while (cookie in tempSessions){
    cookie = generateCookie();
  }
  res.json({ questions, cookie });
});

app.post('/saveTempSession', (req: Request, res: Response) => {
  const { cookie, answers, municipality } = req.body;
  tempSessions[cookie] = answers;
  res.json({ message: 'Temporary session data saved successfully'});
});

app.post('/saveResults', (req: Request, res: Response) => {
  const { cookie, answers, municipality } = req.body;
  storeResults(answers,municipality)
  delete tempSessions[cookie];
  res.json({ message: 'Results saved successfully'});
});






app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
