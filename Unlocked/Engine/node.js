import { utils } from "./utils.js";

export class node{
    #defaults = {
        Name:`node`
        ,tags:[]
        ,onApply:function(){}
        ,update:function(){}
        ,onFinished:function(){}
        ,type:`node`
    }
    constructor(Name, tags, onApply, update, onFinished){
        if (typeof Name !== `object`){Name={Name, tags, onApply, update, onFinished, type:`node`};}
        Object.assign(
            this
            ,{...this.#defaults}
            ,Object.fromEntries(
                Object.entries(Name).filter(([_, v]) => v !== undefined)
            )
        );
        this.tags = utils.normalizePath(this.tags);
        this.type = `node`;
    }
}