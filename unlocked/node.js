import { effect } from "./effects.js";

export class node{
    static effect = effect;
    constructor(Name=`node`,tags=[],onApply=()=>{},update=()=>{},onFinished=()=>{}){
        this.onApply = onApply;
        this.update = update;
        this.onFinished = onFinished;
        this.Name = Name;
        this.tags = tags;
    }
}