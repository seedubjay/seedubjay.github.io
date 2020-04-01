function perlin(x,y,{scale = 1, octaves = 1, lacunarity = 2.0, persistence = 0.5, stretch = 1.0}) {
    let total = 0,
        frequency = 1/scale,
        amplitude = 1,
        maxAmplitude = 0;
    for (let i = 0; i < octaves; i++) {
        total += noise.perlin2(x * frequency, y * frequency) * amplitude;
        maxAmplitude += amplitude;
        frequency *= lacunarity;
        amplitude *= persistence;
    }
    return clamp(total/maxAmplitude*stretch, -1, 1);
}

function clamp(v, minv, maxv) {
    return Math.min(Math.max(v,minv),maxv);
}

// [-1,1] -> [-1,1]
let sinoid = (x,k) => (x-x*k)/(k-Math.abs(x)*2*k+1);

// [-1,1] -> [0,256)
function applyGreyscale(value) {
    let v = ((value+1)/2)*256;
    return [v,v,v,255];
}

function getColorChunk(groups) {
    return (value) => {
        for (var c of groups) {
            if (value <= c[0]) return c[1];
        }
        return [0,0,0,255];
    }
}

function getLinearRangeMapper(min0, max0, min1, max1) {
    return (v,d) => {
        let c = (min0+max0)/2*(1-d) + (min1+max1)/2*d,
        r = (max0-min0)/2*(1-d) + (max1-min1)/2*d;
        return v*r+c;
    }
}

// f(value,distance) adjusts value according to distance from the center (ranges from 0 to 1)
function getCenterModifier(f) {
    return (value, {x, y, width, height}) => {
        let d = Math.hypot(x-width/2, y-height/2);
        return f(value, clamp(d/width*2,0,1));
    }
}

function terrainGenerator(canvasID, defaultOptions = {}) {
    let canvas = document.getElementById(canvasID);
    if (!canvas) return {};
    let ctx = canvas.getContext("2d");
    let image = ctx.createImageData(canvas.width, canvas.height);
    let data = image.data;

    let heights = new Array(canvas.width);
    for (let x = 0; x < canvas.width; x++) heights[x] = new Array(canvas.height);

    function generate(options = {}) {
        let {perlinOptions, heightMapper = v=>v} = {
            ...defaultOptions,
            ...options
        };
        noise.seed(Math.random());
        
        for (let x = 0; x < canvas.width; x++) {
            for (let y = 0; y < canvas.height; y++) {
                let p = perlin(x,y,perlinOptions);
                heights[x][y] = clamp(heightMapper(p, {
                    x: x,
                    y: y,
                    width: canvas.width,
                    height: canvas.height
                }), -1, 1);
            }
        }
    }

    function draw(options = {}) {
        let {
            x1 = 0,
            x2 = 1e9,
            y1 = 0,
            y2 = 1e9,
            colourMapper = applyGreyscale,
        } = {...defaultOptions, ...options};
        x1 = Math.max(Math.round(x1),0);
        y1 = Math.max(Math.round(y1),0);
        x2 = Math.min(Math.round(x2),canvas.width-1);
        y2 = Math.min(Math.round(y2),canvas.height-1);

        let changedX1 = 1e9,
            changedY1 = 1e9,
            changedX2 = -1e9,
            changedY2 = -1e9;
        for (let x = x1; x <= x2; x++) {
            for (let y = y1; y <= y2; y++) {
                let i = (x+y*canvas.width)*4,
                    [r,g,b,a] = colourMapper(heights[x][y], {x: x, y: y});
                if (data[i] != r || data[i+1] != g || data[i+2] != b || data[i+3] != a) {
                    changedX1 = Math.min(changedX1,x);
                    changedY1 = Math.min(changedY1,y);
                    changedX2 = Math.max(changedX2,x);
                    changedY2 = Math.max(changedY2,y);
                }
                data[i] = r;
                data[i+1] = g;
                data[i+2] = b;
                data[i+3] = a;
            }
        }

        if (changedX1 <= changedX2 && changedY1 <= changedY2) {
            ctx.putImageData(
                image,
                0,
                0,
                changedX1,
                changedY1,
                changedX2-changedX1+1,
                changedY2-changedY1+1
            );
        }
    }

    return {canvas: canvas, generate: generate, draw: draw};
}

let colourscheme = [
    [-0.2,  [15,40,144,255]],
    [0,     [35,65,134,255]],
    [0.1,   [198,166,100,255]],
    [1,     [11,102,35,255]]
]

// canvas0: noise
let reload_canvas0;
(() => {
    let {canvas, generate, draw} = terrainGenerator("canvas0", {
        perlinOptions: {scale:200,octaves:4,lacunarity:2.0,persistence:0.5,stretch:2.0},
    });
    if (!canvas) return;
    generate();
    draw();
    reload_canvas0 = () => {generate(); draw()}
})();

// canvas1: interactive map revealing noise upon hover
let reload_canvas1;
(() => {
    let {canvas, generate, draw} = terrainGenerator("canvas1", {
        perlinOptions: {scale:130,octaves:4,lacunarity:2,persistence:0.5,stretch:2.0},
        heightMapper: getCenterModifier(getLinearRangeMapper(-.9,1,-1,-.4)),
        colourMapper: getColorChunk(colourscheme),
    });
    if (!canvas) return;
    
    let mouse = {x:0, y:0}
    let animationID = 0;
    let mouseRadius = 150;
    let prevMouse = {x: 0, y: 0};
    setHoverAction(canvas, p => {mouse=p}, () => {
        window.cancelAnimationFrame(animationID);
        animationID = requestAnimationFrame(() => {
            draw({
                colourMapper: (v, {x, y}) => {
                    if (Math.hypot(mouse.x-x, mouse.y-y) < mouseRadius) {
                        return applyGreyscale(sinoid(v,-.3));
                    } else {
                        return getColorChunk(colourscheme)(v);
                    }
                },
                x1: Math.min(prevMouse.x, mouse.x) - mouseRadius, 
                y1: Math.min(prevMouse.y, mouse.y) - mouseRadius,
                x2: Math.max(prevMouse.x, mouse.x) + mouseRadius,
                y2: Math.max(prevMouse.y, mouse.y) + mouseRadius,
            });
            prevMouse = mouse;
        });
    });
    
    canvas.onmouseout = () => {
        window.cancelAnimationFrame(animationID);
        animationID = requestAnimationFrame(() => {
            draw({
                x1: prevMouse.x-mouseRadius,
                y1: prevMouse.y-mouseRadius,
                x2: prevMouse.x+mouseRadius,
                y2: prevMouse.y+mouseRadius,
            });
        });
    };
    
    generate();
    draw();
    reload_canvas1 = () => {generate(); draw()};
})();

// CANVAS2: octaves graph
let reload_canvas2;
let toggle_button_canvas2;
(() => {
    let canvas = document.getElementById("canvas2");
    if (!canvas) return;
    let ctx = canvas.getContext("2d");

    let fidelity = canvas.width/2+1;
    let scale = 100;
    let stretch = 1.7;
    let octaves = 4;
    let visible = Array(octaves).fill(true);

    let maxAmplitude;
    let lines;

    function generate() {
        maxAmplitude = 0;
        lines = [];

        let frequency = 1/scale;
        let amplitude = stretch;
        for (let i = 0; i < octaves; i++) {
            noise.seed(Math.random());
            lines.push([]);
            for (let j = 0; j < fidelity; j++) {
                let x = j*(canvas.width/(fidelity-1));
                lines[i].push(noise.perlin2(x * frequency,0.4) * amplitude * stretch);
            }
            maxAmplitude += amplitude;
            frequency *= 2;
            amplitude *= 0.5;
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0,canvas.height/2);
        ctx.lineTo(canvas.width,canvas.height/2);
        ctx.stroke();

        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let i = 0; i < fidelity; i++) {
            let x = i*(canvas.width/(fidelity-1));
            let total = 0;
            for (let j = 0; j < lines.length; j++) if (visible[j]) {
                total += lines[j][i];
            }
            let y = total / maxAmplitude * canvas.height / 2 + canvas.height/2;
            if (i == 0) ctx.moveTo(x,y);
            else ctx.lineTo(x,y);
        }
        ctx.stroke();
    }

    generate();
    draw();
    reload_canvas2 = () => {generate(); draw()};

    toggle_button_canvas2 = n => {
        visible[n] = visible[n] ^ true;
        draw();
    }
})();