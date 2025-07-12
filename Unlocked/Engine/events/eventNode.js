import { utils } from "../utils.js";

export class eventNode{
    constructor(Name=`eventNode`,tags=[],path=["properties/health"],condition=function(ov,v){return true;},trigger=function(){},triggerTimes=false,onApply=function(){},onFinished=function(){}){
        this.Name = Name;
        this.tags = utils.normalizePath(tags);
        this.path = utils.normalizePath(path);
        this.condition = condition;
        this.trigger = trigger;
        this.triggerTimes = triggerTimes;
        this.onApply = onApply;
        this.onFinished = onFinished;
        this.type = `eventNode`;
    }   
}