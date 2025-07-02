import { game } from "../../engine.js";
import { eventNode } from "../../eventNode.js";
import { types } from "../../types.js";
import { utils } from "../../utils.js";

export class baseElement{
    #scopes = {
        "properties": {
            x:0
            ,y:0
            ,id:null
            ,chunk:{x:0,y:0}
            ,ui: false
            ,inUi: false
            ,Name: `No Name`
        }
        ,"renderer": {
            type:`box`
            ,x:0
            ,y:0
            ,width:30
            ,height:30
            ,radius:15
            ,string: `String`
            ,fonttype: `bold`
            ,fontstyle: `sans-serif`
            ,fontsize: 20
            ,roundedness:0
            ,color:[0,0,0]
            ,rotation:0
            ,transparency: 1
        }
        ,"reactions": {}
        ,"reactionsList": []
        ,"hitbox": {
            type:`box`
            ,x:0
            ,y:0
            ,rotation:0
            ,width:30
            ,height:30
            ,radius:15
        }
        ,"nodes": new Map()
        ,"mouse": {
            over:false
            ,down:false
            ,dragging:false
        }
    }
    isElement=true;
    isDestroyed=false;
    #internal_setup(){
        let r = this.#scopes[`renderer`];
        let p = this.#scopes[`properties`];
        let h = this.#scopes[`hitbox`];

        if (!types[r.type]){
            console.warn(`${r.type} is not a valid rendering type for '${this.Name}'.(SYSTEM WARNING)`)
            r.type = `box`;
        }
        if (!types[h.type]){
            console.warn(`${h.type} is not a valid hitbox type for '${this.Name}'.(SYSTEM WARNING)`)
            h.type = `box`;
        }
        if (r.type==`txt`){
            this.set(`renderer/width`,this.Width);
            this.set(`renderer/height`,this.dime.fontsize);
        }
    }
    get textWidth(){
        let dime = this.dime;
        let renderer = this.#scopes[`renderer`];
        game.ctx.font = utils.givefont(dime.fontsize,renderer.fonttype,renderer.fontstyle)
        return game.ctx.measureText(renderer.string).width*game.currentscene.camera.zoom
    }
    get Name(){
        return this.#scopes[`properties`].Name;
    }
    get x(){
        return this.#scopes[`properties`].x;
    }
    get y(){
        return this.#scopes[`properties`].y;
    }
    get color(){
        return utils.giveColorWithTables(this.#scopes[`renderer`].color,this.#scopes[`renderer`].transparency);
    }
    get chunk(){
        return game.currentscene.giveChunk(this.#scopes[`properties`].chunk.x,this.#scopes[`properties`].chunk.y);
    }
    get id(){
        return this.#scopes[`properties`].id
    }
    get getInfo(){
        return {
            color: this.color
            ,id: this.id
            ,chunk: this.chunk
        }
    }
    ifover(x,y){
        let hd = this.hitboxDime;
        return types[this.#scopes[`hitbox`].type].ifover(x,y,hd,this.#scopes[`hitbox`],this);
    }
    #setScope(scope,startingVal){
        if (this.#scopes[scope]){
            console.warn(`${scope} is already a scope for ${element.Name}.`);
            return;
        }
        this.#scopes[scope] =  startingVal;
    }
    render(ctx){
        if (this.isDestroyed)return;
        const dime = this.dime;
        ctx.save();
        ctx.translate(dime.x,dime.y);
        ctx.rotate(utils.toradians(dime.rotation));
        types[this.#scopes[`renderer`].type].render(ctx,dime,this.#scopes[`renderer`]);
        ctx.restore();
    }
    get(...path){
        path = utils.normalizePath(path);
        let centeral = path.shift();
        let current = this.#scopes[centeral]
        for (let i in path){
            if (current[path[i]]===undefined)return false;
            current = current[path[i]];
        }
        return current;
    }
    set(...path){
        let val = path.pop();
        path = utils.normalizePath(path);
        //console.log(`is a safe one`)
        let [value,oldvalue,centeral,...newpath] = this.system_set(path,val);
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
        let current = this.#scopes[centeral];
        if (!current)return;
        for (let i = 0; i<path.length-1; i++){
            if (current[path[i]]===undefined)return false;
            current = current[path[i]];
        }
        delete current[path[path.length-1]];
    }
    system_set(path,value){
        let oldvalue;
        path = [...path];
        let centeral = path.shift();
        let current = this.#scopes[centeral]
        if (!current){
            this.#setScope(centeral, value);
            current = this.#scopes[centeral];
            if (path.length<=0)return [value,undefined,centeral];
        }
        for (let i = 0; i<path.length-1; i++){
            if (!current[path[i]])current[path[i]] = {};
            current = current[path[i]];
        }
        oldvalue = current[path[path.length-1]];
        current[path[path.length-1]] = value;
        return [value, oldvalue, centeral, ...path];
    }
    destroy(){
        this.isDestroyed=true
        this.customdestroy()
        game.removeElement(this);
        this.#scopes[`nodes`].forEach((node)=>{this.deleteNode(node)})
        
        for (let i in this){
            this[i] = undefined;
        }
        this.#scopes[`properties`] = {};
        this.#scopes[`renderer`] = {};
        this.#scopes[`hitbox`] = {};
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
        this.#scopes[`nodes`].forEach((node)=>{
            let da = node.node.update({element:this,key:node},delta,...node.data)
            if (!da)return;
            for (let i in da)
            {
                node[i] = da[i];
            }
        });
    }
    setToUi(){
        if (this.#scopes[`properties`].inUi)return;
        this.set(`properties/inUi`,true);
        if (this.chunk) this.chunk.removeElement(this);
        game.currentscene.uiList.set(this.id,this);
    }
    removeFromUi(){
        if (!this.#scopes[`properties`].inUi)return;
        game.currentscene.uiList.delete(this.id);
        game.currentscene.addElement(this);
    }
    setup(){};customdestroy(){};customupdate(){};
    constructor(properties,renderer,hitbox,...allNodes){
        Object.assign(this.#scopes[`properties`],properties);
        Object.assign(this.#scopes[`renderer`],renderer);
        Object.assign(this.#scopes[`hitbox`],hitbox)
        this.#scopes[`properties`].id = Symbol();
        this.setup();
        
        let setup = (typeof allNodes[allNodes.length-1] == `function`) ? allNodes.pop() : false;
        this.insertMultipleNodes(...allNodes);
        if (setup)setup(this);

        this.insertMultipleNodes(...eventNode.system_presets.element);
        this.#internal_setup();
    }
}