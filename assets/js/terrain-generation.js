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
    return [v,v,v];
}

function getColorChunk(groups) {
    return (value) => {
        for (var c of groups) {
            if (value <= c[0]) return c[1];
        }
        return [0,0,0];
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
        let d = ((x-width/2)**2+(y-height/2)**2)**0.5;
        return f(value, clamp(d/width*2,0,1));
    }
}

function generator(canvasID) {
    let canvas = document.getElementById(canvasID);
    let ctx = canvas.getContext("2d");
    let image = ctx.createImageData(canvas.width, canvas.height);
    let data = image.data;

    return ({perlinOptions, colourMapper = applyGreyscale, heightMapper = v => v}) => {
        noise.seed(Math.random());

        for (let x = 0; x < canvas.width; x++) {
            for (let y = 0; y < canvas.height; y++) {
                let p = perlin(x,y,perlinOptions),
                    v = clamp(heightMapper(p, {
                        x: x,
                        y: y,
                        width: canvas.width,
                        height: canvas.height
                    }), -1, 1);

                let cell = (x + y * canvas.width) * 4;
                [data[cell], data[cell+1], data[cell+2]] = colourMapper(v);
                data[cell + 3] = 255;
            }
        }

        ctx.clearRect(0,0,canvas.width, canvas.height);
        ctx.putImageData(image, 0, 0);
    }
}