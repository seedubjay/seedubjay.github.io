---
layout: post
title: The Wikipedia Wormhole
subtitle: graph traversal
scripts: ['core', 'wikipedia-graph']
styles: ['wikipedia-graph']
use_d3: true
---

You can play a game on Wikipedia where you pick two random pages and you try to get from one to the other by making as few clicks as possible.

For example, you can get from [Pavlova](https://en.wikipedia.org/wiki/Pavlova_(cake)), a delightful Australian dessert, to [Time Further Out](https://en.wikipedia.org/wiki/Time_Further_Out), a rather obscure album from jazz pianist Dave Brubeck, in just 5 clicks: _Pavlova_ → _List of strawberry dishes_ → _Minnesota_ → _Judy Garland_ → _Dave Brubeck_ → _Time Further Out_.

If you've got an competitive streak, there's an [online game](https://www.thewikigame.com) too.

It begs the question though... **How many clicks do you _actually_ need?**

## Simplifying the problem
We don't care about every word on every Wikipedia page.

Instead, we can just think about all of Wikipedia's _pages_ and all of the _links_ from one page to the next. The term for this in mathematics is a **directed graph**. In fact, any collection of 'things' and connections between them can be thought of as a directed graph - road networks with one-way streets, family trees, the electricity grid, and so on. 

For example, here's a small subset of Wikipedia pages, with arrows indicating links between them.

<figure>
{% include svg.html id="svg1" width="300" height="300" %}
<figcaption>
    <p class="caption">Drag to move pages</p>
</figcaption>
</figure>

Doing this transformation is useful for two reasons.

First, picking the right way to represent data gives us _a new way to think about the problem_, and it often gives a hint about what to do next.

Second, converting our obscure problem into a well-known format gives us access to a wealth of research and algorithms to help us solve the problem.

Researchers have spent decades developing algorithms and well-tested code to analyse directed graphs. They may have been designed for a completely different purpose, but they work just as well for clicking through Wikipedia pages as they do for finding ancestors in a family tree, optimising trucking routes between cities, and lots of other unrelated problems. 

## Results

Wikipedia is _extremely big_, which makes it quite cumbersome to use. As a compromise, here is a calculator which will generate paths using only the [top 10,000 articles](https://en.wikipedia.org/wiki/Wikipedia:Vital_articles/Level/4). 

<figure>
<div class="route-query container">
    <div class="route-input row justify-content-center">
        {% assign choices = site.data.wikipedia-graph.route-options | sort: "label" %}
        <div class="col-10 col-sm-6 col-lg">
            <select id="route-start-picker">
                <option></option>
                {% for page in choices %}
                <option value="{{ page.id }}">{{ page.label }}</option>
                {% endfor %}
            </select>
        </div>
        <div class="col-10 col-sm-6 col-lg">
            <select id="route-end-picker">
                <option></option>
                {% for page in choices %}
                <option value="{{ page.id }}">{{ page.label }}</option>
                {% endfor %}
            </select>
        </div>
        <div class="w-100 d-sm-none"></div>
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

- download about 20GB of Wikipedia data,
- scan through ~20 million pages to find links,
- filter out all the redirect pages and other dud pages,
- transform ~220 million links into a graph format that is actually usable, and
- use any ol' path-finding algorithm to route to get you from one page to another

[In my case](https://github.com/seedubjay/wikipedia-graph) this takes about a week to write and 4 hours to compute...

So you might need to stall your friend when they ask to play.
