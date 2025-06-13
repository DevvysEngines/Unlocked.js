import { game } from "./engine.js"

export function frame(timestamp=0){
    if (!game.time)game.time = timestamp;

    const deltatime = timestamp - game.time;
    game.time = timestamp;

    game.ctx.clearRect(0,0,game.window.width,game.window.height);
    game.currentscene.render(game.ctx);
    game.currentscene.update(deltatime);

    requestAnimationFrame(frame);
}