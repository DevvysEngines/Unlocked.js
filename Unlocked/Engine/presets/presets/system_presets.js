import { game } from "../../engine.js";
import { eventNode } from "../../events/eventNode.js";
import { scene } from "../../scene.js";
let en = eventNode;

function urp(path,[ov,v]){ // update renderer property
    let chunk = this.chunk;
    if (!chunk)return;
    this.system_set([`renderer`,path],ov);
    chunk.removeElement(this);
    this.system_set([`renderer`,path],v);
    chunk.addElement(this);
}
function pc(type){ // position changed
    let chunk = this.chunk;
    if (!chunk)return;
    let newchunk = game.currentscene.locateChunkByPos(this.x,this.y);
    if (!newchunk)return;
    if (chunk.pos[type]!=newchunk.pos[type]){
        game.currentscene.moveElementToChunk(this,newchunk);
    }
}

export let system_presets = {
    element: [
        [new en(`xPositionChange`,[`system/presets/x/position/change`],[`properties/x`],undefined,function(){pc.call(this,`x`);})]
        ,[new en(`yPositionChange`,[`system/presets/y/position/change`],[`properties/y`],undefined,function(){pc.call(this,`y`);})]
        ,[new en(`colorChange`,[`system/presets/color`],[`renderer/color`],undefined,function(v){urp.call(this,`color`,v);})]
        ,[new en(`transparencyChange`,[`system/presets/transparency`],[`renderer/transparency`],undefined,function(v){urp.call(this,`transparency`,v);})]
        ,[new en(`uiOn`,[`ui/system/on`],[`properties/ui`],function(ov,v){return v;},function(){this.setToUi()})]
        ,[new en(`uiOff`,[`ui/system/off`],[`properties/ui`],function(ov){return ov;},function(){this.removeFromUi()})]
        ,[new en(`usesMouseChange`,[`system/input`],[`properties/usesMouse`],undefined,function(){let chunk = this.chunk;if(!chunk)return;game.currentscene.moveElementToChunk(this,chunk);})]
    ]
}