window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;

function getMousePosition(canvas, e) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: (e.clientX - rect.left) * canvas.width / rect.width,
        y: (e.clientY - rect.top) * canvas.width / rect.width
    }
}

function getTouchPosition(canvas, e) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: (e.touches[0].clientX - rect.left) * canvas.width / rect.width,
        y: (e.touches[0].clientY - rect.top) * canvas.width / rect.width
    }
}

function addHoveringDrawLoop(canvas, draw, cb = null) {
    let animationID = 0;
    let loop = () => {draw(); animationID = requestAnimationFrame(loop);}
    let end = () => {
        cancelAnimationFrame(animationID);
        if (cb) cb();
    }

    canvas.addEventListener('mouseover', loop);
    canvas.addEventListener('touchdown', loop);

    canvas.addEventListener('mouseout', end);
    canvas.addEventListener('touchup', end);
}

function setPointerMoveAction(canvas, setPosition = null, cb = null) {
    canvas.onmousemove = (e) => {
        if (setPosition) setPosition(getMousePosition(canvas, e));
        if (cb) cb();
    };

    canvas.ontouchmove = (e) => {
        setPosition(getTouchPosition(canvas, e));
        cb();
    };
}

function addDrawLoop(draw, shouldDraw, cb) {
    function drawLoop(){
        requestAnimationFrame(drawLoop);
        if(shouldDraw()) {
            draw();
            if (typeof cb !== 'undefined') cb();
        }
    }
    window.addEventListener("load", drawLoop);
}

function drawOnce(draw, cb = null) {
    window.addEventListener("load", draw);
    if (cb) cb();
}

for (let x of document.getElementsByClassName('no-focus')) {
    x.onmousedown = (e) => {e.preventDefault()};
    x.ontouchdown = (e) => {e.preventDefault()};
}

// MATHS

let clamp = (v, minv, maxv) => Math.min(Math.max(v,minv),maxv);

// [-1,1] -> [-1,1]
let sinoid = (x,k) => (x-x*k)/(k-Math.abs(x)*2*k+1);

// [-1,1] -> [0,256)
let colourGreyscale = v => [v*256,v*256,v*256,255];

function interpolate(y1, y2, x1=0,x2=1) {
    return v => {
        r = (clamp(v,x1,x2)-x1)/(x2-x1);
        return y1*(1-r) + y2*r;
    }
}
function colourInterpolate(c1, c2, x1=0, x2=1) {
    return v => c1.map((c,i) => Math.floor(interpolate(c,c2[i],x1,x2)(v)));
}

function colourChunks(colours, points = null) {
    if (points === null) {
        points = [];
        for (let i in colours) points.push(i/colours.length);
        points.push(1);
    }
    console.assert(points.length == colours.length + 1)
    return (value) => {
        for (let i = 0; i < colours.length; i++) {
            if (value <= points[i+1]) {
                if (colours[i] === null) return colourInterpolate(colours[i-1],colours[i+1],points[i],points[i+1])(value);
                else return colours[i];
            }
        }
        return colours[colours.length-1];
    }
}

// CANVAS

function imageGenerator(canvasID, defaultOptions = {}) {
    let canvas = document.getElementById(canvasID);
    if (!canvas) return {};
    let ctx = canvas.getContext("2d");
    let image = ctx.createImageData(canvas.width, canvas.height);
    let data = image.data;

    function draw(options = {}) {
        console.time(`draw ${canvasID}`);
        let {
            getPixel,
            x1 = 0,
            x2 = 1e9,
            y1 = 0,
            y2 = 1e9,
        } = {...defaultOptions, ...options};
        x1 = Math.max(Math.round(x1),0);
        y1 = Math.max(Math.round(y1),0);
        x2 = Math.min(Math.round(x2),canvas.width-1);
        y2 = Math.min(Math.round(y2),canvas.height-1);

        let bbox = {}

        for (let x = x1; x <= x2; x++) {
            for (let y = y1; y <= y2; y++) {
                let [r,g,b,a] = getPixel(x,y,{width: canvas.width, height: canvas.height});
                    i = (x+y*canvas.width)*4;
                if (data[i] != r || data[i+1] != g || data[i+2] != b || data[i+3] != a) {
                    bbox.x1 = Math.min(bbox.x1 || 1e9, x1);
                    bbox.y1 = Math.min(bbox.y1 || 1e9, y1);
                    bbox.x2 = Math.max(bbox.x2 || -1e9, x2);
                    bbox.y2 = Math.max(bbox.y2 || -1e9, y2);
                    data[i] = r;
                    data[i+1] = g;
                    data[i+2] = b;
                    data[i+3] = a;
                }
            }
        }

        if (typeof bbox.x1 != 'undefined') ctx.putImageData(
            image,
            0,
            0,
            bbox.x1,
            bbox.y1,
            bbox.x2-bbox.x1+1,
            bbox.y2-bbox.y1+1,
        );
        console.timeEnd(`draw ${canvasID}`);
    }

    return {canvas: canvas, draw: draw};
}

function graphGenerator(canvasID, defaultOptions) {
    let canvas = document.getElementById(canvasID);
    if (!canvas) return {};
    let ctx = canvas.getContext("2d");

    function draw(options) {
        let {
            lines = [],
            fidelity = canvas.width,
            x_axis = false,
            y_axis = false,
            xlim = [-1,1],
            ylim = [-1,1],
        } = {...defaultOptions, ...options};

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (x_axis) {
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0,canvas.height/2);
            ctx.lineTo(canvas.width,canvas.height/2);
            ctx.stroke();
        }

        if (y_axis) {
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(canvas.width/2,0);
            ctx.lineTo(canvas.width/2,canvas.height);
            ctx.stroke();
        }

        ctx.lineWidth = 3;
        for (let f of lines) {
            ctx.beginPath();
            for (let i = 0; i <= fidelity; i++) {
                let x = i*canvas.width/fidelity;
                y = canvas.height - (f(i/fidelity * (xlim[1]-xlim[0]) + xlim[0])-ylim[0])/(ylim[1]-ylim[0])*canvas.height;
                if (i == 0) ctx.moveTo(x,y);
                else ctx.lineTo(x,y);
            }
            ctx.stroke();
        }
    }

    return {canvas: canvas, draw: draw};
}