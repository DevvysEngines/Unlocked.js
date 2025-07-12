import { game } from "../engine.js";
import { utils } from "../utils.js";

export class events{
    constructor(){
        window.addEventListener(`resize`,events.resize);
        window.addEventListener(`keydown`,events.keyboard);
        window.addEventListener(`mousemove`,events.mousemove);
        window.addEventListener(`mousedown`,events.mousedown);
        window.addEventListener(`mouseup`,events.mouseup);
        window.addEventListener(`contextmenu`,events.preventRight);
    }
    static preventRight(event){
        event.preventDefault();
    }
    static resize(){
        game.canvas.width = game.window.width = window.innerWidth;
        game.window.height = game.canvas.height = window.innerHeight;
        game.ctx.textAlign = `center`;
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
        game.mouse.filteredX = info.x;
        game.mouse.filteredY = info.y;
        utils.aroundChunk((c_info)=>{
            Object.values(c_info.chunk.mouseElements).forEach((v)=>{
                if (v.ifover(info.x,info.y)){
                    v.set(`mouse/over`,true);
                    isover = true;
                } else if (v.get(`mouse/over`)==true){
                    v.set(`mouse/over`,false);
                }
            })
        })
        if (isover){
            document.body.style.cursor = `pointer`;
        } else {
            document.body.style.cursor = `default`;
        }
        game.mouse.isover = isover;
    }
    static mousedown(info){
        let lor = info.button == 0 ? `left`: info.button==1 ? `middle`:`right`;
        if (lor==`middle`)info.preventDefault();
        for (let [k,v] of game.currentscene.uiList){
            if (v.ifover(info.x,info.y)){
                v.set(`mouse/${lor}/down`,true);
                v.set(`mouse/${lor}/dragging`,true);
            }
        }
        info = utils.unmap(info.x,info.y);
        utils.aroundChunk((c_info)=>{
            Object.values(c_info.chunk.mouseElements).forEach((v)=>{
                if (v.ifover(info.x,info.y)){
                    v.set(`mouse/${lor}/down`,true);
                    v.set(`mouse/${lor}/dragging`,true);
                }
            })
        })
    }
    static mouseup(info){
        let lor = info.button == 0 ? `left`: info.button==1 ? `middle`:`right`;
        if (lor==`middle`)info.preventDefault();
        for (let [k,v] of game.currentscene.uiList){
            if (v.ifover(info.x,info.y)){
                if (v.ifover(info.x,info.y)&&v.get(`mouse/${lor}/down`)==true){
                    v.set(`mouse/${lor}/down`,false);
                    v.set(`mouse/${lor}/dragging`, false);
                } else if (v.get(`mouse/${lor}/down`)==true){
                    v.system_set([`mouse`,lor,`down`],false);
                    v.set(`mouse/${lor}/dragging`, false);
                }
            }
        }
        info = utils.unmap(info.x,info.y);
        utils.aroundChunk((c_info)=>{
            Object.values(c_info.chunk.mouseElements).forEach((v)=>{
                if (v.ifover(info.x,info.y)&&v.get(`mouse/${lor}/down`)==true){
                    v.set(`mouse/${lor}/down`,false);
                    v.set(`mouse/${lor}/dragging`, false);
                } else if (v.get(`mouse/${lor}/down`)==true){
                    v.system_set([`mouse`,lor,`down`],false);
                    v.set(`mouse/${lor}/dragging`, false);
                }
            })
        })
    }
}