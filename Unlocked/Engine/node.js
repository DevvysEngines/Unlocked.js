import { effect } from "./effects.js";
import { utils } from "./utils.js";

export class node{
    static effect = effect;
    constructor(Name=`node`,tags=[],onApply=()=>{},update=()=>{},onFinished=()=>{}){
        this.onApply = onApply;
        this.update = update;
        this.onFinished = onFinished;
        this.Name = Name;
        this.tags = utils.normalizePath(tags);
        this.type = `node`;
    }
}