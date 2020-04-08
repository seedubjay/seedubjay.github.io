function perlin(x,y,{scale = 1, octaves = 1, lacunarity = 2.0, persistence = 0.5, stretch = 1}) {
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

// f(value,distance) adjusts value according to distance from the center (ranges from 0 to 1)
function heightMapByCenter(f) {
    return (value, {x, y, width, height, r = Math.hypot(x-width/2, y-height/2)/width*2}) => {
        return f(value, clamp(r,0,1));
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
    let {canvas, draw: drawImage} = imageGenerator(canvasID);
    if (!canvas) return {};

    let heights = new Array(canvas.width);
    for (let x = 0; x < canvas.width; x++) heights[x] = new Array(canvas.height);

    function generate(options = {}) {
        let {perlinOptions, heightMapper = v=>v, autoDraw = false} = {
            ...defaultOptions,
            ...options
        };
        noise.seed(Math.random());
        
        for (let x = 0; x < canvas.width; x++) {
            for (let y = 0; y < canvas.height; y++) {
                heights[x][y] = heightMapper(perlin(x,y,perlinOptions), {x: x, y: y, width: canvas.width, height: canvas.height});
            }
        }

        if (autoDraw) draw();
    }

    function draw(options = {}) {
        let {
            colourMapper = v => colourGreyscale((v+1)/2),
        } = {...defaultOptions, ...options};
        drawImage({
            getPixel: (x,y) => colourMapper(heights[x][y], {x: x, y: y, width: canvas.width, height: canvas.height}),
            ...defaultOptions,
            ...options
        });
    }

    return {canvas: canvas, generate: generate, draw: draw};
}

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

let terrainColourMap = colourChunks(
    [[0,0,100,255], null, [35,65,134,255], [198,166,100,255], [11,102,35,255]],
    [-1,-.3,0,0,.1,1],
)

let terrainGreyscaleMap = v => colourGreyscale((sinoid(v,-.2)+1)/2);

// canvas0: noise
let reload_canvas0;
window.addEventListener('load', () => {
    let {canvas, generate, draw} = terrainGenerator("canvas0", {
        perlinOptions: {scale:100},
        colourMapper: terrainGreyscaleMap,
        autoDraw: true,
    });
    if (!canvas) return;
    generate();
    reload_canvas0 = generate;
});

// canvas1: interactive map revealing noise upon hover
let reload_canvas1;
window.addEventListener('load', () => {
    const rangeMap = (v, d) => interpolate(interpolate(-.8, -1)(d), interpolate(1, -.4)(d), -1, 1)(v);
    let {canvas, generate, draw} = terrainGenerator("canvas1", {
        perlinOptions: {scale:120,octaves:4,stretch:1.7},
        //heightMapper: heightMapByCenter((v,d) => interpolate(interpolate(-.8,-1)(d), interpolate(1,-.4)(d),-1,1)(v)),
        //colourMapper: (v,o) => terrainColourMap(heightMapByCenter(rangeMap)(v,o)),
        colourMapper: terrainColourMap,
        autoDraw: true,
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
                colourMapper: (v, {x, y, width, height}) => {
                    if (Math.hypot(mouse.x-x, mouse.y-y) < mouseRadius) {
                        return terrainGreyscaleMap(v);
                    } else {
                        return terrainColourMap(v);
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
    reload_canvas1 = generate;
});

// CANVAS2: octaves graph
let reload_canvas2;
let toggle_button_canvas2;
window.addEventListener('load', () => {
    let octaves = 5,
        scale = .5,
        stretch = 1.5,
        lacunarity = 2.2,
        persistence = 1/lacunarity,
        maxAmplitude = (1-persistence**octaves)/(1-persistence);

    let visible = Array(octaves).fill(false);
    visible[0] = true;
    let seed = Math.random();

    let {draw} = graphGenerator("canvas2", {
        lines: [x => {
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
        x_lim: [0,1],
    });

    draw();

    reload_canvas2 = () => {seed = Math.random(); draw()};
    toggle_button_canvas2 = n => {
        visible[n] = visible[n] ^ true;
        draw();
    }
});

// canvas3: adjust the height map at the edges
let reload_canvas3a;
window.addEventListener('load', () => {
    let slider = document.getElementById('canvas2-slider');

    let rangeMin = interpolate(interpolate(-.2,-1)(slider.value),-1)
        rangeMax = interpolate(1,interpolate(-1,1)(slider.value));
        rangeMap = (v,d) => interpolate(rangeMin(d),rangeMax(d),-1,1)(v),
        colourMap = (v,o) => terrainColourMap(heightMapByCenter(rangeMap)(v,o));

    let {canvas: canvasMap, generate, draw: drawMap} = terrainGenerator("canvas3a", {
        perlinOptions: {scale:100,octaves:4,lacunarity:2,persistence:0.5,stretch:1.7},
        colourMapper: colourMap,
        autoDraw: true,
    });
    if (!canvasMap) return;
    
    generate();
    reload_canvas3a = generate;

    let strips = 15;
    let gapPerStrip = 0.5

    let {draw: drawGraph} = imageGenerator("canvas3b", {
        getPixel: (x,y,{width,height}) => {
            let stripWidth = width / (strips + gapPerStrip*(strips-1));
            let d = x % (stripWidth*(1+gapPerStrip));
            if (d > stripWidth) return [255,255,255,255];
            x = x - d + stripWidth/2;
            return colourMap(-y/height*2+1, {r: Math.abs(x/width*2-1)});
        }
    });

    drawGraph();

    let animationID = 0;
    slider.oninput = () => {
        rangeMin = interpolate(interpolate(-.2,-1)(slider.value),-1)
        rangeMax = interpolate(1,interpolate(-1,1)(slider.value));
        window.cancelAnimationFrame(animationID);
        animationID = requestAnimationFrame(() => {
            drawMap();
            drawGraph();
        });
    }
});

// canvas4: colour palette
window.addEventListener('load', () => {
    imageGenerator("canvas4a", {
        getPixel: (x,_,{width}) => terrainGreyscaleMap(x/width*2-1)
    }).draw();

    // imageGenerator("canvas4b", {
    //     getPixel: (x,_,{width}) => skyColourMap(x/width*2-1)
    // }).draw();

    imageGenerator("canvas4c", {
        getPixel: (x,_,{width}) => terrainColourMap(x/width*2-1)
    }).draw();
});

// canvas5: terrain without falling away into the ocean
let reload_canvas5;
window.addEventListener('load', () => {
    let {canvas, generate} = terrainGenerator("canvas5", {
        perlinOptions: {scale:130,octaves:4,lacunarity:2,persistence:0.5,stretch:2.0},
        colourMapper: terrainColourMap,
        autoDraw: true,
    });
    if (!canvas) return;
    
    generate();
    reload_canvas5 = generate;
});

let reload_canvas6;
window.addEventListener('load', () => {
    let slider = document.getElementById('canvas6-slider');

    let canvas = document.getElementById("canvas6");
    if (!canvas) return {};
    let ctx = canvas.getContext("2d");

    let f = x => canvas.height*.2 * Math.sin((x-canvas.width/2) / (canvas.width*.3) * 2 * Math.PI)

    function draw() {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        let h = .4;

        // x-axis
        ctx.lineWidth = 1;
        h++;
        ctx.beginPath();
        for (let x = canvas.width*.1; x <= canvas.width*.9; x++) {
            let y = slider.value**2 * 30 * perlin(x/20,h,{octaves: 4});
            let lx = x;
            let ly = canvas.height/2 - y;

            if (x == 0) ctx.moveTo(lx,ly);
            else ctx.lineTo(lx,ly);
        }
        ctx.stroke();

        // y-axis
        ctx.lineWidth = 1;
        h++;
        ctx.beginPath();
        for (let y = canvas.height*.2; y <= canvas.height*.8; y++) {
            let x = slider.value**2 * 30 * perlin(y/20,h,{octaves: 4});
            let lx = canvas.width/2 - x;
            let ly = y;

            if (y == 0) ctx.moveTo(lx,ly);
            else ctx.lineTo(lx,ly);
        }
        ctx.stroke();

        ctx.lineWidth = 3;
        h++;
        ctx.beginPath();
        for (let x = canvas.width*.2; x <= canvas.width*.8; x++) {
            let y = f(x);
            let dx = 0.1, dy = y - f(x-dx), s = slider.value**2 * 100 * perlin(x/50,h,{octaves: 6}) / Math.hypot(dx,dy);
            let lx = x + dy * s; // perpendicular to direction of curve
            let ly = y - dx * s;
            ly = canvas.height/2 - ly;

            if (x == 0) ctx.moveTo(lx,ly);
            else ctx.lineTo(lx,ly);
        }
        ctx.stroke();
    }

    reload_canvas6 = () => {noise.seed(Math.random()); draw()}
    reload_canvas6();

    let animationID = 0;
    slider.oninput = () => {
        window.cancelAnimationFrame(animationID);
        animationID = requestAnimationFrame(() => {
            draw();
        });
    }
});

let reload_canvas7;
let toggle_button_canvas7;
window.addEventListener('load', () => {
    let octaves = 5,
        scale = 50,
        stretch = 1.5,
        lacunarity = 2,
        persistence = 1/lacunarity,
        maxAmplitude = (1-persistence**octaves)/(1-persistence);

    let visible = Array(octaves).fill(false);
    visible[0] = true;
    let seed = Math.random();

    let {draw} = imageGenerator("canvas7", {
        getPixel: (x,y) => {
            let total = 0,
                amplitude = 1,
                frequency = 1/scale;
            noise.seed(seed);
            for (let i = 0; i < octaves; i++) {
                if (visible[i]) total += noise.perlin2(x * frequency, y * frequency) * amplitude;
                frequency *= lacunarity;
                amplitude *= persistence;
            }
            return colourGreyscale(clamp(total / maxAmplitude * stretch,-1,1)/2+.5);
        },
    });

    draw();

    reload_canvas7 = () => {seed = Math.random(); draw()};
    toggle_button_canvas7 = n => {
        visible[n] = visible[n] ^ true;
        draw();
    }
});

// canvas8: clouds in the sky
let reload_canvas8;
window.addEventListener('load', () => {
    let colourMap = colourChunks(
        [[173,216,230,255],null,[255,255,255,255]],
        [-1,0,.5,1]
    );

    let {canvas, generate} = terrainGenerator("canvas8", {
        perlinOptions: {scale:150, octaves: 6, stretch: 2},
        colourMapper: colourMap,
        autoDraw: true,
    });
    if (!canvas) return;

    generate();
    reload_canvas8 = generate;
});

// canvas8: blood vessels
let reload_canvas9;
window.addEventListener('load', () => {
    let colourMap = v => colourChunks(
        [[78, 119, 133, 255],null,[255, 123, 98, 255],null,[255,219,172,255]],
        [0,.01,.03,.03,.05,1])
        (Math.abs(v));

    let {canvas, generate} = terrainGenerator("canvas9", {
        perlinOptions: {scale:150, octaves: 4, stretch: 1.5},
        colourMapper: colourMap,
        autoDraw: true,
    });
    if (!canvas) return;

    generate();
    reload_canvas9 = generate;
});