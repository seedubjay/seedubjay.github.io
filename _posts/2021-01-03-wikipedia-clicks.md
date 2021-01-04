---
layout: post
title: Beating the Wikipedia Game
scripts: ['core', 'wikipedia-clicks']
styles: ['wikipedia-clicks']
use_d3: true
image: "/assets/png/wikipedia-clicks-thumbnail.png"
subtitle: solving the world's non-issues one program at a time
sitemap: false
---

Here's a game to pass the time while you're trapped at home 10 months into a pandemic. 

Pick two random pages on Wikipedia -- your goal is to get from one to the other in _as few clicks as possible_. (Using the box full of links at the bottom of the page is cheating...)

For example, you can get from _Kangaroo_ to _Dave Brubeck_ (a jazz pianist) in just 3 clicks: {% assign path = site.data.wikipedia-graph.example -%}
{%- for page in path -%}
    [{{page}}](https://en.wikipedia.org/wiki/{{page | replace: " ","_" | url_encode}})
    {%- if page != path.last %} → {% endif -%}
{%- endfor %}.

There's an [online game](https://www.thewikigame.com) too for those with a competitive streak.

There are over 6.2 million English Wikipedia articles, but this ecosystem is remarkably well connected. In fact, when you randomly pick two pages, there's an 82.1% chance that you'll be able to get from one to the other in 5 clicks or less, assuming that it's possible in the first place.

Dont believe me? Pick any two pages here and see the shortest sequence of clicks you'd need to get between them. 

<figure>
<div class="route-query container">
    <div class="route-input row justify-content-center">
        <div class="col-10 col-lg-6">
            <select id="route-start-picker" class="route-picker">
                <option></option>
            </select>
        </div>
        <div class="col-10 col-lg-6">
            <select id="route-end-picker" class="route-picker">
                <option></option>
            </select>
        </div>
        <div class="col-auto">
            <button id="route-submit" class="btn btn-success" type="submit" onclick="submit_route_request()">Search</button>
        </div>
    </div>
    <div class="route-output"></div>
</div>
<!-- <figcaption>
    <p class="caption">Find a path from one page to another.</p>
</figcaption> -->
</figure>

_Pages which are 'obscure' (i.e. contain less than 20 links or are linked to by less than 20 other pages) have been excluded here for efficiency's sake._

## Breaking down the problem

The sheer volume of Wikipedia is remarkable, but also makes it challenging to analyse since it is so unwieldy. This is especially true for a task like finding a shortest sequence of clicks, as you may have to consider the entirety of Wikipedia all in one go to guarantee that you've found the shortest of all possible sequences.

To overcome this, we have to break the problem down.

We don't care about every word on every Wikipedia page. Instead, we can just think about all of Wikipedia's _links_ from one page to the next.

The term for this in mathematics is a _directed graph_. In fact, any collection of 'things' and connections between them can be thought of as a directed graph - cross-country road networks, family trees, the electricity grid, etc. 

For example, we can visualise a small group of Wikipedia pages and the links from each to the next like this:

<figure>
{% include svg.html id="svg1" width="320" height="240" %}
<figcaption>
    <p class="caption">Drag to move pages</p>
</figcaption>
</figure>

Doing this transformation is useful for two reasons.

First, picking the right way to represent data gives us _a new way to think about the problem_. In other words, thinking about lots of dots and arrows is easier than thinking about pages upon pages of Wikipedia text.

Second, converting our obscure problem into a common mathematical format gives us access to a wealth of research and algorithms to help us solve the problem.

Researchers have spent decades developing algorithms and writing code to analyse directed graphs. They may have been designed for a completely different purpose, but they work just as well for navigating Wikipedia pages as they do for finding ancestors in a family tree, optimising trucking routes between cities, and lots of other unrelated problems, since they are all directed graphs under the hood.

We can use this existing knowledge to find our shortest paths and analyse our data in a whole new set of ways.

## More tidbits

Not only is there a 82% chance that you'll be able to get from one page to another in at most 5 clicks, there's a **99.3% chance you'll be able to do it in 7 clicks**, assuming that it's possible in the first place.

<figure>
{% include svg.html id="svg2" class="no-outline svg-chart" %}
<!-- <figcaption>
    <p class="caption">Drag to move pages</p>
</figcaption> -->
</figure>

The final 0.7% of paths gets pretty dicey though -- in the very worst case, **48 clicks are required**. There are many starting pages that can achieve this, but only one ending page... Yes, as you've probably already guessed, it's the [1948–49 FC Dinamo București season](https://en.wikipedia.org/wiki/1948–49_FC_Dinamo_București_season). 

Why? Here's an excerpt of the 48 glorious clicks to get there when starting at [Nong Khai railway station](https://en.wikipedia.org/wiki/Nong_Khai_railway_station), a railway station on the border between Thailand and Laos:

{% assign path = site.data.wikipedia-graph.longest-path %}
{% for page in path -%}
    {%- if page == "..." -%}{{page}}
    {%- else -%}[{{page}}](https://en.wikipedia.org/wiki/{{page | replace: " ","_" | url_encode}})
    {%- endif -%}
    {%- if page != path.last %} → {% endif -%}
{%- endfor %}

Spot the pattern?

Ironically, the journey back is completely average, taking just 5 clicks:

{% assign path = site.data.wikipedia-graph.reverse-longest-path %}
{% for page in path -%}
    {%- if page == "..." -%}{{page}}
    {%- else -%}[{{page}}](https://en.wikipedia.org/wiki/{{page | url_encode}})
    {%- endif -%}
    {%- if page != path.last %} → {% endif -%}
{%- endfor %}

Another tool we can use to measure this directed graph is the _betweenness centrality_ of each page. This value represents the likelihood that a page gets used in a path between two other randomly chosen pages in the graph. The higher a page's betweenness centrality, the more central it is in the network, and the more pivotal it is to Wikipedia's tight connectivity.

<figure>
{% include svg.html id="svg3" width="320" height="400" class="no-outline svg-chart" %}
</figure>

Curiously, the shortest path between pages very often involves a country. (You'll probably notice this if you try enough pages in the search panel above.) In fact, the page for the United States is so common that some variations of the Wikipedia Game ban the page entirely. 

So, if a friend ever challenges you to the Wikipedia Game, you'll have the upper hand! All you need to do is:

1. download about 20GB of Wikipedia data,
1. scan through ~20 million pages to find links,
1. filter out all the redirect pages and other dud pages,
1. transform ~220 million links into a graph format that is actually usable, and
1. use any ol' path-finding algorithm to find a route to get you from one page to the other

In my case processing this takes about 6 hours... So you might need to stall for a while.

(Or, you could just secretly check this page and use the search panel instead...)

<div class="footnotes">

<p>Analysis is current as of 20 December 2020.</p>

<p>
It's probably worth noting that my system is far from perfect. For instance, it ignores the big boxes full of links at the bottom of most Wikipedia pages (a) because it makes the game much less interesting and (b) because they are really annoying to track.<p>

<p>The betweenness centrality ranking is also an estimate since the exact calculation would take a few months to compute fully.</p>

<p>I'm sure there's some other stuff missing too... but I guess we'll just never know for sure, will we.</p>

</div>