export class eventNode{
    static system_presets = {
        colorChange: 
        new eventNode(`colorChange`,[`color`,`system`],[`renderer`,`color`],()=>{return true},({element,key},[ov,v],info)=>{
                let chunk = element.chunk;
                element.system_set("renderer","color",ov)
                chunk.removeElement(element);
                element.system_set("renderer","color",v);
                chunk.addElement(element);
        })
        ,rendererTypeChange: 
        new eventNode(`rendererTypeChange`,[`renderer`,`type`,`system`],[`renderer`,`type`],()=>{return true},({element,key},[ov,v],info)=>{
            let chunk = element.chunk;
            this.system_set("renderer","type",ov)
            chunk.removeElement(element);
            this.system_set("renderer","type",v)
            chunk.addElement(element);
        })
        ,usesMouseChange:
        new eventNode(`usesMouseChange`,[`system`],[`properties`,`usesMouse`],()=>{return true},({element,key},[ov,v])=>{
            let chunk = element.chunk;
            chunk.removeElement(element);
            chunk.addElement(element);
        })
    }
    static mouse = {
        Entered:
        new eventNode(`mouseEntered`,[`preset`,`mouse`,`entered`],[`mouse`,`over`],(ov,v)=>{if(v==true)return true;},(obj,v,...info)=>{
            let event = info.shift();
            event(obj,v,...info);
        },0,({element,key},...info)=>{
            element.set(`properties`,`usesMouse`,true);
        },({element,key},...info)=>{
            if (element.searchForEventNodeByTag([`mouse`]).length<=0){
                element.set(`properties`,`usesMouse`,false);
            }
        })
        ,Left:
        new eventNode(`mouseLeft`,[`preset`,`mouse`,`left`],[`mouse`,`over`],(ov,v)=>{if(v==false)return true;},(obj,v,...info)=>{
            let event = info.shift();
            event(obj,v,...info);
        },0,({element,key},...info)=>{
            element.set(`properties`,`usesMouse`,true);
        },({element,key},...info)=>{
            if (element.searchForEventNodeByTag([`mouse`]).length<=0){
                element.set(`properties`,`usesMouse`,false);
            }
        })
        ,Down:
        new eventNode(`mouseDown`,[`preset`,`mouse`,`down`],[`mouse`,`down`],(ov,v)=>{if(v==true)return true;},(obj,v,...info)=>{
            let event = info.shift();
            event(obj,v,...info);
        },0,({element,key},...info)=>{
            element.set(`properties`,`usesMouse`,true);
        },({element,key},...info)=>{
            if (element.searchForEventNodeByTag([`mouse`]).length<=0){
                element.set(`properties`,`usesMouse`,false);
            }
        })
        ,Up:
        new eventNode(`mouseUp`,[`preset`,`mouse`,`up`],[`mouse`,`down`],(ov,v)=>{if(v==false)return true;},(obj,v,...info)=>{
            let event = info.shift();
            event(obj,v,...info);
        },0,({element,key},...info)=>{
            element.set(`properties`,`usesMouse`,true);
        },({element,key},...info)=>{
            if (element.searchForEventNodeByTag([`mouse`]).length<=0){
                element.set(`properties`,`usesMouse`,false);
            }
        })
    }
    constructor(Name=`eventNode`,tags=[],path=["properties","health"],condition=(ov,v)=>{return true;},trigger=()=>{},triggerTimes=false,onApply=()=>{},onFinished=()=>{}){
        this.Name = Name;
        this.tags = tags;
        this.path = path;
        this.condition = condition;
        this.trigger = trigger;
        this.triggerTimes = triggerTimes;
        this.onApply = onApply;
        this.onFinished = onFinished;
    }   
}