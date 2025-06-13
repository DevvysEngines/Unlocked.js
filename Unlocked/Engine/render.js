export class render{
    static box = {
        render: (ctx,element)=>{
            const dime = element.dime;
            ctx.roundRect(-dime.width/2,-dime.height/2,dime.width,dime.height,0)
            ctx.closePath();
            ctx.fillText(`${Math.round(element.health)}%`,0,-20)
        }
    }
    static arc = {
        render: (ctx,element)=>{
            const dime = element.dime
            ctx.arc(0,0,dime.radius,0,360)
            ctx.closePath();
            ctx.fillText(`${Math.round(element.health)}%`,0,-20)
        }
    }
}