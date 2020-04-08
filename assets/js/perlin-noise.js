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

// f(value,distance) adjusts value according to distance from the center (ranges from 0 to 1)
function heightMapByCenter(f) {
    return (value, {x, y, width, height, r = Math.hypot(x-width/2, y-height/2)/width*2}) => {
        return f(value, clamp(r,0,1));
    }
}

function terrainGenerator(canvasID, defaultOptions = {}) {
    let {canvas, draw: drawImage} = imageGenerator(canvasID);
    if (!canvas) return {};

    let heights = new Array(canvas.width);
    for (let x = 0; x < canvas.width; x++) heights[x] = new Array(canvas.height);

    function generate(options = {}) {
        let {perlinOptions, heightMapper = v=>v, dx = ({x})=>x, dy = ({y})=>y, autoDraw = false, newSeed = true} = {
            ...defaultOptions,
            ...options
        };
        
        if (newSeed) noise.seed(Math.random());
        
        for (let x = 0; x < canvas.width; x++) {
            for (let y = 0; y < canvas.height; y++) {
                let o = {x: x, y: y, width: canvas.width, height: canvas.height};
                heights[x][y] = heightMapper(perlin(dx(o),dy(o),perlinOptions), o);
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
    setPointerMoveAction(canvas, p => {mouse=p}, () => {
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

// canvas6: hand-drawn sketch
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

// canvas7: 2D octaves
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
        [-1,-.2,.3,1]
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

// canvas9: blood vessels
let reload_canvas9;
window.addEventListener('load', () => {
    let colourMap = v => colourChunks(
        [[78, 119, 133, 255],null,[255, 123, 98, 255],null,[255,219,172,255]],
        [0,.01,.02,.02,.05,1])
        (Math.abs(v));

    let {canvas, generate} = terrainGenerator("canvas9", {
        perlinOptions: {scale:200, octaves: 3, stretch: 1.5},
        colourMapper: colourMap,
        autoDraw: true,
    });
    if (!canvas) return;

    generate();
    reload_canvas9 = generate;
});

// canvas10: fire
window.addEventListener('load', () => {
    let colourMap = (v,{y,height}) => colourChunks(
        [[255, 229, 0, 255],null,[255, 165, 0, 255],null,[180,0,0,255],null,[0,0,0,255]],
        [-1,-1,-.3,-.3,.2,.2,.5,1]
        )(interpolate(interpolate(-1,.5)(1-y/height),interpolate(0,1)(1-y/height),-1,1)(v));

    let dy = 0;

    let {canvas, generate} = terrainGenerator("canvas10", {
        perlinOptions: {scale:100, octaves: 6, stretch: 2},
        colourMapper: colourMap,
        dy: ({y,height}) => ((y/height)**1.5)*height + dy, 
        autoDraw: true,
    });
    if (!canvas) return;

    generate();

    let prevTime = 0;
    addHoveringDrawLoop(canvas, () => {
        if (prevTime != 0) dy += (Date.now() - prevTime) / 10;
        prevTime = Date.now();
        generate({newSeed: false});
    }, () => {prevTime = 0;});
});

// IMPORTED - https://github.com/josephg/noisejs/blob/master/perlin.js
/*
 * A speed-improved perlin and simplex noise algorithms for 2D.
 *
 * Based on example code by Stefan Gustavson (stegu@itn.liu.se).
 * Optimisations by Peter Eastman (peastman@drizzle.stanford.edu).
 * Better rank ordering method by Stefan Gustavson in 2012.
 * Converted to Javascript by Joseph Gentle.
 *
 * Version 2012-03-09
 *
 * This code was placed in the public domain by its original author,
 * Stefan Gustavson. You may use it as you see fit, but
 * attribution is appreciated.
 *
 */

(function(global){
    var module = global.noise = {};
  
    function Grad(x, y, z) {
      this.x = x; this.y = y; this.z = z;
    }
    
    Grad.prototype.dot2 = function(x, y) {
      return this.x*x + this.y*y;
    };
  
    var grad3 = [new Grad(1,1,0),new Grad(-1,1,0),new Grad(1,-1,0),new Grad(-1,-1,0),
                 new Grad(1,0,1),new Grad(-1,0,1),new Grad(1,0,-1),new Grad(-1,0,-1),
                 new Grad(0,1,1),new Grad(0,-1,1),new Grad(0,1,-1),new Grad(0,-1,-1)];
  
    var p = [151,160,137,91,90,15,
    131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
    190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
    88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,
    77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
    102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196,
    135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123,
    5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
    223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9,
    129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228,
    251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107,
    49,192,214, 31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254,
    138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180];
    // To remove the need for index wrapping, double the permutation table length
    var perm = new Array(512);
    var gradP = new Array(512);
  
    // This isn't a very good seeding function, but it works ok. It supports 2^16
    // different seed values. Write something better if you need more seeds.
    module.seed = function(seed) {
      if(seed > 0 && seed < 1) {
        // Scale the seed out
        seed *= 65536;
      }
  
      seed = Math.floor(seed);
      if(seed < 256) {
        seed |= seed << 8;
      }
  
      for(var i = 0; i < 256; i++) {
        var v;
        if (i & 1) {
          v = p[i] ^ (seed & 255);
        } else {
          v = p[i] ^ ((seed>>8) & 255);
        }
  
        perm[i] = perm[i + 256] = v;
        gradP[i] = gradP[i + 256] = grad3[v % 12];
      }
    };
  
    module.seed(0);

    function fade(t) {
      return t*t*t*(t*(t*6-15)+10);
    }
  
    function lerp(a, b, t) {
      return (1-t)*a + t*b;
    }
  
    // 2D Perlin Noise
    module.perlin2 = function(x, y) {
      // Find unit grid cell containing point
      var X = Math.floor(x), Y = Math.floor(y);
      // Get relative xy coordinates of point within that cell
      x = x - X; y = y - Y;
      // Wrap the integer cells at 255 (smaller integer period can be introduced here)
      X = X & 255; Y = Y & 255;
  
      // Calculate noise contributions from each of the four corners
      var n00 = gradP[X+perm[Y]].dot2(x, y);
      var n01 = gradP[X+perm[Y+1]].dot2(x, y-1);
      var n10 = gradP[X+1+perm[Y]].dot2(x-1, y);
      var n11 = gradP[X+1+perm[Y+1]].dot2(x-1, y-1);
  
      // Compute the fade curve value for x
      var u = fade(x);
  
      // Interpolate the four results
      return lerp(
          lerp(n00, n10, u),
          lerp(n01, n11, u),
         fade(y));
    };
  })(this);