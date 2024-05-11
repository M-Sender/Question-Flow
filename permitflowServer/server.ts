import express, { Request, Response } from 'express';

const app = express();
const PORT = 3000;

// Middleware for parsing JSON body
app.use(express.json());

// Endpoint to get initial questions
app.get('/getInitialQuestions', (req: Request, res: Response) => {
  
  const questions = ['Question 1', 'Question 2', 'Question 3'];
  res.json({ questions });
});

// Endpoint to save temporary session data
app.post('/saveTempSession', (req: Request, res: Response) => {
  const { cookie, answers } = req.body;
  // Your logic for saving temporary session data
  res.json({ message: 'Temporary session data saved successfully', cookie, answers });
});

// Endpoint to save results
app.post('/saveResults', (req: Request, res: Response) => {
  const { cookie, answers } = req.body;
  // Your logic for saving results
  res.json({ message: 'Results saved successfully', cookie, answers });
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
