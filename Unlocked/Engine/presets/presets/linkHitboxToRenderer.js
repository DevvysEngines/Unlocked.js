import { eventNode } from "../../events/eventNode.js";
import { utils } from "../../utils.js";
let en = eventNode;

let Links = {
    arc:
    [
        new en({
            path:[`renderer/radius`]
            ,tags:[`arc`]
            ,trigger:function([ov,v]){
                this.system_set(`hitbox/radius`,v);
            }
            ,onApply:function(){
                this.set(`hitbox/radius`,this.system_get([`renderer`,`radius`]));
            }
        })
    ]
    ,box:
    [
        new en({
            path:[`renderer/width`]
            ,tags:[`box`]
            ,trigger:function([ov,v]){
                this.set(`hitbox/width`,v);
            }
            ,onApply:function(){
                this.set(`hitbox/width`,this.system_get([`renderer`,`width`]));
            }
        })
        ,new en({
            path:[`renderer/height`]
            ,tags:[`box`]
            ,trigger:function([ov,v]){
                this.set(`hitbox/height`,v);
            }
            ,onApply:function(){
                this.set(`hitbox/height`,this.system_get([`renderer`,`height`]));
            }
        })
    ]
    ,txt:
    [
        new en({
            path:[`renderer/string`]
            ,tags:[`txt`]
            ,trigger:function([ov,v]){
                let rend = this.system_get([`renderer`]);
                let length = utils.measureText(v,rend);
                this.set(`hitbox/width`,length);
                this.set(`hitbox/height`,rend.fontsize);
            }
            ,onApply:function(){
                let rend = this.system_get([`renderer`]);
                let length = utils.measureText(rend.string,rend);
                this.set(`hitbox/width`,length);
                this.set(`hitbox/height`,rend.fontsize);
            }
        })
    ]
}

let Base = [
    new en({
        path:[`renderer/rotation`]
        ,trigger:function([ov,v]){
            this.set(`hitbox/rotation`,v);
        }
        ,onApply:function(){
            this.set(`hitbox/rotation`,this.system_get([`renderer`,`rotation`]));
        }
    })
    ,new en({
        path:[`renderer/x`]
        ,trigger:function([ov,v]){
            this.set(`hitbox/x`,v);
        }
        ,onApply:function(){
            this.set(`hitbox/x`,this.system_get([`renderer`,`x`]));
        }
    })
    ,new en({
        path:[`renderer/y`]
        ,trigger:function([ov,v]){
            this.set(`hitbox/y`,v);
        }
        ,onApply:function(){
            this.set(`hitbox/y`,this.system_get([`renderer`,`y`]));
        }
    })
]

export let linkHitboxToRenderer = 
[
    new en({
        path:[`renderer/type`]
        ,tags:[`linkHitboxToRenderer`]
        ,trigger:function([ov,v]){
            this.set(`hitbox/type`,v);
            this.remove(...this.anyNodeByTag(ov));
            this.add(...Links[v]);
        }
        ,onApply:function(){
            let rType = this.system_get([`renderer`,`type`]);
            this.set(`hitbox/type`,rType);
            this.add(...Base);
            this.add(
                ...Links[rType]
            )
        }
    })
]