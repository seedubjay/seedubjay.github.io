---
layout: post
title: Making Machines Less Mechanical
scripts: ['core', 'perlin-noise']
image: '/assets/png/perlin-noise-thumbnail.png'
subtitle: Generating maps, clouds, blood and fire
---
Computers aren't very good at _blending in_. 

This issue crops up all the time - creating creatures in video games which move organically, creating a voice assistant (Siri, Alexa, etc...) which speaks with a natural-sounding cadence, or generating realistic clouds in the sky and rocks on the ground in an animated movie.

Alas, all of these problems are quite hard (and the focus of ongoing research) so we'll stick to something simpler. 

## Noise

A stream of unpredictable data is called _noise_. Static on a TV is noise in the truest sense of the word because every single waveform and pixel is completely random.

However, you could equally call the path of a drunk person trying to walk home 'noise' - they'll walk in vaguely the right direction, but there's no chance of guessing where any particular step will take them...

This second type of noise is much more interesting. By restricting the randomness, we can create interesting curves and shapes that are _unpredictable_ but _controllable_.

In 1983, Ken Perlin created a new type of noise called 'Perlin noise'. Just like a drunk person stumbling home, Perlin noise is random at every point, but there is an overall shape and cohesiveness to the random values. 

I'll admit, it does look a bit bizarre:

<figure>
{% include canvas.html id="canvas0" reload="light" %}
<figcaption>
<p class="caption">2D Perlin noise</p>
</figcaption>
</figure>

There are a few obvious properties to Perlin noise. The areas with 'extreme' values (i.e. very light or very dark patches) never last for long, and the grey sections fill the gaps in between. Importantly, these changes in colour always happen _gradually_, shifting from light to dark bit by bit.

Of course, there are also faults! If you reload the picture a few times, you might start to notice some odd blockiness and straight lines... But, as we'll see, these faults can be covered up.

The success of Perlin noise didn't just come from the noise it produced, but also from how fast it produced it. These little faults were a small price to pay for a fast algorithm, especially back in 1983 when computation was so slow and expensive.

## Octaves

Our eventual goal is to create noise which seems messy enough to seem natural. Perlin noise gets us close, but it ebbs and flows so consistently from value to value that it seems artificial. 

Why is this? The real world isn't consistent! It is sometimes smooth, sometimes jagged, and sometimes completely flat. To recreate this, we will add _octaves_ to the noise. 

The 0<sup>th</sup> octave is the original noise, like what we saw above. The 1<sup>st</sup> octave is identical, but shrunk to be _half the height_ (i.e. amplitude) and changing _twice as fast_ (i.e. frequency). Each sucessive octave does the same, so the 4<sup>th</sup> octave is only 1/16<sup>th</sup> the height and changing 16 times faster than the original noise.

These octaves are all 'added together' to create noise that can both change huge amounts very slowly, but also change in tiny fractions frequently.

You can see what different combinations look like here:

<figure>
{% include canvas.html id="canvas2" reload="dark" %}
<div class="overlay overlay-top overlay-right">
    <div class="btn-group">
    {% for i in (0..4) %}
    <button type="button" class="btn btn-secondary btn-sm no-focus" data-toggle="button" aria-pressed="{% if i==0 or i==2 %}true{% else %}false{% endif %}" onclick="toggle_button_canvas2({{ i }})">{{ i }}</button>
    {% endfor %}
    </div>
</div>
<figcaption>
<p class="caption">Toggle octaves in the noise</p>
</figcaption>
</figure>

Even simple noise like this is already useful. For instance, you can begin to replicate hand-drawn sketches by adding noise to each line:

<figure>
{% include canvas.html id="canvas6" reload="dark" %}
<figcaption>
    <input type="range" min="0" max="1" value=".4" step="0.01" class="slider" id="canvas6-slider">
    <p class="caption">Adjust the messiness of the sketch</p>
</figcaption>
</figure>

And what makes Perlin noise so exciting is that it works just as well in 2D!

<figure>
{% include canvas.html id="canvas7" width="400" reload="light" %}
<div class="overlay overlay-top overlay-right">
    <div class="btn-group">
    {% for i in (0..4) %}
    <button type="button" class="btn btn-light btn-sm no-focus" data-toggle="button" aria-pressed="{% if i == 0 %}true{% else %}false{% endif %}" onclick="toggle_button_canvas7({{ i }})">{{ i }}</button>
    {% endfor %}
    </div>
</div>
<figcaption>
<p class="caption">Toggle octaves in the noise</p>
</figcaption>
</figure>

Perlin noise is a powerful tool once we start modifying octaves and many of its other parameters. With minimal effort, we can start creating new textures and designs.

## Colour palettes

We may have a grid of noise, but how are we actually visualising it? Behind the scenes, the Perlin noise algorithm produces a value between 0 and 1 for every pixel in the image. It's then up to us to define how that value should be turned into a colour, like a 'colour palette' of sorts. For instance, up until now we've been turning 0s into black, 1s into white, and blending everything in between. But now, we're going to try convert our noise into a set of islands. Here's our new colour palette:

<figure>
    {% include canvas.html id="canvas4a" class="no-outline" width="800" height="30" %}
    <figcaption><p class="caption">Greyscale colour palette</p></figcaption>
    {% include canvas.html id="canvas4c" class="no-outline" width="800" height="30" %}
    <figcaption><p class="caption">Islands colour palette</p></figcaption>
</figure>

And so by simply swapping one colour palette out for another, we can create this:

<figure>
{% include canvas.html id="canvas1" reload="light" class="interactive" %}
<figcaption><p class="caption">Hover/drag to reveal underlying noise</p></figcaption>
</figure>

The colour palette can also interact with space and time in complex ways. For instance, we can adjust the colour palette for pixels further away from the centre of the map so that more and more noise is converted into water closer to the edges.

<figure>
    {% include canvas.html id="canvas3a" width="400" reload="light" %}
    {% include canvas.html id="canvas3b" class="no-outline" width="800" height="150" %}
<figcaption>
    <input type="range" min="0" max="1" value=".3" step="0.01" class="slider" id="canvas2-slider">
    <p class="caption">Adjust the colour palettes further from the center</p>
</figcaption>
</figure>


## More colour palettes

With some slight changes to the terrain generation colour palettes, we can so much more.

<figure>
    {% include canvas.html id="canvas8" reload="dark" class="interactive" %}
    <figcaption><p class="caption">Clouds (hover/drag to reveal underlying noise)</p></figcaption>
</figure>

<figure>
    {% include canvas.html id="canvas9" reload="dark" class="interactive" %}
    <figcaption><p class="caption">Veins (hover/drag to reveal underlying noise)</p></figcaption>
</figure>

<figure>
{% include canvas.html id="canvas10" width="200" %}
<figcaption><p class="caption">Fire (hover/hold for animation)</p></figcaption>
</figure>

Of course, none of these demos look exactly like what they're trying to imitate... but perhaps it's a little alarming that they're already pretty close. This is especially useful in films and video games where you only have a split second to judge the realism of gravel on the ground or the shape of the shoreline.

And there is something beautiful about this -- the 'best' noise is not necessarily the noise which mimics life most accurately; instead, it is the algorithm which _runs fastest and gets the job done_. Frankly, it's a computer scientist's dream...