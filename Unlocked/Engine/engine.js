import { Game } from "./game.js";
import { element } from "./element.js";
import { entity } from "./entity.js";
import { node } from "./node.js";
import { utils } from "./utils.js";
import { eventNode } from "./eventNode.js";
export let game = new Game()
game.begin();

let hoverlook = [
    [
        eventNode.mouse.Entered
        ,({element})=>{
            element.set(`renderer`,`transparency`,0.7)
        }
    ]
    ,[
        eventNode.mouse.Left
        ,({element})=>{
            element.set(`renderer`,`transparency`,1)
        }
    ]
]

let poison = new node.effect(
    `poison`
    ,[`damage`,`poison`,`custom`]
    ,undefined
    ,({element,key},delta,damage=5)=>{
        element.Damage(utils.tosec(damage)*delta,element);
        return [damage+1];
    }
)

game.johnny = new entity(`johnny`,50,50,{type:`box`,color:[255,0,0]},{},{},
    ...eventNode.linkHitboxToRenderer
    ,...hoverlook
    ,[poison,5]
    ,[
        eventNode.mouse.Up
        ,({element})=>{
            element.set(`properties`,`health`,500)
        }
    ]
    ,(element)=>{
        element.set(`properties`,`health`,500);
    }
)

game.addElement(
    game.johnny
);

let bob = new entity(`bob`,50,100,{},{},{});
bob.insertNode(poison,5);
bob.insertEventNode(eventNode.mouse.Up,({element})=>{element.set(`properties`,`health`,500)});
bob.set(`properties`,`health`,500);