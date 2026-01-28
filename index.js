/** @type {HTMLCanvasElement} */
let canvas = document.getElementById("canvas");
/** @type {CanvasRenderingContext2D} */
let ctx = canvas.getContext("2d");

canvas.width = window.innerWidth
canvas.height = window.innerHeight

const grid_size = 128;
let grid = [];
let visited = [];
for(let y = 0; y < canvas.height/grid_size; y++){
    grid[y] = [];
    visited[y] = [];
    for(let x = 0; x < canvas.width/grid_size; x++){
        grid[y][x] = 0;
        visited[y][x] = false;
    }
}
let mouseX;
let mouseY;

let animation = [];
let lastTime = 0;
let currentTime = 0;

const mx = [0, 1, 0, -1];
const my = [1, 0, -1, 0];

function dfs(x, y){
    if(x < 0 || x >= grid[0].length || y < 0 || y >= grid.length) return;
    if(visited[y][x]) return;
    visited[y][x] = true;
    lastTime += 0.02;
    animation.push([x, y, lastTime]);
    let dirs = [0, 1, 2, 3];
    while(dirs.length > 0){
        let idx = Math.floor(Math.random()*dirs.length);
        let dir = dirs.splice(idx, 1)[0];
        dfs(x+mx[dir], y+my[dir]);
    }
}

function update(){
    currentTime =  performance.now()/1000;
    const gridX = Math.floor(mouseX/grid_size);
    const gridY = Math.floor(mouseY/grid_size);
    if (gridY >= 0 && gridY < grid.length && gridX >= 0 && gridX < grid[0].length)
        grid[gridY][gridX] = 1;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let y = 0; y < grid.length; y++){
        for(let x = 0; x < grid[y].length; x++){
            grid[y][x] *= 0.94;
            ctx.fillStyle = `rgba(255, 255, 255, ${grid[y][x]/15})`;
            ctx.fillRect(x*grid_size, y*grid_size, grid_size, grid_size);
            ctx.strokeStyle = "#ffffff10";
            ctx.strokeRect(x*grid_size, y*grid_size, grid_size, grid_size);
        }
    }
    for (let i = animation.length-1; i >= 0; i--){
        let [x, y, time] = animation[i];
        if (currentTime >= time){
            grid[y][x] = 1;
            animation.splice(i, 1);
        }
    }
    requestAnimationFrame(update);
}
requestAnimationFrame(update);

window.onmousemove = function(e){
    let rect = canvas.getBoundingClientRect();
    mouseX = e.clientX-rect.left;
    mouseY = e.clientY-rect.top;
}

window.onclick = function(e){
    const gridX = Math.floor(mouseX/grid_size);
    const gridY = Math.floor(mouseY/grid_size);
    visited = visited.map(row => row.map(() => false));
    lastTime = currentTime;
    dfs(gridX, gridY);
}