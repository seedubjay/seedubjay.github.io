---
layout: post
title: Terrain Generation
subtitle: Making machines less mechanical
scripts: ['core', 'perlin', 'terrain-generation']
---
gday
<figure>
<canvas id="canvas0" width="1600" height="900"></canvas>
<div class="overlay">
<button type="submit" class="btn btn-secondary btn-sm" onclick="generate_canvas0(); draw_canvas0()">Reload</button>
</div>
<script>
let {generate: generate_canvas0, draw: draw_canvas0} = generator("canvas0", {
        perlinOptions: {scale:200,octaves:4,lacunarity:2.0,persistence:0.5},
    });
</script>
</figure>
test

test

test

<figure>
<canvas id="canvas1" class="prevent-scroll" width="800" height="800"></canvas>
<div class="overlay">
<button type="submit" class="btn btn-secondary btn-sm" onclick="generate_canvas1(); draw_canvas1()">Reload</button>
</div>

<script>

let colourscheme = [
    [-0.2,  [15,40,144,255]],
    [0,     [39,71,144,255]],
    [0.1,   [198,166,100,255]],
    [1,     [11,102,35,255]]
]

let {canvas: canvas1, generate: generate_canvas1, draw: draw_canvas1} = generator("canvas1", {
    perlinOptions: {scale:120,octaves:4,lacunarity:2,persistence:0.5},
    heightMapper: getCenterModifier(getLinearRangeMapper(-1.8,2,-0.5,-0.5)),
    colourMapper: getColorChunk(colourscheme),
});

let mouse = {x:0, y:0}
let animationID = 0;
let mouseRadius = 150;
let prevMouse = {x: 0, y: 0};
setHoverAction(canvas1, p => {mouse=p}, () => {
    window.cancelAnimationFrame(animationID);
    animationID = requestAnimationFrame(() => {
        draw_canvas1({
            colourMapper: (v, {x, y}) => {
                if (Math.hypot(mouse.x-x, mouse.y-y) < mouseRadius) {
                    return applyGreyscale(v);
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

setEndAction(canvas1, () => {
    window.cancelAnimationFrame(animationID);
    animationID = requestAnimationFrame(() => {
        draw_canvas1();
    });
});

generate_canvas1();
draw_canvas1();
</script>

</figure>
test
test
test
test
test
test
test

test
testtest
test
testtest

test
testtest

test
testtest
test
test

test
test
test
test
test
test

test
test
test


test
test
test