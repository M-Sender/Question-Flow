'use client'
import { useEffect, useState } from "react";
import { answerSendTypes, formTypes, QuestionContainerProps } from "../../../../interfaces";

export const QuestionContainer: React.FC<QuestionContainerProps> = (props) => {
    const [currentAns, setCurrentAns] = useState<string[]>([]);
    let formLogic = singleSelectCallBack;

    if (!props.data.workflow || !props.data.formType || !props.stepInfo) {
        return null;
    }

    if (props.data.formType === formTypes.singleSelect) {
        formLogic = singleSelectCallBack;
    } else if (props.data.formType === formTypes.multiSelect) {
        formLogic = multiSelectCallBack;
    }

    function singleSelectCallBack(id: string) {
        setCurrentAns(currentAns => currentAns.includes(id) ? [] : [id]);
    }

    function multiSelectCallBack(id: string) {
        setCurrentAns(currentAns =>
            currentAns.includes(id) ? currentAns.filter(item => item !== id) : [...currentAns, id]
        );
    }

    if (props.data.formType === formTypes.text) {
        const step = props.data.workflow["0"];
        let key = 0;
        props.callBack([answerSendTypes.sendToDB, step]);
        return (
            <div className="max-w-xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">{props.stepInfo[step].prompt}</h1>
                {props.stepInfo[step].subText.map((text, index) => (
                    <p key={index} className="mb-2 text-gray-800">{text}</p>
                ))}
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{props.data.prompt}</h1>
            {Object.values(props.data.workflow).map((step, index) => (
                <label key={step} className="block mb-2 text-gray-800 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={currentAns?.includes(step)}
                        onChange={() => formLogic(step)}
                        className="mr-2 text-blue-500 form-checkbox rounded focus:ring-blue-500"
                    />
                    <span className="bg-blue-100 hover:bg-blue-200 rounded-md px-2 py-1 transition-colors duration-300">
                        {props.stepInfo ? props.stepInfo[step].prompt : null}
                    </span>
                </label>
            ))}

            <div className="mt-4">
                {!props.isStart && (
                    <button
                        className="bg-blue-500 text-white py-2 px-4 mr-4 rounded hover:bg-blue-600 transition duration-300"
                        title="Go Back"
                        onClick={() => { props.callBack([answerSendTypes.goBack]); setCurrentAns([]); }}
                    >
                        Go Back
                    </button>
                )}
                <button
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
                    title="Continue"
                    onClick={() => { props.callBack(currentAns); setCurrentAns([]); }}
                >
                    Continue
                </button>
            </div>
        </div>
    );
};
