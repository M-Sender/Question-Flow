import { useEffect, useState } from "react";
import { formTypes, QuestionContainerProps, workflow } from "../../../../interfaces";

export const QuestionContainer :React.FC<QuestionContainerProps> = (props) => {

    const [workflow,setWorkflow] = useState<workflow>(); 
    const [endText,setsetEndText] = useState<string[]>(); 
    const [formLogic,setFormLogic] = useState<Function>();
    const [currentAns, setCurrentAns] = useState<number[]>();
    const formType = props.data.formType;
    setWorkflow(props.data.workflow)
    setsetEndText(props.data.endText)

    function singleSelectCallBack(id : number){
        if(currentAns?.includes(id)){
            setCurrentAns([])
        }
        else{
            setCurrentAns([id])
        }

    }
    function multiSelectCallBack(id : number){
        if(currentAns?.includes(id)){
            setCurrentAns(currentAns.filter(item => item !== id));
        }
        else{
            setCurrentAns(currentAns?.concat(id));
        }
    }

    useEffect(()=>{
        if(formType === formTypes.singleSelect){
            setFormLogic(singleSelectCallBack)
        }
        else if(formType === formTypes.multiSelect){
            setFormLogic(multiSelectCallBack)
        }
    }
    ,[formType]);

    if(formType==formTypes.text){//[title,sub,sub]
        if(endText===undefined){return;}
        return (
            <>
            <h6>{endText[0]}</h6>
            {endText.slice(1).map(text =>
                <p>{text}</p>
            )}
            </>

        );
    }

    if(!workflow||!formLogic){return}
    const tempVals = Object.values(workflow);
    return (
        
        <>
        {
        tempVals.map(step => (
                <label key={step.id}>
                    <input
                        type="checkbox"
                        checked={currentAns?.includes(step.id)}
                        onChange={() => formLogic(step.id,setCurrentAns) }
                    />
                    {step.step[step.id]}
                </label>


        ))}
        </>
    
    );
}

