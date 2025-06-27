import { game } from "./engine.js";
import { utils } from "./utils.js";

export class chunk{
    constructor(scene,x,y){
        this.pos = {x,y};
        this.scene = scene;
        this.x = this.pos.x*this.scene.chunkSize;
        this.y = this.pos.y*this.scene.chunkSize;
        this.mouseElements = new Map();
        this.allElements = new Map();
        this.elements = new Map();
        this.renderChunk();
    }
    addElement(element){
        //console.log(`${element.Name} is joining chunk ${this.pos.x},${this.pos.y}.`)
        if (element.get(`properties/usesMouse`)){
            this.mouseElements.set(element.id, element);
        }
        element.set(`properties/chunk`,this.pos);
        const color = element.color;
        const id = element.id;
        this.allElements.set(id,element);
        let colormap;
        if (!this.elements.has(color)) this.elements.set(color,new Map());
        colormap = this.elements.get(color);
        if (colormap.has(id))console.warn(`WARNING`);
        colormap.set(id, element);
    }
    removeElement(element){
        //console.log(`${element.Name} is leaving chunk ${this.pos.x},${this.pos.y}.`)
        if (this.mouseElements.get(element.id)){
            this.mouseElements.delete(element.id);
        }
        element.set(`properties/chunk`,{x:-1,y:-1});
        const color = element.color;
        const id = element.id;
        this.allElements.delete(id);
        let colormap;
        if (!this.elements.has(color))return;
        colormap = this.elements.get(color);
        colormap.delete(id);
        if (colormap.size<=0){
            this.elements.delete(color);
        }
    }
    update(deltatime, delta){
        for (let [k,v] of this.allElements){
            v.update(deltatime, delta);
        }
    }
    render(ctx){
        //this.renderChunk(ctx);
        for (let [key,colormap] of this.elements){
            ctx.fillStyle = `rgb(${key})`;
            ctx.beginPath();
            for (let [colorkey,element] of this.elements.get(key)){
                element.render(ctx);
                ctx.closePath();
            }
            ctx.fill()
        }
    }
    renderChunk(ctx){
        /*const tomappos = utils.tomap(this.x,this.y);
        ctx.save();
        ctx.translate(tomappos.x,tomappos.y);
        ctx.fillRect(this.scene.chunkSize/2,this.scene.chunkSize/2,this.scene.chunkSize-5,this.scene.chunkSize-5)
        ctx.restore();
        */
    }
}