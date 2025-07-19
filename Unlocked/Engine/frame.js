import { game } from "./engine.js"

export function frame(timestamp=0){
    if (!game.time)game.time = timestamp;

    const deltatime = timestamp - game.time;
    game.time = timestamp;

    //console.log(deltatime/1000*3600)

    game.ctx.clearRect(0,0,game.window.width,game.window.height);

    game.currentscene.update(deltatime);
    for (let value in Object.values(game.currentscene.uiList)){
        value.update(deltatime, deltatime*60/1000);
    }

    game.currentscene.render(game.ctx);

    for (let value in Object.values(game.currentscene.uiList)){
        game.ctx.beginPath();
        game.ctx.fillStyle = `rgb(${value.color})`;
        value.render(game.ctx);
        game.ctx.fill();
    }

    requestAnimationFrame(frame);
}