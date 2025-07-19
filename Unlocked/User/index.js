import { game } from "../Engine/engine.js";
window.game = game;

let player = new game.element(
   {x:500} // properties Name, ids, chunk, x,y, ui
   ,{color:[255,0,0], type:`arc`} // Renderer how the object looks
   ,{}
);

game.player = player;

player.set(`vitals`, {health:500});
let x = player.do(new game.node(`node`, [`player`],function(){
    console.log(`heyy`)
}))

player.on(game.presets.mouse.Left.Down,
    function(){
        this.link(x);
        console.log(this.secondaryNode)
        this.remove();
    }
)

// types
// box, arc, txt, img

/*
Scopes
    properties
    renderer
    hitbox
    --nodes system stuff

    custom - vitals - health and stuff
    custom - physics - mass, friction
*/