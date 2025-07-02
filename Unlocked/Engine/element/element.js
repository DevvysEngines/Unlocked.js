import {baseElement} from "./internal/baseElement.js";
import {nHan} from "./internal/nodeHandler.js";
import {nSea} from "./internal/nodeSearcher.js";
import {dHan} from "./internal/dimeHandler.js";

export class element extends dHan(nSea(nHan(baseElement))){
    constructor(properties,renderer,hitbox,...allNodes){
        super(properties,renderer,hitbox,...allNodes);
    }
}