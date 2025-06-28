import { utils } from "./utils.js";

export class types{
    static box = {
        render: (ctx,dime)=>{
            ctx.roundRect(-dime.width/2,-dime.height/2,dime.width,dime.height,0)
            ctx.closePath();
        }
        ,ifover(x,y,hd){
            return (x>hd.x-hd.width/2&&x<hd.x+hd.width/2&&y<hd.y+hd.height/2&&y>hd.y-hd.height/2);
        }
    }
    static arc = {
        render: (ctx,dime)=>{
            ctx.arc(0,0,dime.radius,0,360)
            ctx.closePath();
        }
        ,ifover(x,y,hd){
            return false;
        }
    }
    static txt = {
        render: (ctx,dime,renderer)=>{
            ctx.font = utils.givefont(dime.fontsize,renderer.fonttype,renderer.fontstyle)
            ctx.fillText(renderer.string, 0, dime.fontsize/4)
        }
        ,ifover(x,y,hd,hb,element){
            hd = JSON.parse(JSON.stringify(hd));
            hd.width = element.textWidth;
            hd.height = element.dime.fontsize;
            return types[`box`].ifover(x,y,hd);
        }
    }
}