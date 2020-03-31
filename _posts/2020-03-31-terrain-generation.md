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
<button type="submit" class="btn btn-secondary btn-sm" onclick="draw_canvas0()">Reload</button>
</div>
<script>
let draw_canvas0_any = generator("canvas0"),
    draw_canvas0 = () => {draw_canvas0_any({
        perlinOptions: {scale:200,octaves:4,lacunarity:2.0,persistence:0.5},
        colourMapper: applyGreyscale
    })};
draw_canvas0();
</script>
</figure>
test

test

test

<figure>
<canvas id="canvas1" width="800" height="800"></canvas>
<div class="overlay">
<button type="submit" class="btn btn-secondary btn-sm" onclick="draw_canvas1()">Reload</button>
</div>
<script>
let draw_canvas1_any = generator("canvas1"),
    draw_canvas1 = () => {draw_canvas1_any({
        perlinOptions: {scale:120,octaves:4,lacunarity:2,persistence:0.5},
        heightMapper: getCenterModifier(getLinearRangeMapper(-1.8,2,-0.5,-0.5)),
        colourMapper: getColorChunk([
            [-0.2,[15,40,144]],
            [0,[39,71,144]],
            [0.1, [198,166,100]],
            [1, [11,102,35]]
        ]),
    })};
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