let nodeScopes = {
    "node": "insertNode"
    ,"eventNode": "insertEventNode"
}

export function nHan(sCls){
    return class extends sCls{
        insertMultipleNodes(...allNodes){
            if (allNodes.length>0){
                allNodes.forEach((node)=>{
                    this[nodeScopes[node[0].type]](...node);
                })
            }
        }
        insertEventNode(node,...info){
            let renode = {
                node
                ,info: info??[]
                ,id: Symbol(`eventNode`)
            }
            let eventpath = [...node.path];
            eventpath.unshift("reactions")
            let eventanswer = this.get(...eventpath)
            if (!eventanswer){
                this.set(...eventpath,{events:[]});
                eventanswer = this.get(...eventpath);
            }
            let length = eventanswer.events.length
            renode.listLocation = this.get(`reactionsList`).length;
            eventpath.push(`events`)
            eventpath.push(length);
            renode.eventLocation = length;
            this.set(...eventpath,renode);
            this.set(`reactionsList/${renode.listLocation}`,renode);
            renode.node.onApply({element:this,key:renode},...renode.info);
        }
        insertNode(node,...data){
            let id = Symbol(`node`);
            let renode = {
                node
                ,data: data ?? []
                ,id
                ,active:true
            }
            let app = node.onApply({element:this,key:renode},...renode.data);
            if (app!=undefined){
                Object.assign(renode, app);
            }
            this.get(`nodes`).set(id, renode);
        }
        deleteNode(node){
            node.node.onFinished({element:this,key:node},...node.data);
            this.get(`nodes`).delete(node.id);
        }
        deleteEventNode(event){
            this.delete("reactions",...event.node.path,"events",event.eventLocation);
            this.delete(`reactionsList/${event.listLocation}`);
            event.node.onFinished({element:this,key:event},...event.info);
        }
    }
}