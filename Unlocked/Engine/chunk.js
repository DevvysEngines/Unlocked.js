import { game } from "./engine.js";
import { utils } from "./utils.js";

export class chunk{
    constructor(scene,x,y){
        
        this.pos = {x,y};
        this.scene = scene;
        this.x = this.pos.x*this.scene.chunkSize;
        this.y = this.pos.y*this.scene.chunkSize;
        this.mouseElements = {};
        this.allElements = {};
        this.elements = {};
        this.renderChunk();
    }
    addElement(element){
        //console.log(`${element.Name} is joining chunk ${this.pos.x},${this.pos.y}.`)
        if (element.get(`properties/usesMouse`)){
            this.mouseElements[element.id] = element;
        }
        element.set(`properties/chunk`,this.pos);
        const color = element.color;
        const id = element.id;
        this.allElements[id] = element;
        let colormap;
        if (!this.elements[color]) this.elements[color] = {};
        colormap = this.elements[color];
        if (colormap[id])console.warn(`WARNING`);
        colormap[id] = element;
    }
    removeElement(element){
        //console.log(`${element.Name} is leaving chunk ${this.pos.x},${this.pos.y}.`)
        if (this.mouseElements[element.id]){
            delete this.mouseElements[element.id];
        }
        element.set(`properties/chunk`,{x:-1,y:-1});
        const color = element.color;
        const id = element.id;
        delete this.allElements[id];
        let colormap;
        if (!this.elements[color])return;
        colormap = this.elements[color];
        delete colormap[id];
        if (Object.keys(colormap).length<=0){
            delete this.elements[color];
        }
    }
    update(deltatime, delta){
        Object.values(this.allElements).forEach((key)=>{
            key.update(deltatime, delta);
        })
    }
    render(ctx){
        //this.renderChunk(ctx);
        Object.keys(this.elements).forEach((key)=>{
            ctx.fillStyle = `rgb(${key})`;
            ctx.beginPath();
            Object.values(this.elements[key]).forEach((element)=>{
                element.render(ctx);
                ctx.closePath();
            })
            ctx.fill()
        })
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