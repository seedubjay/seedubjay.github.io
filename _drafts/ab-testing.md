---
layout: post
title: Life as a Lab Rat
scripts: ['core', 'internet-tracking']
styles: ['internet-tracking']
use_d3: true
image: "/assets/jpg/lab-rat.jpg"
thumbnail: "/assets/jpg/lab-rat-thumbnail.jpg"
subtitle: How websites are experimenting on you with A/B tests
---

Who's to say all the visitors to a website need to be shown the same website?

Instead, every visit can be an opportunity to experiment on users in a process called _A/B testing_. 

Let's say you're designing a new website and you want to put an advertisement in a spot which will be clicked on most often. Instead of surveying your users explicitly, you can run a simple experiment:
1. Split your users into group A and group B
1. Show each half different versions of the website which have the advertisement in different positions
1. Track each group's clicks to determine which version produces the most ad clicks

A/B testing can be used to optimise something simple like font sizes or the spacing between paragraphs, or optimise something less tangible like the addictiveness of a feed, what tone and phrasing to use in emails to users, or how long to set the timer for a _"Limited time only!"_ shop discount.

This type of experimentation runs rampent on almost any large website on the internet. Social media giants [like LinkedIn](https://dl.acm.org/doi/pdf/10.1145/2783258.2788602) run hundreds of experiments per day, and can experiment on users according to their language, location, social group and more.

And unlike research in a university, **no ethics board or regulator is required to approve or monitor these experiments**.


<figure>
<img src="/assets/jpg/lab-rat.jpg" alt="Lab rat" class="diagram">
<figcaption class="caption">
<!-- <p class="caption"> -->
Ironically, psychology experiments on literal lab rats have more regulations to follow than ones on people using social media websites
<!-- </p> -->
</figcaption>
</figure>

For instance, [Facebook conducted an experiment](https://www.pnas.org/content/pnas/111/24/8788.full.pdf) on almost 700,000 users for a week in 2012 by deliberately removing either happy or sad posts from the feeds of subjects to see how it would influence what they wrote in Facebook posts later on.

> When positive expressions were reduced, people produced fewer positive posts and more negative posts; when negative expressions were reduced, the opposite pattern occurred. These results indicate that emotions expressed by others on Facebook influence our own emotions, constituting experimental evidence for massive-scale contagion via social networks.

In 2014, the dating site OKCupid [published results from an experiment](https://www.gwern.net/docs/psychology/okcupid/weexperimentonhumanbeings.html) where it tampered with the _'match percentage'_ shown to its users for each of their matches:

> We asked: does the displayed match percentage cause [...] people to actually like each other? As far as we can measure, yes, it does. When we tell people they are a good match, they act as if they are. Even when they should be wrong for each other.

The ethics of experimenting on these users' emotions was widely criticised back in 2014. However, seven years on, very little has changed -- you're probably still being experimented on every single day.

The only difference now is that companies have learnt not to publicly broadcast their more dubious experiments quite so much.

(It turns out people get quite grumpy when you reveal to them that they've been experimented on.)


This technique is so simple and undetectable that **you've already been experimented on in this article**. Remember that reset button for the pointless cookie you could set above? It was actually part of an A/B test:

<figure id="both-delete-buttons" class="cookie-buttons">
<div>
<button type="button" class="btn btn-sm delete-cookie btn-outline-secondary">Undo</button>
<span><em>Group A</em></span>
</div>
<div>
<button type="button" class="btn btn-sm delete-cookie btn-danger">Clean up</button>
<span><em>Group B</em></span>
</div>
</figure>

(The results for this are in the footnotes...)

<div class="footnotes">

<p><em>~ Footnote ~</em></p>

<p>When you opened this page, you were assigned one of two reset buttons for the pointless cookie as part of an A/B test to determine <em>which button causes more users to remove their cookie</em>.</p>

<p>Here are the results so far:</p>

<figure>
{% include svg.html id="svg2" class="no-outline svg-chart" width="320" height="150"%}
<div id="ab-test-axis-labels" class="diagram no-outline">
    <div></div>
    <button type="button" class="btn btn-outline-secondary btn-sm">Undo</button>
    <div></div>
    <button type="button" class="btn btn-danger btn-sm hidden">Clean up</button>
    <div></div>
    <div id="ab-test-axis-cover"></div>
</div>
</figure>

<p>It's worth noting that this A/B test does differ quite a lot from a real-world test. Unlike a real A/B test, it tracks a completely meaningless metric to keep all of your personal information on your device.</p>

<p>It’s also usually recommended you don’t tell your subjects what’s happening mid-experiment... obviously.</p>
</div>