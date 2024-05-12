export interface sessionHolder {
    [key: string]: [number[]];
  }
  
export interface questionSet {
    [key:string] : stepLogic
  }

export interface stepInfoDictionary {
    [id:string]:  stepInfo;
}
export interface stepInfo {
    prompt:string,
    subText:string[]
}
export interface step{
    [key:string] : []
}

export interface workflow{
    workflow : string[]
}

export interface stepLogic { //[[1,{1:"text",2:"text"}],["if last step"]]]
    formType    : formTypes,
    workflow?   : string[],
    importance? : number ,
    endText?    : string[],
    callBack?   : Function,
    prompt?     : string,
}

export interface QuestionContainerProps{
    data     : stepLogic,
    callBack : Function,
    stepInfo : stepInfoDictionary,
    isStart  : boolean,
}

export interface compiledTree{
    [id:string] : stepLogic;
  }

export enum formTypes{
    text=3,
    singleSelect=1,
    multiSelect=2,
    //text

}
export enum answerSendTypes{
    goBack=-1,
    sendToDB=-2,
}