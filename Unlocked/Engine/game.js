import { Canvas } from "./canvas.js"
import { events } from "./events.js";
import { scene } from "./scene.js";
import { frame } from "./frame.js";

export class Game{
    constructor(){
        this.Canvas = new Canvas();
        this.canvas = this.Canvas.canvas
        this.ctx = this.Canvas.ctx;
        this.time = 0;

        this.mouse = {
            x: 0
            ,y: 0
            ,isover: false
        }

        this.scenes = {};
        this.allElements = new Map();

        this.window = {width:window.innerWidth,height:window.innerHeight};
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
        this.allElements.set(element.id, element);
        this.currentscene.addElement(element);
    }
    removeElement(element){
        this.allElements.delete(element.id);
        this.currentscene.removeElement(element);
    }
}