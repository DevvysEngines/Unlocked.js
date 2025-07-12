export function nSea(sCls){
    return class extends sCls{
        searchForEventNodeByName(Name=``){
            let results = [];
            Object.values(this.get(`reactionsList`)).forEach((event)=>{
                if (event.node.Name==Name){
                    results.push(event);
                }
            })
            return results;
        }
        searchForNodeByName(Name=``){
            let results = [];
            Object.values(this.get(`nodes`)).forEach((node)=>{
                if (node.node.Name==Name){
                    results.push(node);
                }
            })
            return results;
        }
        searchForNodeByTag(tag=``){
            let results = [];
            Object.values(this.get(`nodes`)).forEach((node)=>{
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
            Object.values(this.get(`reactionsList`)).forEach((event)=>{
                let has = false;
                event.node.tags.forEach((eventtag)=>{
                    if (eventtag==tag)has=true;
                })
                if (has)results.push(event);
            })
            return results;
        }
        anyNodeById(id=``){
            return this.get(`reactionsList/${id}`) ?? this.get(`nodes/${id}`);
        }
        anyNodeByTag(tag=``){
            let results = [];
            Object.values(this.get(`reactionsList`)).forEach((event)=>{
                let has = false;
                event.node.tags.forEach((eventtag)=>{
                    if (eventtag==tag)has=true;
                })
                if (has)results.push(event);
            })
            Object.values(this.get(`nodes`)).forEach((node)=>{
                let has = false;
                node.node.tags.forEach((nodetag)=>{
                    if (nodetag==tag)has=true;
                })
                if (has)results.push(node);
            })
            return results;
        }
        anyNodeByName(Name=``){
            let results = [];
            Object.values(this.get(`reactionsList`)).forEach((event)=>{
                if (event.node.Name==Name){
                    results.push(event);
                }
            })
            Object.values(this.get(`nodes`)).forEach((node)=>{
                if (node.node.Name==Name){
                    results.push(node);
                }
            })
            return results;
        }
    }
}