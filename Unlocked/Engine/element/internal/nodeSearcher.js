export function nSea(sCls){
    return class extends sCls{
        searchForEventNodeByName(Name=``){
            let results = [];
            this.get(`reactionsList`).forEach((event)=>{
                if (event.node.Name==Name){
                    results.push(event);
                }
            })
            return results;
        }
        searchForNodeByName(Name=``){
            let results = [];
            this.get(`nodes`).forEach((node,key)=>{
                if (node.node.Name==Name){
                    results.push(node);
                }
            })
            return results;
        }
        searchForNodeByTag(tag=``){
            let results = [];
            this.get(`nodes`).forEach((node,key)=>{
                let has = false;
                node.node.tags.forEach((nodetag)=>{
                    if (nodetag==tag)has=true;
                })
                if (has)results.push(node);
            })
            return results;
        }
        searchForEventNodeByTag(tag=``){
            let results = [];
            this.get(`reactionsList`).forEach((event)=>{
                let has = false;
                event.node.tags.forEach((eventtag)=>{
                    if (eventtag==tag)has=true;
                })
                if (has)results.push(event);
            })
            return results;
        }
    }
}