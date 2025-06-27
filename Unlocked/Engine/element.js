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
        x:0
        ,y:0
        ,id:null
        ,chunk:{x:0,y:0}
        ,ui: false
        ,inUi: false
    };
    #reactions={};
    #reactionsList = [];
    #renderer = {
        type:`box`
        ,x:0
        ,y:0
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
    constructor(properties,renderer,hitbox,...allNodes){
        Object.assign(this.#properties,properties);
        Object.assign(this.#renderer,renderer);
        Object.assign(this.#hitbox,hitbox)
        this.#properties.id = Symbol();
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
    get Name(){
        return this.#properties.Name;
    }
    get x(){
        return this.#properties.x;
    }
    get y(){
        return this.#properties.y;
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
        const r = this.#renderer
        if (this.#properties.ui){
            return {
                x: Math.round(this.#properties.x+r.x)
                ,y: Math.round(this.#properties.y+r.y)
                ,width: Math.round(r.width)
                ,height: Math.round(r.width)
                ,radius: Math.round(r.radius)
            }
        }
        const camera = game.currentscene.camera;
        const tomappos = utils.tomap(this.#properties.x+r.x,this.#properties.y+r.y);
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
                &&x<hd.x+hd.width/2
                &&y<hd.y+hd.height/2
                &&y>hd.y-hd.height/2
            ) return true;
        }
    }
    render(ctx){
        if (this.isDestroyed)return;
        const dime = this.dime;
        ctx.save();
        ctx.translate(dime.x,dime.y);
        render[this.#renderer.type].render(ctx,this);
        ctx.restore();
    }
    get(...path){
        path = utils.normalizePath(path);
        let centeral = path.shift();
        let current = this.#scopes[centeral]?.();
        for (let i in path){
            if (current[path[i]]===undefined)return false;
            current = current[path[i]];
        }
        return current;
    }
    set(...path){
        let [value,oldvalue,centeral,...newpath] = this.system_set(...path);
        path = newpath;
        if (oldvalue==value)return;
        let events = this.get("reactions",centeral,...path,"events");
        if (!events)return;
        for (let e in events)
        {
            let event = events[e];
            if (!event.node.condition(oldvalue,value))continue;
            event.node.trigger({element:this,key:event},[oldvalue,value],...event.info);
            if (!event.node.triggerTimes)continue;
            event.node.triggerTimes--;
            if (event.node.triggerTimes>0)continue;
            this.deleteEventNode(event);
        }
    }
    delete(...path){
        path = utils.normalizePath(path);
        let centeral = path.shift();
        let current = this.#scopes[centeral]?.();
        for (let i = 0; i<path.length-1; i++){
            if (current[path[i]]===undefined)return false;
            current = current[path[i]];
        }
        current[path[path.length-1]];
        delete current[path[path.length-1]];
    }
    system_set(...path){
        let value = path.pop();
        let oldvalue;
        path = utils.normalizePath(path);
        let centeral = path.shift();
        let current = this.#scopes[centeral]?.();
        for (let i = 0; i<path.length-1; i++){
            if (!current[path[i]])current[path[i]] = {};
            current = current[path[i]];
        }
        oldvalue = current[path[path.length-1]];
        current[path[path.length-1]] = value;
        return [value, oldvalue, centeral, ...path];
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
                this[this.#nodeScopes[node[0].type]](...node);
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
        this.#properties = {};
        this.#renderer = {};
        this.#hitbox = {};
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
            Object.assign(renode, app);
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
    batchSet(...paths){
        paths.forEach((path)=>{
            this.set(...path)
        })
    }
    batchDelete(...paths){
        paths.forEach((path)=>{
            this.delete(...path)
        })
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
    setToUi(){
        if (this.#properties.inUi)return;
        this.set(`properties/inUi`,true);
        if (this.chunk) this.chunk.removeElement(this);
        game.currentscene.uiList.set(this.id,this);
    }
    removeFromUi(){
        if (!this.#properties.inUi)return;
        game.currentscene.uiList.delete(this.id);
        game.currentscene.addElement(this);
    }
    setup(){};customdestroy(){};customupdate(){};
}