import { Canvas } from "./canvas.js"
import { events } from "./events/events.js";
import { scene } from "./scene.js";
import { frame } from "./frame.js";
import { element } from "./element/element.js";
import { entity } from "./entity.js";
import { eventNode } from "./events/eventNode.js";
import { presets } from "./presets/presets.js";
import { node } from "./node.js";
import { utils } from "./utils.js";

export class Game{
    idList = {};
    Canvas = new Canvas();
    canvas = this.Canvas.canvas
    ctx = this.Canvas.ctx;
    time = 0;
    eventNode = eventNode;
    node = node;
    presets = presets;
    utils = utils;
    mouse = {
        x: 0
        ,y: 0
        ,filteredX: 0
        ,filteredY: 0
        ,isover: false
    }
    scenes = {};
    allElements = {};
    window = {width:window.innerWidth,height:window.innerHeight};
    constructor(){
        let game = this;
        this.element = class extends element{
            constructor(properties,renderer,hitbox,...allNodes){
                super(properties,renderer,hitbox,...allNodes);
                game.addElement(this);
            }
        }
        this.entity = class extends entity{
            constructor(properties,renderer,hitbox,...allNodes){
                super(properties,renderer,hitbox,...allNodes);
                game.addElement(this);
            }
        }
    }
    generateId = function(length = 28){
        const chars = `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-=+_|!@#$%^&*()<>`;
        let result = ``;
        for (let i=0; i<length-4; i++){
            result+=chars.charAt(Math.floor(Math.random()*chars.length));
        }
        if (this.idList[result]){
            console.log(`Damn lucky day! `, result);
            result = this.generateId(length);
        }
        let gen = Math.floor(Math.random()*(result.length+1));
        result = result.slice(0, gen) + 'gen-' + result.slice(gen);
        this.idList[result] = true;
        return result;
    }
    begin(){
        this.events = new events(this);
        this.addScene(`Main`);
        frame();
    }
    addScene(Name){
        if (this.scenes[Name])console.warn(`STOP PUTTING SCENES WITH THE NAME ${Name}!!!`);
        this.currentscene = new scene(Name);
        this.scenes[Name] = this.currentscene;
    }
    callScene(Name){
        if (!this.scenes[Name]){
            console.warn(`NO SCENE WITH THE NAME ${Name}!!!`);
            return;
        }
        this.currentscene = this.scenes[Name];
    }
    addElement(element){
        this.allElements[element.id] =  element;
        this.currentscene.addElement(element);
    }
    removeElement(element){
        delete this.allElements[element.id];
        this.currentscene.removeElement(element);
    }
}