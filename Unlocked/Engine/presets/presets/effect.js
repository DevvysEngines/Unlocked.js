import { node } from "../../node.js";
import { utils } from "../../utils.js";

export let effect = class {
    node;
    constructor(Name,tags,onApply,update,onFinished){
        this.node = new node(Name,tags,onApply,update,onFinished);
        this.Name = this.node.Name;
        this.tags = this.node.tags;
        this.type = this.node.type;
    }
    onApply(time=1, ...info){
        time=utils.tosec(time)*1000/16.6666;
        let app = this.currentNode.node.node.onApply.call(this,...info);
        if (app){
            if (!app.info){app.info=[];}
            app.info.unshift(time);
            return app;
        };
        return {info:[time,...info]};
    }
    update(delta, time,...info){
        if (time<=0){
            this.remove();
            return;
        }
        time-=utils.tosec(1*delta);
        let upd = this.currentNode.node.node.update.call(this, delta, ...info);
        if (upd){
            if (!upd.info){upd.info=[];}
            upd.info.unshift(time);
            return upd;
        }
        return {info:[time,...info]};
    }
    onFinished(time,...info){
        let fin = this.currentNode.node.node.onFinished.call(this,...info);
        if (fin){
            if (!fin.info){fin.info=[]};
            fin.info.unshift(time);
            return fin;
        }
    }
}