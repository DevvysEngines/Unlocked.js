import { utils } from "./utils.js";

export class types{
    static box = {
        render: (ctx,dime)=>{
            ctx.roundRect(-dime.width/2,-dime.height/2,dime.width,dime.height,0)
            ctx.closePath();
        }
        ,ifover(x1,y1,hd){
            let {x,y} = utils.rotatepoint(x1,y1,hd.rotation,hd.x,hd.y);
            return (x>hd.x-hd.width/2&&x<hd.x+hd.width/2&&y<hd.y+hd.height/2&&y>hd.y-hd.height/2);
        }
    }
    static arc = {
        render: (ctx,dime)=>{
            ctx.arc(0,0,dime.radius,0,2*Math.PI);
            ctx.closePath();
        }
        ,ifover(x,y,hd){
            return utils.distance(x,y,hd.x,hd.y)<hd.radius;
        }
    }
    static txt = {
        render: (ctx,dime,renderer)=>{
            ctx.font = utils.givefont(dime.fontsize,renderer.fonttype,renderer.fontstyle)
            ctx.fillText(renderer.string, 0, dime.fontsize/4)
        }
        ,ifover(x,y,hd,hb,element){
            //x:hd.x,y:hd.y,width:element.textWidth,height:element.dime.fontsize
            return types[`box`].ifover(x,y,hd);
        }
    }
}