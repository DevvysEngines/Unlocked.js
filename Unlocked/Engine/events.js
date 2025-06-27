import { game } from "./engine.js";
import { utils } from "./utils.js";

export class events{
    constructor(){
        window.addEventListener(`resize`,events.resize);
        window.addEventListener(`keydown`,events.keyboard);
        window.addEventListener(`mousemove`,events.mousemove);
        window.addEventListener(`mousedown`,events.mousedown);
        window.addEventListener(`mouseup`,events.mouseup);
    }
    static resize(){
        game.canvas.width = game.window.width = window.innerWidth;
        game.window.height = game.canvas.height = window.innerHeight;
    };
    static keyboard(info){
        switch(info.key){
            case `w`:
                game.currentscene.camera.y-=5;
                break;
            case `a`:
                game.currentscene.camera.x-=5;
                break;
            case `s`:
                game.currentscene.camera.y+=5;
                break;
            case `d`:
                game.currentscene.camera.x+=5;
                break;
            case `e`:
                game.currentscene.camera.zoom+=1/4;
                break;
            case `q`:
                game.currentscene.camera.zoom-=1/4;
                break;
        }
        events.mousemove();
    }
    static mousemove(info=game.mouse){
        game.mouse.x = info.x;
        game.mouse.y = info.y;
        let isover = false;
        for (let [k,v] of game.currentscene.uiList){
            if (v.ifover(info.x,info.y)){
                v.set(`mouse/over`,true);
                isover = true;
            } else if (v.get(`mouse/over`)==true){
                v.set(`mouse/over`,false);
            }
        }
        info = utils.unmap(info.x,info.y);
        utils.aroundChunk((c_info)=>{
            for (let [i,v] of c_info.chunk.mouseElements){
                if (v.ifover(info.x,info.y)){
                    v.set(`mouse/over`,true);
                    isover = true;
                } else if (v.get(`mouse/over`)==true){
                    v.set(`mouse/over`,false);
                }
            }
        })
        if (isover){
            document.body.style.cursor = `pointer`;
        } else {
            document.body.style.cursor = `default`;
        }
        game.mouse.isover = isover;
    }
    static mousedown(info){
        for (let [k,v] of game.currentscene.uiList){
            if (v.ifover(info.x,info.y)){
                v.set(`mouse/down`,true);
            }
        }
        info = utils.unmap(info.x,info.y);
        utils.aroundChunk((c_info)=>{
            for (let [i,v] of c_info.chunk.mouseElements){
                if (v.ifover(info.x,info.y)){
                    v.set(`mouse/down`,true);
                }
            }
        })
    }
    static mouseup(info){
        for (let [k,v] of game.currentscene.uiList){
            if (v.ifover(info.x,info.y)){
                if (v.ifover(info.x,info.y)&&v.get(`mouse/down`)==true){
                    v.set(`mouse/down`,false);
                } else if (v.get(`mouse/down`)==true){
                    v.system_set(`mouse/down`,false);
                }
            }
        }
        info = utils.unmap(info.x,info.y);
        utils.aroundChunk((c_info)=>{
            for (let [i,v] of c_info.chunk.mouseElements){
                if (v.ifover(info.x,info.y)&&v.get(`mouse/down`)==true){
                    v.set(`mouse/down`,false);
                } else if (v.get(`mouse/down`)==true){
                    v.system_set(`mouse/down`,false);
                }
            }
        })
    }
}