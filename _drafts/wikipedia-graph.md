---
layout: post
title: The Wikipedia Wormhole
subtitle: graph traversal
scripts: ['core', 'wikipedia-graph']
styles: ['wikipedia-graph']
use_d3: true
---

You can play a game on Wikipedia where you pick two random pages and you try to get from one to the other by making as few clicks as possible.

For example, you can get from _Pavlova_, an Australian dessert, to _Time Further Out_, an album by jazz pianist Dave Brubeck, in just 5 clicks: {% assign path = site.data.wikipedia-graph.example -%}
{%- for page in path -%}
    [{{page}}](https://en.wikipedia.org/wiki/{{page | replace: " ","_" | url_encode}})
    {%- if page != path.last %} → {% endif -%}
{%- endfor %}.

If you've got an competitive streak, there's an [online game](https://www.thewikigame.com) too.

It begs the question though... **How many clicks do you _actually_ need?**

## Simplifying the problem
We don't care about every word on every Wikipedia page. Instead, we can just think about all of Wikipedia's _links_ from one page to the next.

The term for this in mathematics is a _directed graph_. In fact, any collection of 'things' and connections between them can be thought of as a directed graph - cross-country road networks, family trees, the electricity grid, etc. 

For example, we can visualise a small group of Wikipedia pages and the links from each to the next like this:

<figure>
{% include svg.html id="svg1" width="300" height="300" %}
<figcaption>
    <p class="caption">Drag to move pages</p>
</figcaption>
</figure>

Doing this transformation is useful for two reasons.

First, picking the right way to represent data gives us _a new way to think about the problem_. Essentially, thinking about lots of dots and arrows is easier than thinking about pages upon pages of Wikipedia text.

Second, converting our obscure problem into a well-known format gives us access to a wealth of research and algorithms to help us solve the problem.

Researchers have spent decades developing algorithms and well-tested code to analyse directed graphs. They may have been designed for a completely different purpose, but they work just as well for navigating Wikipedia pages as they do for finding ancestors in a family tree, optimising trucking routes between cities, and lots of other unrelated problems. 

## Traversing Wikipedia

There are **6,148,503 pages of content** on Wikipedia. 

Of these pages, **5,548,826 pages are all connected together by links**. This means that any page in this group can reach any other just with clicks. (The technical term for this is the 'largest connected component')

Remarkably, if you pick any two of these pages it will take only **5 clicks on average to get from one page to the other**. In fact, there's an **over 99.93% chance that you can get from one page to the other in 7 clicks or less**.

<figure>
{% include svg.html id="svg2" class="no-outline svg-chart" %}
<!-- <figcaption>
    <p class="caption">Drag to move pages</p>
</figcaption> -->
</figure>

What happens in the final 0.07% of paths though? 

We are getting into the backwaters of Wikipedia here. In the very worst case, **68 clicks are required to get from one page to another**. There are many of starting pages that can achieve this, but only one target page... Yes, as you've probably guessed already, it's the [1930 São Paulo FC season](https://en.wikipedia.org/wiki/1930_S%C3%A3o_Paulo_FC_season). 

Why? Here's an excerpt of the 68 glorious clicks to get there when starting at [No Guru, No Method, No Teacher](https://en.wikipedia.org/wiki/No_Guru,_No_Method,_No_Teacher), Van Morrison's 16th studio album:

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

## Shortcuts

Wikipedia is a naturally evolving platform, written and rewritten by human writers. So how could they have possibly created such an enormous network which is so closely connected?

Another tool we can use to measure this directed graph is calculating each page's _betweenness centrality_. This value represents how often some random journey between two pages will 'pass through' our current page. The higher a page's betweenness centrality, the more central it is in the network, and the more pivotal it is to Wikipedia's tight connectivity.

<figure>
{% include svg.html id="svg2" class="no-outline svg-chart" %}
<!-- <figcaption>
    <p class="caption">Drag to move pages</p>
</figcaption> -->
</figure>

## Find your own paths

Wikipedia is _extremely big_, which makes it quite cumbersome to use. As a compromise though, this is a calculator which will generate paths using only the [top 10,000 articles on Wikipedia](https://en.wikipedia.org/wiki/Wikipedia:Vital_articles/Level/4).

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

## Conclusion

So, if a friend ever challenges you to the 'Wikipedia Game', you'll have the upper hand! All you need to do is:

1. download about 20GB of Wikipedia data,
1. scan through ~20 million pages to find links,
1. filter out all the redirect pages and other dud pages,
1. transform ~220 million links into a graph format that is actually usable, and
1. use any ol' path-finding algorithm to find a route to get you from one page to another

[In my case](https://github.com/seedubjay/wikipedia-graph) this takes about 4 hours...

So you might need to stall for a while.

---

`Analysis is current as of September 1st 2020`