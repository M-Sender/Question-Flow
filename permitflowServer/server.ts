import express, { Request, Response } from 'express';
import './database/databaseActions';
import { buildQuestionSet, grabCompiledTree, storeResults } from './database/databaseActions';
import { compiledTree, questionSet} from '../interfaces';
const cors = require('cors');



const app = express();
const PORT = 8000;

app.use(express.json());
app.use(cors());

app.get('/getInitialQuestions', async (req: Request, res: Response) => {
  const municipality : Number=0;
  const treeInfo : compiledTree = await grabCompiledTree(municipality);
  const stepInfo : questionSet = await buildQuestionSet(treeInfo);
  let answerTree : [number[]] = [[]];
  res.json({ compiledTree: treeInfo, steps: stepInfo , answerTree : answerTree});
});

app.post('/saveTempSession', (req: Request, res: Response) => {
  const answers= req.body.answerTree;
  res.json({ message: 'Temporary session data saved successfully'});
});

app.put('/saveResults', (req: Request, res: Response) => {
  const answers= req.body.answerTree;
  const result= req.body.result;
  const municipality : number=0;
  storeResults(answers,municipality,result);
  res.json({ message: 'Results saved successfully'});
});






app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
