---
layout: post
title: Why Does JPEG Look So Weird?
scripts: ['core', 'jpeg-visualisation']
styles: ['jpeg-visualisation']
image: '/assets/png/mare-artifact-fade.png'
thumbnail: '/assets/png/mare-artifact-fade-thumbnail.png'
subtitle: JPEGiness
sitemap: false
---

<span id="download-text">
In the second or so before this page loaded, your device was downloading everything it would need like the background colour, all the icons, and this text you're currently reading.
</span>

Oh, and this delightful picture of a macaw --

<figure>
<img id="download-image" src="/assets/jpg/macaw-compressed.jpg" alt="Macaw" class="diagram">
</figure>

This image is really just a grid of tiny dots of colour ('pixels') -- a combination of red light (R), green light (G) and blue light (B) which each take up a tiny slice ('byte') of your device's memory.

It is 1920 pixels wide and 1280 pixels tall, which comes to a grand total of 7,372,800 bytes, or ~7.4MB (megabytes).

But, if you were to actually look at what your device just downloaded, it only received **less than 4% of the amount of data it should have required**. But somehow, it still managed to reassemble the entire image.

This is all due to the wonderful world of _compression_.

Without it, listening to an hour of music on Spotify would use over a gigabyte of data, and watching a movie on Netflix **would use over 1000 gigabytes** (a terabyte).

In the case of the macaw, it has been compressed using JPEG, which combines the biology of the human eye with some computational trickery to throw away as much extraneous data as possible. It then stuffs the bare essentials of the image into a tiny package to get the remarkable 96% reductions and beyond.

Here are a few of the ideas that make JPEG tick.

### Representations of colour

<!-- <figure id="colour-sliders">
<div class="figure-group figure-group-3">
<div>
    <div class="colour-slider" id="colour-slider-r">
    <div>R = <span>50</span></div>
    <input type="range" min="0" max="255" value="80">
    </div>
    <div class="colour-slider" id="colour-slider-g">
    <div>G = <span>50</span></div>
    <input type="range" min="0" max="255" value="80">
    </div>
    <div class="colour-slider" id="colour-slider-b">
    <div>B = <span>50</span></div>
    <input type="range" min="0" max="255" value="80">
    </div>
</div>
{% include canvas.html id="canvas6" width="160" height="160" class="no-outline" %}
<div>
    <div class="colour-slider" id="colour-slider-y">
    <div>Y = <span>50</span></div>
    <input type="range" min="0" max="255" value="80">
    </div>
    <div class="colour-slider" id="colour-slider-cb">
    <div>Cb = <span>50</span></div>
    <input type="range" min="0" max="255" value="80">
    </div>
    <div class="colour-slider" id="colour-slider-cr">
    <div>Cr = <span>50</span></div>
    <input type="range" min="0" max="255" value="80">
    </div>
</div>
</div>
<figcaption class="caption">
RGB and YCbCr can both represent
</figcaption>
</figure> -->

Our eyes perceive the world in red, green and blue. The photoreceptive cones in our eyes are tuned to these three colours, so it makes sense for computers to display pixels in a similar way. 

In fact, it is often easier to think of a multicolour image as three distinct images (known as 'channels'), each targeting a different type of cone in our eye.

<figure>
{% include canvas.html id="canvas7"%}
<div class="overlay overlay-top overlay-right">
    <div class="btn-group">
    {% assign labels = "R G B" | split: " " %}
    {% for i in (0..2) %}
    <button type="button" class="btn btn-light btn-secondary btn-sm no-focus" data-toggle="button" aria-pressed="{% if i==0 or i==2 %}true{% else %}false{% endif %}" onclick="toggle_button_canvas7({{ i }})">{{ labels[i] }}</button>
    {% endfor %}
    </div>
</div>
<figcaption>
<p class="caption">Toggle the R, G and B channels of the image</p>
</figcaption>
</figure>

However, this does not mean we have to _store_ the image in red, green and blue as well.

Instead, can represent each colour using somewhat perculiar channels called _luminance_ (Y), _blue-difference chroma_ (C<sub>b</sub>), and _red-difference chroma_ (C<sub>r</sub>).

<figure>
{% include canvas.html id="canvas8"%}
<div class="overlay overlay-top overlay-right">
    <div class="btn-group">
    {% assign labels = "Y C<sub>b</sub> C<sub>r</sub>" | split: " " %}
    {% for i in (0..2) %}
    <button type="button" class="btn btn-light btn-secondary btn-sm no-focus" data-toggle="button" aria-pressed="{% if i==0 or i==2 %}true{% else %}false{% endif %}" onclick="toggle_button_canvas8({{ i }})">{{ labels[i] }}</button>
    {% endfor %}
    </div>
</div>
<figcaption>
<p class="caption">Toggle the Y, C<sub>b</sub> and C<sub>r</sub> channels of the image</p>
</figcaption>
</figure>

But why bother?

We don't gain or lose any detail in the picture by making this transformation.

However, you may notice that the luminance (Y) channel, which represents the image's _brightness_, has the largest impact on the details of the picture by far. This makes sense, as shadows, lighting and texture in the real world rarely change a material's true colour -- only its brightness.

Our eyes are also especially attuned to changes in brightness due to evolution. Noticing changes in brightness has helped us find camouflaged prey and spot the shadows of predators in our periphery for thousands of years. 

With this in mind, JPEG prioritises brightness details far above changes in colour.

For instance, instead of assigning every pixel its own colour, it can assign an entire region the same colour, saving space. Or, it can reduce the number of displayable colours from its usual number - over 16 million distinct colours - down to only a few hundred possibilities.

As long as the luminance channel stays intact, humans will still have a fairly good idea what they are looking at.

### Getting help from the neighbours

When humans look at the world, we don't see pixels and colour channels -- we see contiguous chunks of colour and shape. We see the smooth gradients of blue in the sky and grey repeating patterns of concrete beneath our feet. 

Ironically, when we're interested in compression, pixels are almost _the worst possible way to represent this_. 

If we simply stored pixels one-by-one, an entirely random grid of colours would take just as much space as a picture of a sunset:

<figure>
<div class="figure-group figure-group-2">
{% include canvas.html id="canvas9a" width="256" height="256" %}
<!-- <img id="download-image" src="/assets/jpg/sunset-square-64-as-256.jpg" alt="Sunset" class="diagram"> -->
{% include canvas.html id="canvas9b" width="256" height="256" %}
</div>
<figcaption class="caption">These images contain the exact same number of pixels with the same level of detail in each</figcaption>
</figure>

But in the real world, colours change gradually and form repeating patterns. We can exploit this to store large chunks of the image as single entities using very little data. 

JPEG accomplishes this by splitting the image up into 8x8 squares of pixels, and applying a _discrete cosine transform_.

Properly explaining the transform requires a lot of calculus and something called [Fourier analysis](https://en.wikipedia.org/wiki/Fourier_analysis). But if you were to make it through all of the maths, you'd end up with a very curious result.

It just so happens that _every 8x8 grid of pixels can be represented by a combination of these 64 8x8 patterns_:

<figure>
{% include canvas.html id="canvas3" width="376" height="376" class="no-outline" %}
</figure>

For example, take this 8x8 chunk from the macaw (downscaled for clarity):

<figure>
{% include canvas.html id="canvas10a" %}
</figure>

<figure>
<div class="figure-group figure-group-2">

{% include canvas.html id="canvas10b" width="256" height="256" %}
{% include canvas.html id="canvas10c" width="256" height="256" %}
</div>
</figure>

<figure>
<div class="figure-group figure-group-2">
{% include canvas.html id="canvas0" width="256" height="256" %}
{% include canvas.html id="canvas1" width="256" height="256" %}
</div>
<figcaption>
    <input type="range" min="0" max="100" value="80" step="5" class="slider" id="canvas1-slider">
    <p class="caption">Adjust the messiness of the sketch</p>
</figcaption>
</figure>

<figure>
<div class="figure-group figure-group-2">
{% include canvas.html id="canvas4a" width="256" height="256" %}
{% include canvas.html id="canvas4b" width="256" height="256" %}
</div>
<figcaption>
    <input type="range" min="0" max="100" value="80" step="5" class="slider" id="canvas4-slider">
    <p class="caption">Adjust the messiness of the sketch</p>
</figcaption>
</figure>


<figure>
<img src="/assets/png/mare-artifact-fade.png" alt="Mare with JPEG artifacts" class="diagram">
</figure>