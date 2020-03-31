function perlin(x,y,{scale = 1, octaves = 3, lacunarity = 2.0, persistence = 0.5}) {
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
    return total/maxAmplitude;
}

function clamp(v, minv, maxv) {
    return Math.min(Math.max(v,minv),maxv);
}

function applyGreyscale(value) {
    let v = (value*2+1)*128; // x2 to fill available space
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

function generator(canvasID, defaultOptions) {
    let canvas = document.getElementById(canvasID);
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

        console.time('generate');
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
        console.timeEnd('generate');
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
        console.time('scanning');
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
        console.timeEnd('scanning');

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