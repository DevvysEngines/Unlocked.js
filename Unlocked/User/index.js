import { game } from "../Engine/engine.js";
import { entity } from "../Engine/entity.js";
import { eventNode } from "../Engine/eventNode.js";
import { node } from "../Engine/node.js";
import { utils } from "../Engine/utils.js";

window.game = game; // for debugging purposes, delete once publishing

// NODE EXAMPLES(NORMAL NODES)
let poison = new node.effect(
    `poison`
    ,[`damage`,`poison`,`custom`]
    ,undefined
    ,({element,key},delta,damage=5)=>{
        element.Damage(utils.tosec(damage)*delta,element);
        return [damage+1];
    }
)

// NODE EXAMPLES(EVENTNODES)
let hoverTransparency = [
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

// BASIC ELEMENT CREATION
let bob = new entity(`bob`,50,100,{},{},{});
bob.insertNode(poison,5);
bob.insertEventNode(eventNode.mouse.Up,({element})=>{element.set(`properties`,`health`,500)});
bob.insertMultipleNodes(...hoverTransparency,...eventNode.linkHitboxToRenderer);
bob.set(`properties`,`health`,500);

// ADVANCED ELEMENT CREATION
game.addElement(
    game.johnny = new entity(
        `johnny` // Name
        ,50 // x coordinate
        ,50 // y coordinate
        ,{type:`box`,color:[255,0,0]} // Renderer properties
        ,{} // Hitbox properties
        ,{} // Normal properties
        ,...eventNode.linkHitboxToRenderer // Event Node preset(makes hitbox = renderer).
        ,...hoverTransparency // Custom Mouse Mouse Event Nodes(Makes the entity more transparent when hovered over with the mouse)
        ,[poison,5] // makes the enemy suffer damage for 5 seconds, that increases exponentially
        ,[
            eventNode.mouse.Up
            ,({element})=>{
                element.set(`properties`,`health`,500) // sets the element's health to 500 which clicked
            }
        ]
        ,(element)=>{
            element.set(`properties`,`health`,500); // sets the element's health to 500 when added.
        }
    )
)