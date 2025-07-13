import { game } from "../../engine.js";

let nodeScopes = {
    "node": "insertNode"
    ,"eventNode": "insertEventNode"
}
let removeScopes = {
    node:`deleteNode`
    ,eventNode:`deleteEventNode`
}

function endisNode(element, id=``,type){
    id = typeof id == `string` ? id : id?.id;
    let node = element.anyNodeById(id)
    if (!node) return false;
    node.active = type;
    return true;
}

function enadisNodeBy(element,tag,ttype,type){
    let nodes = element[`anyNodeBy${ttype}`](tag);
    let endis = type ? `enable`:`disable`
    nodes.forEach((node)=>{
        element[`${endis}Node`](node.id);
    })
    return nodes.length;
}

function thisUsed(node,element,str){
    return (...args) => {
        element.system_set_currentNode(node);
        let call = node.node[str].call(element, ...args);
        element.system_remove_currentNode();
        return call;
    }
}

export function nHan(sCls){
    return class extends sCls{
        insertMultipleNodes(...allNodes){
            let results = [];
            if (allNodes.length>0){
                allNodes.forEach((node)=>{
                    results.push(this[nodeScopes[node[0].type]](...node));
                })
            }
            return results;
        }
        insertEventNode(node,...info){
            let element = this;
            let id = game.generateId();
            let renode = {
                node
                ,info: info ?? []
                ,id
                ,active: true
            }
            this.set(`reactions`,...node.path,`events/${id}`, renode);
            this.set(`reactionsList/${id}`, renode);
            let app = thisUsed(renode,this,`onApply`)(...renode.info);
            renode.checkNode = thisUsed(renode,this,`condition`);
            renode.runNode = thisUsed(renode,this,`trigger`);
            if (app!=undefined){
                Object.assign(renode, app);
            }
            return id;
        }
        insertNode(node,...info){
            let id = game.generateId();
            let renode = {
                node
                ,info: info ?? []
                ,id
                ,active:true
            }
            this.set(`nodes/${id}`, renode);
            let app = thisUsed(renode,this,`onApply`)(...renode.info);
            renode.runNode = thisUsed(renode,this,`update`);
            if (app!=undefined){
                Object.assign(renode, app);
            }
            return id;
            }
        do = this.insertNode.bind(this);
        add(...allNodes){
            let results = [];
            if (allNodes.length<=0)return
            allNodes.forEach((node)=>{
                let type = nodeScopes[node[0].type] || `on`;
                results.push(this[type](...node));
            })
            return results;
        }
        on(pathOrNode, nodeOrInfo, ...inf){
            let path, node, info;
            switch(typeof pathOrNode){
                case `string`:
                    let condition;
                    let cnode = nodeOrInfo;
                    if (typeof nodeOrInfo == `function`){
                        condition = nodeOrInfo;
                        cnode = inf.shift();
                    }
                    path = pathOrNode;
                    if (!Array.isArray(path))path=[path]
                    node = new game.eventNode(cnode.Name,cnode.tags,condition ? condition:cnode.condition,cnode.trigger,cnode.triggerTimes,cnode.onApply,cnode.onFinished);
                    info = inf ?? [];

                    break;
                default:
                    node = pathOrNode;
                    info = [nodeOrInfo,...inf];
                    break;
            }

            return this.insertEventNode(node,...info);
        }
        remove(id=this.currentNode){
            if (!id)return;
            if (typeof id==`string`)id=this.anyNodeById(id);
            this[removeScopes[id.node.type]](id);
        }
        deleteNode(node){
            thisUsed(node,this,`onFinished`)(...node.info);
            this.delete(`nodes/${node.id}`)
        }
        deleteEventNode(event){
            this.delete("reactions",...event.node.path,"events",event.id);
            this.delete(`reactionsList/${event.id}`);
            thisUsed(event,this,`onFinished`)(...event.info);
        }
        enable(id=``){
            return endisNode(this,id,true);
        }
        disable(id=this.currentNode){
            if (!id)return;
            return endisNode(this,id,false);
        }
        enableNodeByTag(tag=``){
            return enadisNodeBy(this,tag,`Tag`,true);
        }
        disableNodeByTag(tag=``){
            return enadisNodeBy(this,tag,`Tag`,false);
        }
        enableNodeByName(name=``){
            return enadisNodeBy(this,name,`Name`,true);
        }
        disableNodeByName(name=``){
            return enadisNodeBy(this,name,`Name`,false);
        }
    }
}