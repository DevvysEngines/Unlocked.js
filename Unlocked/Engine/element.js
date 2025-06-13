import { game } from "./engine.js";
import { eventNode } from "./eventNode.js";
import { render } from "./render.js";
import { utils } from "./utils.js";

export class element{
    #nodeScopes = {
        "node": "insertNode"
        ,"eventNode": "insertEventNode"
    }
    #scopes = {
        "properties": ()=> this.#properties
        ,"renderer": ()=> this.#renderer
        ,"reactions": ()=> this.#reactions
        ,"reactionsList": ()=> this.#reactionsList
        ,"hitbox": ()=> this.#hitbox
        ,"nodes": ()=> this.#nodes
        ,"mouse": ()=> this.#mouse
    }
    isElement=true;
    isDestroyed=false;
    #nodes = new Map();
    #properties = {
        id:null
        ,chunk:{x:0,y:0}
    };
    #reactions={};
    #reactionsList = [];
    #renderer = {
        type:`box`
        ,width:30
        ,height:30
        ,radius:15
        ,roundedness:0
        ,color:[0,0,0]
        ,rotation:0
        ,transparency: 1
    };
    #hitbox = {
        type:`box`
        ,x:0
        ,y:0
        ,rotation:0
        ,width:30
        ,height:30
        ,radius:15
    }
    #mouse = {
        over:false
        ,down:false
        ,dragging:false
    };
    #vx=0;
    #vy=0;
    constructor(Name,x,y,renderer,hitbox,properties,...allNodes){
        this.Name = Name;
        this.x = x;
        this.y = y;
        Object.assign(this.#properties,properties);
        Object.assign(this.#renderer,renderer);
        Object.assign(this.#hitbox,hitbox)
        this.#properties.id = Symbol(Name);
        this.setup();

        if (allNodes.length>0){
            let setup = allNodes.pop();
            if (typeof setup != `function`){
                allNodes.push(setup);
                setup = false;
            }
            allNodes.forEach((node)=>{
                let scope = this.#nodeScopes[node[0].type];
                this[scope](...node);
            })
            if (setup){
                setup(this);
            }
        }

        this.insertMultipleNodes(...eventNode.system_presets.element);
    }
    get color(){
        return utils.giveColorWithTables(this.#renderer.color,this.#renderer.transparency);
    }
    get chunk(){
        return game.currentscene.giveChunk(this.#properties.chunk.x,this.#properties.chunk.y);
    }
    get id(){
        return this.#properties.id
    }
    get getInfo(){
        return {
            color: this.color
            ,id: this.id
            ,chunk: this.chunk
        }
    }
    get dime(){
        const camera = game.currentscene.camera;
        const tomappos = utils.tomap(this.x,this.y);
        const r = this.#renderer
        return {
            x: Math.round(tomappos.x)
            ,y: Math.round(tomappos.y)
            ,width:Math.round(r.width/camera.zoom)
            ,height:Math.round(r.height/camera.zoom)
            ,radius:Math.round(r.radius/camera.zoom)
        }
    }
    get hitboxDime(){
        let h = this.get(`hitbox`);
        return {
            x: this.x+h.x
            ,y: this.y+h.y
            ,type: h.type
            ,width: h.width
            ,height: h.height
            ,radius: h.radius
        }
    }
    ifover(x,y){
        let hd = this.hitboxDime;
        switch(hd.type){
            case `box`:
            if (
                x>hd.x-hd.width/2
                &&x<hd.x+hd.width
                &&y<hd.y+hd.height
                &&y>hd.y-hd.height
            ) return true;
        }
    }
    addVelocity(x,y){
        this.#vx+=x;
        this.#vy+=y;
    }
    changeVelocity(x,y){
        this.#vx=x;
        this.#vy=y;
    }
    changePosition(x,y){
        const chunk = game.currentscene.locateChunkByPos(x,y)
        if (!chunk)console.log(x,y)
        const chunkpos = {x:chunk.pos.x,y:chunk.pos.y};
        const mychunkpos = this.#properties.chunk;
        this.x = x;
        this.y = y;
        if (chunkpos.x!=mychunkpos.x||chunkpos.y!=mychunkpos.y){
            this.chunk.removeElement(this);
            chunk.addElement(this);
        }
    }
    render(ctx){
        if (this.isDestroyed)return;
        //ctx.beginPath();
        const dime = this.dime;
        ctx.save();
        ctx.translate(dime.x,dime.y);
        render[this.#renderer.type].render(ctx,this);
        //ctx.closePath();
        ctx.restore();
    }
    get(centeral,...path){
        centeral = this.#scopes[centeral]?.();
        let current = centeral;
        for (let i in path){
            if (current[path[i]]===undefined)return undefined;
            current = current[path[i]];
        }
        return current;
    }
    set(centeral,...path){
        let value = path.pop();
        let oldvalue;
        let centi = this.#scopes[centeral]?.();
        let current = centi;
        for (let i = 0; i<path.length-1; i++){
            if (!current[path[i]])current[path[i]] = {};
            current = current[path[i]];
        }
        oldvalue = current[path[path.length-1]];
        current[path[path.length-1]] = value;
        if (oldvalue==value)return;
        let eventpath = [...path];
        let events = this.get("reactions",centeral,...eventpath,"events");
        if (events){
            for (let e in events){
                let event = events[e];
                if (event.node.condition(oldvalue,value)){
                    event.node.trigger({element:this,key:event},[oldvalue,value],...event.info);
                    if (event.node.triggerTimes){
                        event.node.triggerTimes--;
                        if (event.node.triggerTimes<=0){
                            this.deleteEventNode(event);
                        }
                    }
                }
            }
        }
    }
    delete(centeral,...path){
        let centi = this.#scopes[centeral]?.();
        let current = centi;
        for (let i = 0; i<path.length-1; i++){
            if (current[path[i]]===undefined)return undefined;
            current = current[path[i]];
        }
        current[path[path.length-1]];
        delete current[path[path.length-1]];
    }
    system_set(centeral,...path){
        let value = path.pop();
        let oldvalue;
        let centi = this.#scopes[centeral]?.();
        let current = centi;
        for (let i = 0; i<path.length-1; i++){
            if (!current[path[i]])current[path[i]] = {};
            current = current[path[i]];
        }
        oldvalue = current[path[path.length-1]];
        current[path[path.length-1]] = value;
    }
    insertEventNode(node,...info){
        let renode = {
            node
            ,info: info??[]
            ,id: Symbol(`eventNode`)
        }
        let eventpath = [...node.path];
        eventpath.unshift("reactions")
        let eventanswer = this.get(...eventpath)
        if (!eventanswer){
            this.set(...eventpath,{events:[]});
            eventanswer = this.get(...eventpath);
        }
        let length = eventanswer.events.length
        renode.eventLocation = length;
        renode.listLocation = this.#reactionsList.length;
        eventpath.push(`events`)
        eventpath.push(length);
        renode.node.onApply({element:this,key:renode},...renode.info);
        this.set(...eventpath,renode);
        this.#reactionsList[renode.listLocation] = renode;
    }
    insertMultipleNodes(...allNodes){
        if (allNodes.length>0){
            allNodes.forEach((node)=>{
                let scope = this.#nodeScopes[node[0].type];
                this[scope](...node);
            })
        }
    }
    deleteEventNode(event){
        this.delete("reactions",...event.node.path,"events",event.eventLocation);
        delete this.#reactionsList[event.listLocation];
        event.node.onFinished({element:this,key:event},...event.info);
    }
    destroy(){
        this.isDestroyed=true
        this.customdestroy()
        game.removeElement(this);
        this.#nodes.forEach((node)=>{this.deleteNode(node)})
        
        for (let i in this){
            this[i] = undefined;
        }
        
        this.#vx = undefined;
        this.#vy = undefined;
        this.#properties = {};
        this.#renderer = {};
        this.#hitbox = {};
        //this.#reactions = {property:{}, renderer:{}};
    }
    insertNode(node,...data){
        let id = Symbol(`node`);
        let renode = {
            node
            ,data: data ?? []
            ,id
            ,active:true
        }
        let app = node.onApply({element:this,key:renode},...renode.data);
        if (app!=undefined){
            if (app){
               for (let i in app){
                renode[i] = app[i];
               }
            }
        }
        this.#nodes.set(id, renode);
    }
    deleteNode(node){
        node.node.onFinished({element:this,key:node},...node.data);
        this.#nodes.delete(node.id);
    }
    searchForEventNodeByName(Name=``){
        let results = [];
        this.#reactionsList.forEach((event)=>{
            if (event.node.Name==Name){
                results.push(event);
            }
        })
        return results;
    }
    searchForNodeByName(Name=``){
        let results = [];
        this.#nodes.forEach((node,key)=>{
            if (node.node.Name==Name){
                results.push(node);
            }
        })
        return results;
    }
    searchForNodeByTag(tag=``){
        let results = [];
        this.#nodes.forEach((node,key)=>{
            let has = false;
            node.node.tags.forEach((nodetag)=>{
                if (nodetag==tag)has=true;
            })
            if (has)results.push(node);
        })
        return results;
    }
    searchForEventNodeByTag(tag=``){
        let results = [];
        this.#reactionsList.forEach((event)=>{
            let has = false;
            event.node.tags.forEach((eventtag)=>{
                if (eventtag==tag)has=true;
            })
            if (has)results.push(event);
        })
        return results;
    }
    update(deltatime, delta){
        if (this.isDestroyed)return;
        this.customupdate(deltatime,delta);
        this.#nodes.forEach((node)=>{
            let da = node.node.update({element:this,key:node},delta,...node.data)
            if (da){
               for (let i in da){
                node[i] = da[i];
               }
            }
        });
    }
    setup(){};customdestroy(){};customupdate(){};
}