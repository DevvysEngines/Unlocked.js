import { game } from "../Engine/engine.js";
import { entity } from "../Engine/entity.js";
import { eventNode } from "../Engine/eventNode.js";
import { node } from "../Engine/node.js";
import { utils } from "../Engine/utils.js";

window.game = game; // for debugging purposes, delete once publishing

// NODE EXAMPLES(NORMAL NODES)
let poison = new node.effect(
    `poison`
    ,[`damage/poison/custom`]
    ,undefined
    ,({element,key},delta,damage=5)=>{
        element.Damage(utils.tosec(damage)*delta,element);
        return [damage+1];
    }
)

// NODE EXAMPLES(EVENTNODES) (USING A PRESET)
let hoverTransparency = [
    [
        eventNode.mouse.Entered
        ,({element})=>{
            element.set(`renderer/transparency`,0.7)
        }
    ]
    ,[
        eventNode.mouse.Left
        ,({element})=>{
            element.set(`renderer/transparency`,1)
        }
    ]
]

// BASIC ELEMENT CREATION
let bob = new entity(
    {x:100,y:100,Name:`bob`}
    ,{}
    ,{}
);
bob.insertMultipleNodes(
    [poison,5]
    ,...hoverTransparency
    ,...eventNode.linkHitboxToRenderer
    ,[
        eventNode.mouse.Up
        ,({element})=>{
            element.set(`properties/health`,500)
        }
    ]
);
bob.set(`properties/health`,500);
game.bob = bob;

// ADVANCED ELEMENT CREATION
game.addElement(
    game.johnny = new entity(
        {x:100, y:50, Name: `johnny`} // Normal properties
        ,{color:[255,0,0]} // Renderer properties
        ,{} // Hitbox properties
        ,...eventNode.linkHitboxToRenderer // Event Node preset(makes hitbox = renderer).
        ,...hoverTransparency // Custom Mouse Mouse Event Nodes(Makes the entity more transparent when hovered over with the mouse)
        ,[poison,5] // makes the enemy suffer damage for 5 seconds, that increases exponentially(deals 200+ dmg)
        ,[
            eventNode.mouse.Up
            ,({element})=>{
                element.set(`properties/health`,500) // sets the element's health to 500 when clicked
            }
        ]
        ,[
            eventNode.mouse.Dragging
            ,({element,key})=>{
                element.set(`properties/x`,game.mouse.filteredX);
                element.set(`properties/y`,game.mouse.filteredY);
            }
        ]
        ,(element)=>{
            element.set(`properties/health`,500); // sets the element's health to 500 when added.
        }
    )
)

game.addElement(new entity(
        {},{color:[0,0,255],type:`txt`,fontsize:25,string:`yes hello there`},{}
        ,...eventNode.linkHitboxToRenderer,...hoverTransparency,[poison,5]
        ,[eventNode.mouse.Up,({element})=>{element.set(`properties/health`,500);}]
        ,(element)=>{element.set(`properties/health`,500);}
))