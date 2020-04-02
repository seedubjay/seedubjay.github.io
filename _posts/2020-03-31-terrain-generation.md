---
layout: post
title: Terrain Generation
subtitle: Making machines less mechanical
scripts: ['core', 'perlin', 'terrain-generation']
---
## Perlin noise
<figure>
{% include canvas.html id="canvas2" reload="dark" height="500" %}
<div class="overlay overlay-top overlay-right">
    <div class="btn-group">
    {% for i in (0..4) %}
    <button type="button" class="btn btn-secondary btn-sm no-focus active" data-toggle="button" aria-pressed="true" onclick="toggle_button_canvas2({{ i }})">{{ i }}</button>
    {% endfor %}
    </div>
</div>
<figcaption>
<p class="caption">Add or remove octaves from the noise</p>
</figcaption>
</figure>


<!-- ## 2D stacked noise
<figure>
{% include canvas.html id="canvas0" reload="light" interactive="" %}
</figure> -->

<figure>
<div class="canvas-group canvas-group-2">
    {% include canvas.html id="canvas3a" width="300" height="300" reload="light" %}
    {% include canvas.html id="canvas3b" width="400" height="400" %}
</div>
<figcaption>
    <input type="range" min="0" max="1" value=".4" step="0.01" class="slider" id="canvas2-slider">
</figcaption>
</figure>

<figure>
{% include canvas.html id="canvas1" reload="light" interactive="" %}
<figcaption><p class="caption">Hover to reveal the underlying height map</p></figcaption>
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