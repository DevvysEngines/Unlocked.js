import { game } from "../../engine.js";
import { utils } from "../../utils.js";

export function dHan(sCls){
    return class extends sCls{
        get dime(){
            const r = this.get(`renderer`);
            const p = this.get(`properties`);
            if (p.ui){
                return {
                    x: Math.round(p.x+r.x)
                    ,y: Math.round(p.y+r.y)
                    ,width: Math.round(r.width)
                    ,height: Math.round(r.width)
                    ,radius: Math.round(r.radius)
                    ,fontsize: r.fontsize
                    ,rotation: r.rotation
                }
            }
            const camera = game.currentscene.camera;
            const tomappos = utils.tomap(p.x+r.x,p.y+r.y);
            return {
                x: Math.round(tomappos.x)
                ,y: Math.round(tomappos.y)
                ,width:Math.round(r.width/camera.zoom)
                ,height:Math.round(r.height/camera.zoom)
                ,radius:Math.round(r.radius/camera.zoom)
                ,fontsize: r.fontsize/camera.zoom
                ,rotation: r.rotation
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
                ,rotation: h.rotation
            }
        }
    }
}