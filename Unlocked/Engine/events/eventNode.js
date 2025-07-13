import { utils } from "../utils.js";

export class eventNode{
    #defaults = {
        triggerTimes: 0
        ,active: true
        ,condition:function(){return true;}
        ,trigger:function(){return true;}
        ,Name:`eventNode`
        ,tags:[]
        ,path:[`properties/health`]
        ,onApply:function(){}
        ,onFinished:function(){}
    }
    constructor(Name, tags, path, condition, trigger, triggerTimes, onApply, onFinished){
        if (typeof Name !== `object`){Name={Name, tags, path, condition, trigger, triggerTimes, onApply, onFinished};}
        Object.assign(
            this
            ,{...this.#defaults}
            ,Object.fromEntries(
                Object.entries(Name).filter(([_, v]) => v !== undefined)
            )
        );
        this.tags = utils.normalizePath(this.tags);
        this.path = utils.normalizePath(this.path);
        this.type = `eventNode`;
    }
}