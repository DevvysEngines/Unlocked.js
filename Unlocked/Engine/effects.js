import { node } from "./node.js"
import { utils } from "./utils.js";

export class effect {
    constructor(Name=`Effect`,tags=[],onApply=()=>{},update=(element,delta)=>{},onFinished=()=>{}){
        this._onApply = onApply;
        this._update = update;
        this._onFinished = onFinished;
        this.Name = Name;
        this.tags = utils.normalizePath(tags);
        this.type = `node`;
    }
    onApply({key:node,element},...info){
        info[0]*=1000;
        info[0]/=60;
        return {info};
    }
    update({element,key},delta,duration,...info){
        if (!key.active)return;
        let active = true;
        let reapp = this._update({element,key},delta,...info);
        if (reapp)info=reapp;
        duration-=1*delta;
        if (duration<=0){
            element.deleteNode({node:key.node,id:key.id,info:[duration,...info]});
            active = false;
        }
        return {info:[duration,...info],active};
    }
    onFinished({key,element}){

    }
}