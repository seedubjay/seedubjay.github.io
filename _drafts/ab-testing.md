---
layout: post
title: Life as a Lab Rat
internal_title: 'ab-testing'
scripts: ['ab-testing']
# styles: ['ab-testing']
use_d3: true
image: "/assets/jpg/lab-rat.jpg"
thumbnail: "/assets/jpg/lab-rat-thumbnail.jpg"
subtitle: How you are being experimented on with A/B tests
---

Who's to say each visitor to a website needs to be shown the same website?

Instead, every visit can be an opportunity to experiment on users in a process called _A/B testing_. 

Let's say you're designing a new website and want to put <span class="ab-tested">an advertisement</span> in a spot which will be clicked on most often. Instead of surveying your users or using a focus group, you can run a simple experiment:
1. Silently split visitors to your website into _Group A_ and _Group B_
1. Show each group a different version of the website which has <span class="ab-tested">an advertisement</span> in different positions
1. Relentlessly track each group's activity to determine which version of the website produces the most profits

In its most benign form, A/B testing is used to optimise simple things like font sizes and the ordering of menu bar items.

But it can also be applied to much more murky concepts: the addictiveness of a social media feed, what tone and wording to use in emails to convince users not to unsubscribe, or how long to set the timer for a made-up _'Limited time only!'_ shop discount.

This type of experimentation runs rampent on almost any large website on the internet. Social media giants [like LinkedIn](https://dl.acm.org/doi/pdf/10.1145/2783258.2788602) run hundreds of experiments per day and can experiment on users according to their language, location, social group and more.

And unlike research in a university, **no ethics board or regulator is required to approve or monitor these experiments**. Nor are these companies required to ask for informed consent from you before you are experimented on.


<figure>
<img src="/assets/jpg/lab-rat.jpg" alt="Lab rat" class="diagram">
<figcaption class="caption">
<!-- <p class="caption"> -->
Ironically, experiments on actual lab rats have more regulations to follow than experiments on the internet
<!-- </p> -->
</figcaption>
</figure>

For instance, [Facebook conducted an experiment](https://www.pnas.org/content/pnas/111/24/8788.full.pdf) on almost 700,000 users for a week in 2012 by _deliberately removing either happy or sad posts_ from the subjects' feeds to see how it would influence what they wrote in Facebook posts later on.

Put simply, it was testing **whether it could manipulate subjects' emotions using their feed algorithm**.

> When positive expressions were reduced, people produced fewer positive posts and more negative posts; when negative expressions were reduced, the opposite pattern occurred. These results indicate that emotions expressed by others on Facebook influence our own emotions, constituting experimental evidence for massive-scale contagion via social networks.

In 2014, the dating site OKCupid [published results from its own experiment](https://www.gwern.net/docs/psychology/okcupid/weexperimentonhumanbeings.html) where it tampered with the compatability rating ('match percentage') that it showed its users for each match:

> We asked: does the displayed match percentage cause [...] people to actually like each other? As far as we can measure, yes, it does. When we tell people they are a good match, they act as if they are. Even when they should be wrong for each other.

The most notable thing about these experiments was not that these companies were willing to experiment on their users' emotions to see whether they could be manipulated.  

What's even more remarkable _that we ever got to hear about them at all_. They were disclosed entirely voluntarily as part of a research paper and a blog post, respectively.

In the seven years after the [very public furor](https://www.nytimes.com/2014/06/30/technology/facebook-tinkers-with-users-emotions-in-news-feed-experiment-stirring-outcry.html) caused by these A/B tests in 2014, there's been little to no mention of the practice by any of the tech giants.

Very few research papers announcing results, very little heated public discourse, and very few scandals. 

Perhaps they realised the ethical boundaries they were crossing and stopped their experiments outright?

Or perhaps they noticed that the public gets very grumpy when you tell them you're experimenting on them, so it's best to just keep it quiet.

_Hmm. Which one, which one, which one could it be..._

<div class="footnotes">

<p><em>~ Footnote ~</em></p>

<p>I have a small confession to make… You are currently taking part in an A/B test yourself.</p>

<p>(If you reload the page a few times you might spot what I've been testing in the first few paragraphs.)</p>

<p>The experiment operates silently in the background, and measures <em>how far each visitor has scrolled through the page in the first 30 seconds</em>.</p>

<p>Here are the results so far:</p>

<figure>
{% include svg.html id="svg2" class="no-outline svg-chart" width="320" height="180"%}
</figure>

<p>It is worth noting though that this A/B test differs quite a lot from a real-world test.</p>

<p>For one thing, it's testing something completely meaningless.</p>

<p>It's also specifically designed so that no personal information ever leaves your device, unlike a real-world test where there would be <a href="/blog/you-are-being-watched/">plenty of tracking and identification data</a> being sent back to a central database as well.</p>

<p>And it's usually recommended you don’t tell your subjects what’s happening mid-experiment… obviously.</p>
</div>