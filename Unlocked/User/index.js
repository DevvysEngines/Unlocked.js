import { game } from "../Engine/engine.js";
import { eventNode } from "../Engine/eventNode.js";
import { node } from "../Engine/node.js";
import { utils } from "../Engine/utils.js";

window.game = game; // for debugging purposes, delete once publishing

let transparentHover = [
    [
        eventNode.mouse.Entered
        ,({element})=>{
            element.set(`renderer/transparency`, 0.7)
        }
    ]
    ,[
        eventNode.mouse.Left
        ,({element})=>{
            element.set(`renderer/transparency`, 1)
        }
    ]
]

new game.element({x:0,y:150}
    ,{type:`txt`,fontsize:50,string:`Would you like to play? If yes, click me!`},{}
    ,...eventNode.linkHitboxToRenderer
    ,...transparentHover
    ,[
        eventNode.mouse.Up
        ,({element})=>{
            switch (element.get(`renderer/string`)){
                case `Would you like to play? If yes, click me!`:
                    element.set(`renderer/string`, `Thanks for joining us today! Please click to begin!`)
                    break;
                case `Thanks for joining us today! Please click to begin!`:
                    element.set(`renderer/string`, `Please guess a number between 1 and 10.`);
                    break;
                case `Please guess a number between 1 and 10.`:
                    element.set(`renderer/string`,`Please like and subscirbe to my channel, and please try out our engine!`);
                    break;
            }
        }
    ]
);
































































/*
// NODE EXAMPLES(NORMAL NODES)
let poison = new node.effect(
    `poison`
    ,[`damage/poison/custom`]
    ,undefined
    ,({element,key},delta,damage=5)=>{
        element.Damage(utils.tosec(damage)*delta,element);
        return [damage];
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

// preset
let drag = [
[
    eventNode.mouse.Dragging
    ,({element,key})=>{
        element.set(`properties/x`,game.mouse.filteredX);
        element.set(`properties/y`,game.mouse.filteredY);
    }
]]

// BASIC ELEMENT CREATION
let bob = new game.entity(
    {x:100,y:100,Name:`bob`}
    ,{}
    ,{}
);
bob.insertMultipleNodes(
    [poison,5]
    ,...hoverTransparency
    ,...eventNode.linkHitboxToRenderer
    ,...drag
);
game.bob = bob;

// ADVANCED ELEMENT CREATION

    game.johnny = new game.entity(
        {x:100, y:50, Name: `johnny`} // Normal properties
        ,{color:[255,0,0]} // Renderer properties
        ,{} // Hitbox properties
        ,...eventNode.linkHitboxToRenderer // Event Node preset(makes hitbox = renderer).
        ,...hoverTransparency // Custom Mouse Mouse Event Nodes(Makes the entity more transparent when hovered over with the mouse)
        ,...eventNode.parentRelationship
        ,[poison,5] // makes the enemy suffer damage for 5 seconds, that increases exponentially(deals 200+ dmg)
        ,[
            eventNode.mouse.Up
            ,({element})=>{
                element.set(`properties/health`,500) // sets the element's health to 500 when clicked
            }
        ]
        ,...drag
        ,(element)=>{
            element.set(`properties/health`,500); // sets the element's health to 500 when added.
            element.addChild(bob)
            //element.set(`renderer/rotation`,100)
            //element.set(`hitbox/rotation`,100)
        }
    )


new game.entity(
        {},{color:[0,0,255],type:`txt`,fontsize:25,string:`yes hello there`},{}
        ,...eventNode.linkHitboxToRenderer,...drag,...hoverTransparency,[poison,5]
        ,[eventNode.mouse.Up,({element})=>{element.set(`properties/health`,500);}]
        ,[
            eventNode.mouse.Up
            ,({element})=>{
                element.set(`renderer/type`,`arc`)
            }
        ]
        ,(element)=>{element.set(`properties/health`,500);}
)

let background = new game.element({x:300,y:100},{color:[150,150,150],width:150,height:100},{},
    ...eventNode.linkHitboxToRenderer
    ,...eventNode.parentRelationship
    ,...drag
    ,(element)=>{

    }
);

let firstbutton = new game.element({x:250,y:75},{color:[100,100,100],width:25,height:25},{},
    ...eventNode.linkHitboxToRenderer
    ,[
        eventNode.mouse.Up
        ,({element})=>{
            background.set(`renderer/color`,[255,0,0])
        }
    ]
    ,(element)=>{

    }
);

let lastbutton = new game.element({x:300,y:75},{color:[75,75,75],width:25,height:25},{},
    ...eventNode.linkHitboxToRenderer
    ,(element)=>{

    }
);

let buttonString = new game.element({x:300,y:75},{color:[75,75,75],width:25,height:25},{},
    ...eventNode.linkHitboxToRenderer
    ,(element)=>{

    }
);

background.addChild(firstbutton);
background.addChild(lastbutton);
background.addChild(buttonString)

setInterval(()=>{
    background.set(`renderer/rotation`,background.get(`renderer/rotation`)+1)
})

setInterval(()=>{
    game.johnny.set(`renderer/rotation`,game.johnny.get(`renderer/rotation`)+1)
})
*/