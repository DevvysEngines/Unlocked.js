import { game } from "./engine.js";

export class utils{
    static aroundChunk(fn=()=>{},x,y,ts){
        const camera = game.currentscene.camera;
        x = x ?? camera.chunk.x;
        y = y ?? camera.chunk.y;
        ts = ts ?? camera.show;
        for (let i = ts.width; i>=-ts.width; i--){
            if (game.currentscene.ifChunk(x-i,y)){
                for (let v = ts.height; v>=-ts.height; v--){
                    if (game.currentscene.ifChunk(x-i,y-v)){
                        fn({
                            chunk: game.currentscene.giveChunk(x-i,y-v)
                            ,i
                            ,v
                            ,game
                        })
                    }
                }
            }
        }
    }
    static giveColorWithTables(color,transparency){
       return `${color[0]},${color[1]},${color[2]},${transparency}`;
    }
    static tosec(value){
        return (value/1000*60)
    }
    static tomap(x,y){
        const camera = game.currentscene.camera
        const window = game.window;
        return {
            x: (x-camera.x)/camera.zoom+window.width/2
            ,y: (y-camera.y)/camera.zoom+window.height/2
        };
    };
    static unmap(x,y){
        const camera = game.currentscene.camera;
        const window = game.window;
        return {
            x: (x)*camera.zoom-window.width/2*camera.zoom+camera.x
            ,y: (y)*camera.zoom-window.height/2*camera.zoom+camera.y
        }
    }
    static normalizePath(path){
        let newpath = [];
        path.forEach((newstr)=>{
            if (typeof newstr == `string`)
            {
                newstr = newstr.replaceAll(`.`, `/`);
                newstr = newstr.replaceAll(`[`, `/`);
                newstr = newstr.replaceAll(`]`, ``);
                newstr = newstr.split(`/`);
                newpath.push(...newstr);
            } else {
                newpath.push(newstr);
            }
        })
        return newpath;
    }
    static givefont(size=16,style=`sans-serif`,type=``){
        return (`${style} ${size}px ${type}`); // bold ${13/(game.hud ? 1:camera.zoom)}px sans-serif
    }
    static toradians(degrees){
        return (Math.PI/180)*degrees;
    }
    static distance(x1,y1,x2,y2){
        return (Math.sqrt(((x2-x1)*(x2-x1))+((y2-y1)*(y2-y1))));
    }
    static rotatepoint(x=0,y=0,rotation=0,xorigin=0,yorigin=0){
        rotation = utils.toradians(rotation);
        x-=xorigin;
        y-=yorigin;
        let newpos = {
            x: x*Math.cos(rotation)-y*Math.sin(rotation)
            ,y: x*Math.sin(rotation)+y*Math.cos(rotation)
        };
        newpos.x+=xorigin;
        newpos.y+=yorigin;
        return newpos;
    }
}