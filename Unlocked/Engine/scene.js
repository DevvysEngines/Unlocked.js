import { game } from "./engine.js";
import { chunk } from "./chunk.js";
import { camera } from "./camera.js";
import { utils } from "./utils.js";

export class scene{
    constructor(Name){
        this.Name = Name;
        this.game = game;
        this.chunks = new Map();
        this.uiList = new Map();
        this.chunkSize = 600;
        this.addCamera(new camera(this));
        for (let i = 0; i<30; i++){
            for (let v = 0; v<30; v++){
                this.insertChunk(i,v);
            }
        }
    }
    ifChunk(x,y){
        if (this.chunks.has(`${x},${y}`)){
            return true;
        }
    }
    giveChunk(x,y){
        if (this.ifChunk(x,y)){
            return this.chunks.get(`${x},${y}`);
        }
    }
    insertChunk(x,y){
        if (this.ifChunk(x,y))console.warn(`STOP MAKING CHUNKS IN ${x},${y}`)
        this.chunks.set(`${x},${y}`,new chunk(this,x,y))
    }
    locateChunkByPos(x,y){
        const newX = Math.floor(x/this.chunkSize);
        const newY = Math.floor(y/this.chunkSize);
        return this.giveChunk(newX,newY);
    }
    addElement(element){
        if (element.get(`properties/ui`)){
            element.setToUi();
            return;
        }
        const chunk = this.locateChunkByPos(element.x,element.y);
        if (!chunk)return;
        chunk.addElement(element);
    }
    removeElement(element){
        const chunk = element.chunk;
        chunk.removeElement(element);
    }
    addCamera(camera){
        this.camera = camera;
        camera.scene = this;
    }
    render(ctx){
        utils.aroundChunk((info)=>{
            info.chunk.render(ctx);
        })
    }
    update(deltatime){
        const delta = deltatime*60/1000;
        utils.aroundChunk((info)=>{
            info.chunk.update(deltatime, delta);
        })
    }
}