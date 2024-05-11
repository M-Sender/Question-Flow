export interface sessionHolder {
    [key: string]: [number[]];
  }
  
export interface questionSet {
    [key:number] : [string,string[]]
  }

export interface workflow{
    workflow : step[]
}

export interface step {
    [id: number]: string;
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


export enum formTypes{
    text,
    singleSelect,
    multiSelect

}