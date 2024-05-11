import { useEffect, useState } from "react";
import {QuestionContainer } from "./components/questionContainer";
import { formTypes, stepLogic } from '../../../interfaces'
import axios, { AxiosRequestConfig } from 'axios';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

export default function Home() {

  
  const [compiledTree,setCompiledTree] = useState<compiledTree>();
  const [currentStep,setCurrentStep] = useState<number>(0);
  const [answerTree, setAnswerTree] = useState<number[]>([]);
  const [currentOptions, setCurrentOptions] = useState<stepLogic>();
  //pass into 

  function callBackLogic(answer : number){
    if(answer===-1){
      delete answerTree[-1];
      setCurrentStep(answerTree[-1]);
    }
    else{
      setAnswerTree(answerTree.concat(answer));
    }
  }

  async function fetchCompiledTree() {
    try {
      const config: AxiosRequestConfig = {
          method: 'get',
          url: 'API HERR',
          params: {
              municipality: 0,
          },
      };

      const response = await axios(config);
      const data = JSON.parse(response.data());
      if(cookies.get('sessionID')==undefined) {
        cookies.set('sessionID',data.cookie,{path: '/'});
      }
      setCompiledTree(data.json.compiledTree);
      setAnswerTree(data.json.answerTree);
      setCurrentStep(answerTree.length);
    }
    catch (error){
      const tempStepLogic : stepLogic = {

        formType: formTypes.text,
        endText: ["End of workflow. Thank you!"]

      } 
      setCompiledTree([tempStepLogic]);
    }
  }
  async function sendTempSession() {
    try {
      const config: AxiosRequestConfig = {
          method: 'put',
          url: 'API HERR',
          params: {
              municipality: 0,
              cookie: cookies.get('sessionID'),
              answerTree : answerTree
          },
      };
      await axios(config);
    }
    catch (error){
      console.log(error);
    }
  }


  useEffect(()=>  {
      fetchCompiledTree();
   
    return () => { sendTempSession() }
  },[])

  useEffect(()=>{
    if(compiledTree){
      setCurrentOptions(compiledTree[currentStep]);
    }

  },[currentStep])

  if(!currentOptions){return;}
  return (
    <>
    <header>PermitFlow Questionnaire</header>
    <QuestionContainer data={currentOptions} callBack={callBackLogic} />
    </>
   
  );
}

interface compiledTree{
  [id:number] : stepLogic;
}