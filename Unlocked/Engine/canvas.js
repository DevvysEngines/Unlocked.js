export class Canvas{
    constructor(){
        this.canvas = document.createElement(`canvas`);
        this.canvas.style.position = `fixed`;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.canvas.style.left = 0;
        this.canvas.style.top = 0;
        this.ctx = this.canvas.getContext(`2d`);
        this.ctx.textAlign = `center`;
        document.body.insertBefore(this.canvas,document.body.childNodes[0]);
    }
}