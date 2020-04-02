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

let clamp =(v, minv, maxv) => Math.min(Math.max(v,minv),maxv);

// [-1,1] -> [-1,1]
let sinoid = (x,k) => (x-x*k)/(k-Math.abs(x)*2*k+1);

// [-1,1] -> [0,256)
function applyGreyscale(value) {
    let v = ((value+1)/2)*256;
    return [v,v,v,255];
}

function interpolate(y1, y2, x1=0,x2=1) {
    return v => {
        r = (clamp(v,x1,x2)-x1)/(x2-x1);
        return y1*(1-r) + y2*r;
    }
}
function colourInterpolate(c1, c2, x1=0, x2=1) {
    return v => c1.map((c,i) => interpolate(c,c2[i],x1,x2)(v));
}

function colourChunks(groups) {
    return (value) => {
        for (var c of groups) {
            if (value <= c[0]) {
                if (typeof c[1] == 'function') return c[1](value);
                else return c[1];
            }
        }
        return [0,0,0,255];
    }
}

// f(value,distance) adjusts value according to distance from the center (ranges from 0 to 1)
function heightMapByCenter(f) {
    return (value, {x, y, width, height}) => {
        let d = Math.hypot(x-width/2, y-height/2);
        return f(value, clamp(d/width*2,0,1));
    }
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
                heights[x][y] = heightMapper(perlin(x,y,perlinOptions), {x: x, y: y, width: canvas.width, height: canvas.height})
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
                let [r,g,b,a] = colourMapper(heights[x][y], {x: x, y: y, width: canvas.width, height: canvas.height}),
                    i = (x+y*canvas.width)*4;
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
    [-.3,   [0,0,100,255]],
    [0,     colourInterpolate([0,0,100,255],[35,65,134,255],-.3,0)],
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
        heightMapper: heightMapByCenter((v,d) => interpolate(interpolate(-.9,-1)(d), interpolate(1,-.4)(d),-1,1)(v)),
        colourMapper: colourChunks(colourscheme),
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
                        return colourChunks(colourscheme)(v);
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
    let octaves = 5,
        scale = .5,
        stretch = 1.5,
        lacunarity = 2,
        persistence = .5,
        maxAmplitude = (1-persistence**octaves)/(1-persistence);

    let visible = Array(octaves).fill(true);
    let seed = Math.random();

    let {draw} = graphGenerator("canvas2", {
        lines: [(x) => {
            let total = 0,
                amplitude = 1,
                frequency = 1/scale;
            noise.seed(seed);
            for (let i = 0; i < octaves; i++) {
                if (visible[i]) total += noise.perlin2(x * frequency,0.4) * amplitude;
                frequency *= lacunarity;
                amplitude *= persistence;
            }
            return total / maxAmplitude * stretch;
        }],
        x_axis: true,
        x_lim: [0,1],
    });

    draw();

    reload_canvas2 = () => {seed = Math.random(); draw()};
    toggle_button_canvas2 = n => {
        visible[n] = visible[n] ^ true;
        draw();
    }
})();

// canvas3: 
let reload_canvas3a;
(() => {
    let rangeMin = interpolate(-.9,-1),
        rangeMax = interpolate(1,-.2),
        rangeMap = (v,d) => interpolate(rangeMin(d),rangeMax(d),-1,1)(v);

    let {canvas: canvasMap, generate, draw: drawMap} = terrainGenerator("canvas3a", {
        perlinOptions: {scale:50,octaves:4,lacunarity:2,persistence:0.5,stretch:2.0},
        colourMapper: (v,o) => colourChunks(colourscheme)(heightMapByCenter(rangeMap)(v,o), o),
    });
    if (!canvasMap) return;
    
    generate();
    drawMap();
    reload_canvas3a = () => {generate(); drawMap()};

    let {canvas: canvasGraph, draw: drawGraph} = graphGenerator("canvas3b", {
        lines: [
            x => rangeMin(Math.abs(x)),
            x => rangeMax(Math.abs(x))
        ],
    });
    if (!canvasGraph) return;

    drawGraph();

    let slider = document.getElementById('canvas2-slider'),
        animationID = 0;

    slider.oninput = () => {
        rangeMax = interpolate(1,interpolate(-1,1)(slider.value));
        window.cancelAnimationFrame(animationID);
        animationID = requestAnimationFrame(() => {
            drawMap();
            drawGraph();
        });
    }
})();