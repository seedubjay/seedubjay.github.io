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

<figure>
{% include svg.html id="svg1" width="300" height="300" %}
<figcaption>
    <p class="caption">Each arrow represents a link from one page to another</p>
</figcaption>
</figure>

Doing this transformation is useful for two reasons.

First, picking the right way to represent data gives us _a new way to think about the problem_, and it often gives a hint about what to do next.

Second, converting our obscure problem into a well-known format gives us access to a wealth of research and algorithms to help us solve the problem.

Researchers have spent decades developing algorithms and well-tested code to analyse directed graphs. They may have been designed for a completely different purpose, but they work just as well for clicking through Wikipedia pages as they do for finding ancestors in a family tree, optimising trucking routes between cities, and lots of other seemingly unrelated problems. 

## Results
One of these algorithms is called a [Breadth-First Search (BFS)](https://en.wikipedia.org/wiki/Breadth-first_search). 

For instance, here are answers to the questions at the top of the article:
- _Ryan Reynolds_ → _Nickelodeon_ → _France_ → _Battle of Waterloo_
- _A-ha_ → _NTSC_ → _EIA-608_ → _Exclamation mark_

## Going further

Our BFS algorithm found routes that seem almost too quick to be true. Surely most routes between pages would take more clicks?

Luckily, not only could we 'borrow' code for the BFS algorithm, we can borrow much more to visualise exactly what we care about. And the results are awesome:

<figure>
{% include canvas.html id="canvas1" interactive="" %}
</figure>

In fact, on average, you only need _5 clicks_ to get from any page to any other on Wikipedia.

## Conclusion

So, if a friend ever challenges you to the 'Wikipedia Game', you'll have the upper hand! All you need to do is:

- download about 20GB of Wikipedia data,
- scan through ~20 million pages to find links,
- filter out all the redirect pages and other dud pages,
- transform ~220 million links into a graph format that is actually usable, and
- use any ol' path-finding algorithm to route to get you from one page to another

[In my case](https://github.com/seedubjay/wikipedia-graph) this takes about a week to write and 4 hours to compute...

So you might need to stall your friend when they ask to play.
