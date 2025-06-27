import { utils } from "./utils.js";

export class eventNode{
    static system_presets = {
        element: [
            [
                new eventNode(`xPositionChange`,[`position/system/x`],[`properties/x`],undefined,({element,key},[ov,v],info)=>{
                    if (!element.chunk)return;
                    const chunk = game.currentscene.locateChunkByPos(v,element.y)
                    if (!chunk)return;
                    const chunkpos = {x:chunk.pos.x,y:chunk.pos.y};
                    const mychunkpos = element.get(`properties/chunk`);
                    if (chunkpos.x!=mychunkpos.x||chunkpos.y!=mychunkpos.y){
                        element.chunk.removeElement(element);
                        chunk.addElement(element);
                    }
                })
            ]
            ,[
                new eventNode(`yPositionChange`,[`position/system/y`],[`properties/y`],undefined,({element,key},[ov,v],info)=>{
                    if (!element.chunk)return;
                    const chunk = game.currentscene.locateChunkByPos(element.x,v)
                    if (!chunk)return;
                    const chunkpos = {x:chunk.pos.x,y:chunk.pos.y};
                    const mychunkpos = element.get(`properties/chunk`);
                    if (chunkpos.x!=mychunkpos.x||chunkpos.y!=mychunkpos.y){
                        element.chunk.removeElement(element);
                        chunk.addElement(element);
                    }
                })
            ]
            ,[
                new eventNode(`uiTurnedOn`,[`ui/system/change/on`],[`properties/ui`],(ov,v)=>{if(v)return true;},({element,key},[ov,v],info)=>{
                    element.setToUi();
                })
            ]
            ,[
                new eventNode(`uiTurnedOff`,[`ui/system/change/off`],[`properties/ui`],(ov,v)=>{if(!v)return true;},({element,key},[ov,v],info)=>{
                    element.removeFromUi();
                })
            ]
            ,[
                new eventNode(`colorChange`,[`color/system`],[`renderer/color`],()=>{return true},({element,key},[ov,v],info)=>{
                        let chunk = element.chunk;
                        if (!chunk)return;
                        element.system_set("renderer/color",ov)
                        chunk.removeElement(element);
                        element.system_set("renderer/color",v);
                        chunk.addElement(element);
                })
            ]
            ,[
                new eventNode(`transparencyChange`,[`transparency/system`],[`renderer/transparency`],()=>{return true},({element,key},[ov,v],info)=>{
                        let chunk = element.chunk;
                        if (!chunk)return;
                        element.system_set("renderer/transparency",ov)
                        chunk.removeElement(element);
                        element.system_set("renderer/transparency",v);
                        chunk.addElement(element);
                })
            ]
            ,[
                new eventNode(`rendererTypeChange`,[`renderer/type/system`],[`renderer/type`],()=>{return true},({element,key},[ov,v],info)=>{
                    let chunk = element.chunk;
                    if (!chunk)return;
                    element.system_set("renderer/type",ov)
                    chunk.removeElement(element);
                    element.system_set("renderer/type",v)
                    chunk.addElement(element);
                })
            ]
            ,[
                new eventNode(`usesMouseChange`,[`system`],[`properties/usesMouse`],()=>{return true},({element,key},[ov,v])=>{
                    let chunk = element.chunk;
                    if (!chunk)return;
                    chunk.removeElement(element);
                    chunk.addElement(element);
                })
            ]
        ]
    }
    static mouse = {
        Entered:
        new eventNode(`mouseEntered`,[`preset/mouse/entered`],[`mouse/over`],(ov,v)=>{if(v==true)return true;},(obj,v,...info)=>{
            info.length<=0?info.push(()=>{}):info;
            let event = info.shift();
            event(obj,v,...info);
        },0,({element,key},...info)=>{
            element.set(`properties/usesMouse`,true);
        },({element,key},...info)=>{
            if (element.searchForEventNodeByTag([`mouse`]).length<=0){
                element.set(`properties/usesMouse`,false);
            }
        })
        ,Left:
        new eventNode(`mouseLeft`,[`preset/mouse/left`],[`mouse/over`],(ov,v)=>{if(v==false)return true;},(obj,v,...info)=>{
            info.length<=0?info.push(()=>{}):info;
            let event = info.shift();
            event(obj,v,...info);
        },0,({element,key},...info)=>{
            element.set(`properties/usesMouse`,true);
        },({element,key},...info)=>{
            if (element.searchForEventNodeByTag([`mouse`]).length<=0){
                element.set(`properties/usesMouse`,false);
            }
        })
        ,Down:
        new eventNode(`mouseDown`,[`preset/mouse/down`],[`mouse/down`],(ov,v)=>{if(v==true)return true;},(obj,v,...info)=>{
            info.length<=0?info.push(()=>{}):info;
            let event = info.shift();
            event(obj,v,...info);
        },0,({element,key},...info)=>{
            element.set(`properties/usesMouse`,true);
        },({element,key},...info)=>{
            if (element.searchForEventNodeByTag([`mouse`]).length<=0){
                element.set(`properties/usesMouse`,false);
            }
        })
        ,Up:
        new eventNode(`mouseUp`,[`preset/mouse/up`],[`mouse/down`],(ov,v)=>{if(v==false)return true;},(obj,v,...info)=>{
            info.length<=0?info.push(()=>{}):info;
            let event = info.shift();
            event(obj,v,...info);
        },0,({element,key},...info)=>{
            element.set(`properties/usesMouse`,true);
        },({element,key},...info)=>{
            if (element.searchForEventNodeByTag([`mouse`]).length<=0){
                element.set(`properties/usesMouse`,false);
            }
        })
    }
    static linkHitboxToRenderer = [
        [
            new eventNode(`rendererTypeChange`,[`preset/link/renderer/type`],[`renderer/type`],undefined,({element,key},[ov,v],info)=>{
                element.set(`hitbox/type`,v);
            },false,({element})=>{
                element.set(`hitbox/type`,element.get(`renderer/type`))
            })
        ]
        ,[
            new eventNode(`rendererWidthChange`,[`preset/link/renderer/width`],[`renderer/width`],undefined,({element,key},[ov,v],info)=>{
                element.set(`hitbox/width`,v);
            },false,({element})=>{
                element.set(`hitbox/width`,element.get(`renderer/width`))
            })
        ]
        ,[
            new eventNode(`rendererHeightChange`,[`preset/link/renderer/height`],[`renderer/height`],undefined,({element,key},[ov,v],info)=>{
                element.set(`hitbox/height`,v);
            },false,({element})=>{
                element.set(`hitbox/height`,element.get(`renderer/height`))
            })
        ]
        ,[
            new eventNode(`rendererRadiusChange`,[`preset/link/renderer/radius`],[`renderer/radius`],undefined,({element,key},[ov,v],info)=>{
                element.set(`hitbox/radius`,v);
            },false,({element})=>{
                element.set(`hitbox/radius`,element.get(`renderer/radius`))
            })
        ]
        ,[
            new eventNode(`rendererRotationChange`,[`preset/link/renderer/rotation`],[`renderer/rotation`],undefined,({element,key},[ov,v],info)=>{
                element.set(`hitbox/rotation`,v);
            },false,({element})=>{
                element.set(`hitbox/rotation`,element.get(`renderer/rotation`))
            })
        ]
        ,[
            new eventNode(`hitboxXChange`,[`preset/link/hitbox/position/x`],[`hitbox/x`],undefined,({element,key},[ov,v],info)=>{
                element.system_set(`hitbox/x`,0);
            },false,({element})=>{
                element.system_set(`hitbox/x`,0);
            })
        ]
        ,[
            new eventNode(`hitboxYChange`,[`preset/link/hitbox/position/y`],[`hitbox/y`],undefined,({element,key},[ov,v],info)=>{
                element.system_set(`hitbox/y`,0);
            },false,({element})=>{
                element.system_set(`hitbox/y`,0);
            })
        ]
    ]
    constructor(Name=`eventNode`,tags=[],path=["properties/health"],condition=(ov,v)=>{return true;},trigger=()=>{},triggerTimes=false,onApply=()=>{},onFinished=()=>{}){
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