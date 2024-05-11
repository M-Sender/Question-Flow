export interface sessionHolder {
    [key: string]: [number[]];
  }
  
export interface questionSet {
    [key:string] : stepLogic
  }

export interface singleStep {
    
}
export interface step{
    [key:string] : []
}

export interface workflow{
    workflow : step[]
}

export interface stepLogic { //[[1,{1:"text",2:"text"}],["if last step"]]]
    formType    : formTypes,
    workflow?   : workflow,
    importance? : number ,
    endText?    : string[],
}

export interface QuestionContainerProps{
    data     : stepLogic,
    callBack : Function
}

export interface compiledTree{
    [id:string] : stepLogic;
  }

export enum formTypes{
    text,
    singleSelect,
    multiSelect

}