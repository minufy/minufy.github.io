let ca = document.querySelector(".ca");
let x = 0;
let y = 0;
let cx = 0;
let cy = 0;

let main = document.querySelector("main");

const sens = 10;
const smooth = 0.15;
const waveSens = 1;
let offsets = {};

function update(){
    cx += (x-cx)*smooth;
    cy += (y-cy)*smooth;
    ca.style.left = `${cx}px`;
    ca.style.top = `${cy}px`;
    for (let [i, child] of Array.from(main.children).entries()){
        if (!(i in offsets)){
            offsets[i] = 500+Math.random()*200;
        }
        const rect = child.getBoundingClientRect();
        const dx = cx-rect.x-rect.width/2
        const dy = cy-rect.y-rect.height/2
        const dist = Math.sqrt(dx*dx+dy*dy)/400;
        const ry = (dx)/sens;
        const rx = -(dy)/sens*1.5;
        const sin = Math.sin(Date.now()/offsets[i])*waveSens;
        const cos = Math.cos(Date.now()/offsets[i]*2)*waveSens;
        child.style.filter = `blur(${dist}px)`;
        child.style.transform = `rotateX(${rx+sin}deg) rotateY(${ry+cos}deg) rotateZ(${sin+cos}deg)`;
    }
    requestAnimationFrame(update);
}
update();

document.addEventListener("mousemove", e => {
    x = e.x;
    y = e.y;
});