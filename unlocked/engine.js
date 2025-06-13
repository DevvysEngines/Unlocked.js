import { Game } from "./game.js";
import { element } from "./element.js";
import { entity } from "./entity.js";
import { node } from "./node.js";
import { utils } from "./utils.js";
import { eventNode } from "./eventNode.js";
export let game = new Game()

window.game = game;
game.begin();

let johnny = new entity(`johnny`,30,30, {type:`arc`}, {});
let secplayer = new entity(`secplayer`,100,100,{color:[255,0,0]},{},{});
let triplayer = new entity(`triplayer`, 200, 200);
game.addElement(johnny);
game.addElement(secplayer);
game.addElement(triplayer);
game.johnny = johnny;
game.secplayer = secplayer;
game.triplayer = triplayer;

johnny.dealDamage(60,secplayer);
triplayer.dealDamage(10,secplayer);
secplayer.dealDamage(75, johnny);

let poison = new node.effect(`poison`,[`poison`,`damage`],undefined,({element,key},delta,damage)=>{
    element.Damage(utils.tosec(damage)*delta,element);
});


let movement = new node.effect(`movement`,[`movement`],undefined,({element,key},delta,movement)=>{
    element.changePosition(element.x+utils.tosec(movement)*delta,element.y);
});

johnny.insertEventNode(eventNode.mouse.Up,({element,key},[ov,v])=>{
    element.set(`renderer`,`color`,[255,0,0])
});

johnny.insertNode(poison,9.9,2.5);
secplayer.insertNode(poison,10,2.5);
johnny.insertNode(movement,10,10)