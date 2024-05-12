'use client';
import { useEffect, useState } from "react";
import { QuestionContainer } from "./components/questionContainer";
import { answerSendTypes, compiledTree, formTypes, stepInfoDictionary, stepLogic } from '../../../interfaces';
import axios, { AxiosRequestConfig } from 'axios';

export default function Page() {
  const [compiledTree, setCompiledTree] = useState<compiledTree>();
  const [stepInfo, setStepInfo] = useState<stepInfoDictionary>();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [answerTree, setAnswerTree] = useState<[number[], ...number[]]>([[]]);
  const [currentOptions, setCurrentOptions] = useState<stepLogic>();

  async function callBackLogic(answer: number[]) {
    if (Array.isArray(answer)) {
      if (answer[0] === answerSendTypes.goBack) {
        answerTree.pop();
        if (answerTree.length > 0) {
          const lastAnswer: number[] = answerTree[answerTree.length - 1] as number[];
          callBackLogic(lastAnswer);
        } else {
          setCurrentStep(0);
          setAnswerTree([[]]);
        }
      } else if (answer[0] === answerSendTypes.sendToDB) {
        await sendToDB(answer[1]);
      } else {
        if (answerTree[0].length === 0) {
          const newTree: [number[], ...number[]] = answerTree;
          newTree[0] = answer;
          setAnswerTree(newTree);
        } else {
          const newTree: [number[], ...number[]] = answerTree;
          newTree[newTree.length] = answer;
          setAnswerTree(newTree);
        }
        let priorityStep = 0;
        let priorityLevel = -1;
        if (compiledTree) {
          answer.forEach(selection => {
            const temp = compiledTree[selection];
            if (temp.importance && temp.importance > priorityLevel)
              priorityLevel = temp.importance;
            priorityStep = selection;
          });
          setCurrentStep(priorityStep);
        }
      }
    }
  }

  async function sendToDB(result:number) {
    try {
      const config: AxiosRequestConfig = {
        method: 'put',
        url: 'http://localhost:8000/saveResults',
        params: {
          municipality: 0,
        },
        data: {
          answerTree: answerTree,
          result    : result,
        },
      };
      await axios(config);
     
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchCompiledTree() {
    try {
      const config: AxiosRequestConfig = {
        method: 'get',
        url: 'http://localhost:8000/getInitialQuestions',
        params: {
          municipality: 0,
        },
      };

      const response = await axios(config);
      const data = response.data;
      setCompiledTree(data.compiledTree);
      if (answerTree[0].length !== 0) {
        setAnswerTree(data.answerTree);
        setCurrentStep(answerTree.length);
      } else {
        setCurrentStep(0);
      }

      setStepInfo(data.steps);
      if (compiledTree) {
        setCurrentOptions(compiledTree[currentStep]);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function sendTempSession() {
    try {
      const config: AxiosRequestConfig = {
        method: 'put',
        url: 'http://localhost:8000/sendTempSession',
        params: {
          municipality: 0,
          answerTree: answerTree
        },
      };
      await axios(config);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchCompiledTree();
  }, []);

  useEffect(() => {
    if (compiledTree) {
      const something = compiledTree[currentStep];
      setCurrentOptions({ formType: something.formType, workflow: something.workflow , prompt: something.prompt });
    }
  }, [currentStep, compiledTree]);

  if (!currentOptions || !stepInfo) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">PermitFlow Questionnaire</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <QuestionContainer data={currentOptions} callBack={callBackLogic} stepInfo={stepInfo} isStart={currentStep === 0} />
        </div>
      </main>
    </div>
  );
}
