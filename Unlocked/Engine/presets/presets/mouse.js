import { eventNode } from "../../events/eventNode.js";
let en = eventNode;

let mT = [`mouse`]

function mouseFn(v,fn,...args){ // when the mouse leaves or enters
    let call = fn.call(this,...args);
    if (call){if(call.info)call.info.unshift(fn)};
    return call;
}

function sumt(fn,...info){ // sets uses mouse true
    this.set(`properties/usesMouse`,true);
    if (!fn){
        return {info:[function(){},...info]}
    }
}

function rfum(){ // removes from uses mouse
    if (this.searchForEventNodeByTag(mT).length<=0){
        this.set(`properties/usesMouse`,false);
    }
}

function rpths(path){ // returns paths
    return {
        Down: new en(`mouseDown`,[`mouse/presets/down/${path}`],[`mouse/${path}/down`],rv,...mE)
        ,Up: new en(`mouseUp`,[`mouse/presets/up/${path}`],[`mouse/${path}/down`],rov,...mE)
    }
}

function rv(ov,v){return v;} // return value
function rov(ov){return ov;} // return old value(reversed)

let mE = [mouseFn,0,sumt,rfum] // main functions

export let mouse = {
    Enters: new en(`mouseEntered`,[`mouse/presets/entered`],[`mouse/over`],rv,...mE)
    ,Leaves: new en(`mouseLeft`,[`mouse/presets/left`],[`mouse/over`],rov,...mE)
    ,Left:rpths(`left`)
    ,Right:rpths(`right`)
    ,Middle:rpths(`middle`)
}