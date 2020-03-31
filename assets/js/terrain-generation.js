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
            minx = 0,
            maxx = canvas.width,
            miny = 0,
            maxy = canvas.height,
            colourMapper = applyGreyscale,
        } = {...defaultOptions, ...options};

        let changedMinX = 1e9,
            changedMinY = 1e9,
            changedMaxX = -1e9,
            changedMaxY = -1e9;
        console.time('scanning');
        for (let x = minx; x < maxx; x++) {
            for (let y = miny; y < maxy; y++) {
                let i = (x+y*canvas.width)*4,
                    [r,g,b,a] = colourMapper(heights[x][y], {x: x, y: y});
                if (data[i] != r || data[i+1] != g || data[i+2] != b || data[i+3] != a) {
                    changedMinX = Math.min(changedMinX,x);
                    changedMinY = Math.min(changedMinY,y);
                    changedMaxX = Math.max(changedMaxX,x);
                    changedMaxY = Math.max(changedMaxY,y);
                }
                data[i] = r;
                data[i+1] = g;
                data[i+2] = b;
                data[i+3] = a;
            }
        }
        console.timeEnd('scanning');

        if (changedMinX <= changedMaxX && changedMinY <= changedMaxY) {
            ctx.putImageData(
                image,
                0,
                0,
                changedMinX,
                changedMinY,
                changedMaxX-changedMinX+1,
                changedMaxY-changedMinY+1
            );
        }
    }

    return {canvas: canvas, generate: generate, draw: draw};
}