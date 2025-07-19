import { game } from "../../engine.js";

let nodeScopes = {
    "node": "insertNode"
    ,"eventNode": "insertEventNode"
}
let newNodeScopes ={
    node:`do`
    ,eventNode:`on`
}
let removeScopes = {
    node:`deleteNode`
    ,eventNode:`deleteEventNode`
}

function idCheck(id, element){
    if (typeof id == `string`)return element.anyNodeById(id);
    return id;
}

function nodeCheck(element,...allNodes){
    if (allNodes.length==0||allNodes==undefined){if(element.currentNode)return [element.currentNode,...element.linked]; else return;} else return allNodes;
}

function warnCtx(fn){
    console.warn(`NO CONTEXT FOUND. Please provide more information in the ${fn} call.`)
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
        do(node,...info){
            return this.insertNode(node,...info);
        }
        add(...allNodes){
            let results = [];
            if (allNodes.length<=0)return
            allNodes.forEach((node)=>{
                if (!Array.isArray(node))node = [node];
                let type = newNodeScopes[node[0].type]
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
        remove(...allNodes){
            allNodes = nodeCheck(this,...allNodes);
            if (!allNodes){warnCtx(`remove`);return;};
            allNodes.forEach((id)=>{
                id = idCheck(id,this);
                this[removeScopes[id.node.type]](id);
            })
        }
        deleteNode(node){
            thisUsed(node,this,`onFinished`)(...node.info);
            this.unlink(...Object.keys(node.linked))
            this.delete(`nodes/${node.id}`)
        }
        deleteEventNode(event){
            thisUsed(event,this,`onFinished`)(...event.info);
            this.unlink(...Object.keys(event.linked));
            this.delete("reactions",...event.node.path,"events",event.id);
            this.delete(`reactionsList/${event.id}`);
        }
        enable(...allNodes){
            allNodes = nodeCheck(this,...allNodes);
            if (!allNodes){warnCtx(`enable`);return;};
            let results = [];
            allNodes.forEach((id)=>{
                results.push(endisNode(this,idCheck(id,this),true));
            })
            return results;
        }
        disable(...allNodes){
            allNodes = nodeCheck(this,...allNodes);
            if (!allNodes){warnCtx(`disable`);return;};
            let results = [];
            allNodes.forEach((id)=>{
                results.push(endisNode(this,idCheck(id,this),false));
            })
            return results;
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
        link(...allNodes){
            allNodes = allNodes.map((node)=>{return idCheck(node,this)});
            if (allNodes.length==1){if (this.currentNode){allNodes.push(this.currentNode)}else{console.warn(`NO CONTEXT FOUND. Please provide a target node at the end of a link call.`);return;}};
            let target = allNodes.pop();
            let tid = target.id;
            if (!this.anyNodeById(tid)){console.warn(`Please provide a target node that has already been ADDED to the element.`);return;};
            if (!target.linked)target.linked={};
            allNodes.forEach((node)=>{
                let id = node.id
                if (!this.anyNodeById(id))return;
                if (!node.linked)node.linked={};
                if (target.linked[id]||node.linked[tid])return;
                target.linked[id] = true;
                node.linked[tid] = true;
            })
        }
        unlink(...allNodes){
            allNodes = allNodes.map((node)=>{return idCheck(node,this)});
            if (allNodes.length==1){if (this.currentNode){allNodes.push(this.currentNode)}else{console.warn(`NO CONTEXT FOUND. Please provide a target node at the end of an unlink call.`);return;}};
            let target = allNodes.pop();
            let tid = target.id;
            if (!target.linked)return;
            if (!this.anyNodeById(tid)){console.warn(`Please provide a target node that has already been ADDED to the element.`);return;};
            allNodes.forEach((node)=>{
                let id = node.id
                if (!target.linked)return;
                if (!this.anyNodeById(id))return;
                if (!target.linked[id]&&!node.linked[tid])return;
                delete target.linked[id];
                delete node.linked[tid];
            })
        }
    }
}