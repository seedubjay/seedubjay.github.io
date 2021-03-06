---
layout: post
title: Why Does JPEG Look So Weird?
scripts: ['core', 'jpeg-visualisation']
styles: ['jpeg-visualisation']
image: '/assets/png/mare-artifact-fade.png'
thumbnail: '/assets/png/mare-artifact-fade-thumbnail.png'
subtitle: How to turn a lot of data into a lot less
sitemap: false
related: ['perlin-noise', 'internet-tracking']
---

<span id="download-text">
In the second or so before this page loaded, your device was downloading everything it needed like the background colour, all the icons, and this text you're currently reading.<br><br>Oh, and this delightful picture of a macaw --</span>

<figure>
<img id="download-image" src="/assets/jpg/macaw-compressed.jpg" alt="Macaw" class="diagram">
</figure>

A digital image is really just a grid of tiny dots ('pixels'). Each is a combination of red light (R), green light (G) and blue light (B) which can combine to create any colour imaginable.

This image of a macaw is 1920 pixels wide and 1280 pixels tall, which comes to a grand total of 2,457,600 pixels. But, if you were to actually look at what your device just downloaded, it received **less than 4% of the data it should have needed** for those ~2.5 million pixels.

This is all due to the wonderful world of _compression_.

Without it, listening to an hour of music on Spotify would use **over a gigabyte of data**, and watching a movie on Netflix would use **over a terabyte** (1000 gigabytes).

In the case of the macaw, it has been compressed using _JPEG_, an extremely widespread image compression format. 

JPEG combines the biology of the human eye with some computational trickery to throw away as much extraneous data from the image as possible. It then stuffs the bare essentials of the image into a tiny package to get its remarkable 96% reductions and beyond.

Here are a few of the ideas that make JPEG tick.

### Representations of colour

Our eyes perceive the world in red, green and blue. The human eye is filled with photoreceptive 'cones'. Each is tuned to one of these three colours, so it makes sense for computers to display pixels in a similar way. 

In fact, it is often easier to think of a colourful picture as _three entirely distinct images_ (known as 'channels'), each targeting a different type of cone in our eye.

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
<p class="caption">Toggle the red (R), green (G) and blue (B) channels of the image</p>
</figcaption>
</figure>

However, this does not mean we have to _store_ the image in red, green and blue as well.

Instead, we can represent each colour using somewhat perculiar channels called _luminance_, _blue-difference chroma_, and _red-difference chroma_.

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
<p class="caption">Toggle the luminance (Y), blue-difference chroma (C<sub>b</sub>), and red-difference chroma (C<sub>r</sub>) channels of the image</p>
</figcaption>
</figure>

But why bother?

We don't gain or lose any detail in the picture by splitting up into a different set of channels.

However, you may notice that the luminance channel, which represents the image's _brightness_, has the largest impact on the details of the picture by far. This makes sense, as shadows, lighting and texture in the real world rarely change a material's true colour -- only how bright it seems to your eye.

Our eyes are also especially attuned to changes in brightness through evolution -- it has helped us find camouflaged prey and spot the shadows of predators in our periphery for thousands of years. 

With this in mind, JPEG prioritises brightness details far above changes in colour.

For instance, instead of assigning every pixel its own colour, it can assign an entire region a single hue with only its brightness ever changing, saving space. Or, it can reduce the number of displayable colours from its usual number - over 16 million distinct colours - down to only a few thousand possibilities, which requires much less space to store.

As long as the luminance channel stays intact, we will always have a fairly good idea what we are looking at.

### Getting help from the neighbours

When we look at the world, we don't see pixels and colour channels -- we see contiguous chunks of colour and shape. We see the smooth gradients of blue in the sky and the repeating patterns of grass and concrete. 

Ironically, when we're interested in compression, pixels are almost _the worst possible way to represent this_. 

If we simply stored pixels one-by-one, an entirely random grid of colours would take just as much space as a picture of a sunset.

<figure>
<div class="figure-group figure-group-2">
{% include canvas.html id="canvas9a" width="256" height="256" %}
<!-- <img id="download-image" src="/assets/jpg/sunset-square-64-as-256.jpg" alt="Sunset" class="diagram"> -->
{% include canvas.html id="canvas9b" width="256" height="256" %}
</div>
</figure>

But in the image of the sunset, colours change gradually and form repeating patterns. We can exploit this to store whole chunks of the image all as one unit. 

JPEG accomplishes this by splitting the image up into 8x8 chunks of pixels, and applying something called a _discrete cosine transform_.

Properly deriving the transform requires a lot of calculus and something called [Fourier analysis](https://en.wikipedia.org/wiki/Fourier_analysis). But if you were to make it through all of the maths, you'd end up with a very curious result.

It just so happens that _any 8x8 chunk of pixels can be converted into a combination of these 64 patterns_:

<figure>
{% include canvas.html id="canvas3" width="376" height="376" class="no-outline" %}
</figure>

For example, take one 8x8 chunk of pixels from this cat wearing a rather fetching scarf:

<figure>
{% include canvas.html id="canvas10a" %}
</figure>

Instead of storing each of these pixels individually, we can represent the whole chunk by layering together just a few of the above patterns.

<figure>
<div class="figure-group figure-group-2">
{% include canvas.html id="canvas10b" width="256" height="256" class="no-outline" %}
{% include canvas.html id="canvas10c" width="256" height="256" class="no-outline" %}
</div>
<figcaption>
    <input type="range" min="1" max="64" value="20" step="1" class="slider" id="canvas10-slider">
    <p class="caption">Adjust how many patterns get layered together</p>
</figcaption>
</figure>

Crutially, _not all patterns are created equal_ -- some of the patterns change the brightness and colour of the chunk enormously, while others' make almost no difference at all.

Furthermore, the patterns which matter most (the patterns which the slider keeps around for longest) always seem to be clumped towards the top-left of the pattern grid. Not only this is true for this 8x8 chunk, but for _almost any other 8x8 chunk from any picture taken in the real world_. The world is rarely unpredictable enough to need any of the very complex patterns found in the bottom-right of the pattern grid.

This becomes even clearer when we do the same conversion on a completely random 8x8 chunk -- we do not get any of the clumping like we would expect for a photo of the real world, as there are no patterns or relationships between neighbouring pixels to be exploited.

<figure>
<div class="figure-group figure-group-2">
{% include canvas.html id="canvas11b" width="256" height="256" class="no-outline" reload="light" %}
{% include canvas.html id="canvas11c" width="256" height="256" class="no-outline" %}
</div>
<figcaption>
    <input type="range" min="1" max="64" value="40" step="1" class="slider" id="canvas11-slider">
    <p class="caption">Adjust how many patterns get layered together</p>
</figcaption>
</figure>

JPEG relies on this property of real-world images to throw away as much extraneous data as possible. It can 'turn off' the bottom-right patterns entirely when they are not not doing anything useful to save space, and prioritise the patterns from the top-left instead. 

### Infinite possibilities

JPEG gives users complete control when they want to compress a picture.

They can choose how much to prioritise luminance (brightness) over the other colour channels. They can choose how much to prioritise the top-left of the pattern grid over the bottom-right. They can choose how precisely each of those patterns' brightnesses and hues can be adjusted (in a process called 'quantisation').

These settings all impact how much the JPEG will be compressed, and how true to the original image the compressed version will be.

<figure>
<div class="figure-group figure-group-2">
{% include canvas.html id="canvas0" width="256" height="256" %}
{% include canvas.html id="canvas1" width="256" height="256" %}
</div>
<figcaption>
    <input type="range" min="0" max="100" value="80" step="5" class="slider" id="canvas1-slider">
    <p class="caption">Adjust the compression of the macaw</p>
</figcaption>
</figure>

In fact, there are so many ways to adjust these settings in JPEG that **we are still discovering even better ones**.

[In 2017, Google introduced a new encoder](https://ai.googleblog.com/2017/03/announcing-guetzli-new-open-source-jpeg.html) which uses an artificial intelligence (AI) to select all of these settings automatically, and it beat the industry-standard human-programmed encoders **by over 35%**. 

And while this pursuit has spanned _almost two decades now_, we will likely never find a truly optimal system. 

Why? While most problems have clear answers, JPEG is unique. It is trying to be an answer to a question so utterly human that it can be argued about for days, weeks, years or decades --

<figure>
<img src="/assets/png/mare-artifact-fade.png" alt="Mare with JPEG artifacts" class="diagram">
</figure>

_"Does that picture look a bit weird or is it just me?"_
