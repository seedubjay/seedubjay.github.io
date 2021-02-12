---
layout: post
title: You Are Being Watched
scripts: ['core', 'internet-tracking']
styles: ['internet-tracking']
use_d3: true
image: "/assets/jpg/evil-cookies.jpg"
subtitle: And other scary campfire stories to tell your friends at night
---

_Disclaimer: This article does contain some extremely creepy forms of tracking, but is just for demonstration purposes here and no data about you is actually collected._

_(It's a shame the same cannot be said for the rest of the internet.)_

What happens when you open up a website? The answer may surprise you... but deep down, let's be honest, it probably doesn't.

Here are a couple of the creepy things that will (probably) be happening behind the scenes on the next website you visit.

### Screen recordings

Let's get one thing absolutely clear -- websites can see absolutely everything that you are doing.

Every click, every drag, every key press and every hover.

Every twist and shake of your phone.

What device you're using<span id="os-gag"></span>, what browser you're using<span id="browser-gag"></span>, and the size of your screen<span id="screen-size-gag"></span>.

<figure>
<div id="form-example" class="figure-group">
    <div class="diagram">
        <input type="text" class="form-control form-control-sm form-example-text">
        <input type="range" class="form-example-range">
        <div class="checkbox-group"><input type="checkbox" class="form-example-checkbox1"><label>Tim Tams</label></div>
        <div class="checkbox-group"><input type="checkbox" class="form-example-checkbox2"><label>Vegemite</label></div>
        <div class="checkbox-group"><input type="checkbox" class="form-example-checkbox3"><label>Lamingtons</label></div>
        <button type="button" class="btn btn-success btn-sm form-example-button last">Submit</button>
    </div>
</div>
</figure>

Here, all of your actions in the left panel are being fed into the right panel. But in the real world, every single piece of this data could be sent back to a central server to be stored and analysed instead.

[One such company](https://www.inspectlet.com) providing this service proclaims that you can _"watch individual visitors use your site as if you're looking over their shoulders"_.

(Yes, apparently this is them bragging, not an admission of guilt.)

It's also worth noting that **none of this tracking ever needs to be disclosed to the visitors**. 

Why do companies do this? In theory it is used for fairly tame purposes like checking that users are understanding how to fill out an online form correctly.

But this data can be extremely powerful. It can be used to predict a user's age and wealth to dynamically show them a website which they will be most likely to spend money in.

Or, it can be used to predict a user's preferences and beliefs based on how they scroll and pause at different articles in a news feed.

Or, it can be used to predict [Parkinson's disease and other health problems](https://medium.com/stanford-magazine/your-computer-may-know-you-have-parkinsons-shall-it-tell-you-e8f8907f4595) without the user's consent, and show ads to them based on these predictions.

All of this happens without the user's knowledge, and without any regulations on how that data is stored, shared, sold or analysed.

### Cookies

All of the previous tracking methods only work on a page-by-page basis. In other words, if you reload the page, you'll be a completely new visitor in the eyes of the company.

However, the value of this data increases exponentially if the company is able to join all of your visits together into a single profile that describes your actions in more and more detail over time. This profile can then be referenced over and over again each time you visit so that you are shown content and ads that cater to your preferences and habits. 

<figure>
<img src="/assets/jpg/evil-cookies.jpg" alt="Evil cookies" class="diagram">
<figcaption class="caption">
<!-- <p class="caption"> -->
Kudos to whoever came up with such a pleasant name for such a not-so-pleasant concept
<!-- </p> -->
</figcaption>
</figure>

The 'cookie' is a system built into all browsers which allows companies to store small chunks of data on your computer. They can then access this data later on to 'pick up where they left off' instead of treating you like a completely new visitor.

_First-party cookies_ are set by the website you're visiting for things like storing your current shopping cart or keeping you logged in as you move from page to page. 

<figure class="cookie-buttons">
<button type="button" class="btn btn-lg btn-success set-cookie" id="set-cookie" disabled></button>
<button type="button" class="btn btn-sm hidden delete-cookie" id="delete-cookie"></button>
<figcaption class="caption">
This cookie cannot be reset by reloading, unlike most other things on this page
</figcaption>
</figure>

However, visiting a website is rarely so simple.

There are often dozens of advertisers, content providers and social media companies running ads, providing images, videos and fonts, and embedding tweets, posts and comment sections on every page you visit.

And, as you've probably guessed by now, **every single one of these companies is allowed to set their own cookies as well**.

<figure id="facebook-like">
<img src="/assets/png/facebook-like-button.png" alt="Facebook Like button" style="width:70%;margin:0 auto">
<figcaption>
<p class="caption">
A Facebook 'Like' button tracks you and relays information back to Facebook, even if you don't actually click the button or have a Facebook account
</p>
</figcaption>
</figure>

This is a particularly powerful tool for large companies like Google, Twitter and Facebook who have fingers in the proverbial pies of millions of websites. They can use this huge mesh of websites to watch users hop across the internet, learning more about each user's preferences, behaviours and interests as they browse. 

For example, see which websites in Facebook's tracking mesh are tracking you [here](https://www.facebook.com/off_facebook_activity/activity_list).

In some positive news, **the browsers Firefox and Safari now block third-party cookies by default**, and severely limit the remaining ones, making it impossible for you to be tracked via this method. 

Users are also protected by legislation [in Europe](https://gdpr.eu/cookies/) and, to a lesser degree, [in California](https://oag.ca.gov/privacy/ccpa). However, most of the world remains in a digital Wild West when they roam the internet. 

### Fingerprinting

Cookies are just one technique companies use to track their users. After all, what happens when a user clears their cookies? Switches browser? Disables third-party cookies entirely? Instead, companies can resort to _fingerprinting_ their users.

When you visit a website, it is able to see a whole range of information about your device. Some of it is obviously important, like your screen size and your default language, but it also sees much more obscure details like your speakers' decibel range and your device's default fonts.

This information is all assembled into a 'fingerprint' - a list of precise settings and parameters which make your device unique. Any company that knows this fingerprint will be able to recognise you any time you open their website, and show you content accordingly.

(You can see what your fingerprint looks like [here](https://amiunique.org/fp).)

Fingerprints are much harder to remove than cookies. This makes them a valuable commodity to advertising companies, who go to extreme lengths to 'fingerprint' users in ever-increasing detail.

For instance, [one strategy](https://www.usenix.org/conference/usenixsecurity19/presentation/shusterman) takes advantage of the computer's caching system by testing which sections of memory have been used recently and which haven't.

[Another strategy](https://sensorid.cl.cam.ac.uk/) monitors an iPhone's exact acceleration and orientation when held in the owner's hand to determine exactly how each iPhone's gyroscope and accelerometer were calibrated when it was built, uniquely identifying it.

Fingeprints can also be combined with other strategies to become even more valuable. If two fingerprinted devices are often using the same IP address or logged into the same accounts, they are probably owned by the same user. These fingerprints can therefore be connected to create an even more detailed profile of that user.

There are no easy solutions here since every new technological development, like memory caches and gyroscopes, can become new potential targets for fingerprinting.

We are locked in an arms race to protect ourselves against emerging fingerprinting strategies. And so far, we are probably losing. 

<figure>
{% include svg.html id="svg1" class="no-outline" %}
<figcaption><p class="caption">
Have you skipped anything on this page yet, by the way?
</p></figcaption>
</figure>

### A/B tests

Who's to say all the visitors to a website need to be shown the same website?

Instead, every visit can be an opportunity to experiment on users in a process called _A/B testing_. 

For example, let's say you're designing a new website and you want to place an ad in the spot which will be clicked on most often. Instead of surveying your users explicitly, you can run a simple experiment:
1. Split your users into group A and group B
1. Show each half a different version of the website
1. Watch each group to determine which version produces the most ad clicks

I actually have a small confession to make -- _you're part of an A/B test right now_.

You were shown a button to reset the pointless cookie above:

<figure class="cookie-buttons">
<button type="button" class="btn btn-sm delete-cookie" id="my-delete-button"></button>
</figure>

However, there's actually another version of that button:

<figure class="cookie-buttons">
<button type="button" class="btn btn-sm delete-cookie" id="other-delete-button"></button>
</figure>

You are randomly assigned your button when you opened the page, and your interactions with it are compared to every other reader's interactions to determine _which group is more likely to keep the pointless cookie on their computer_. Here are the live results:

<figure>
{% include svg.html id="svg2" class="no-outline svg-chart" %}
<div id="ab-test-axis-labels" class="diagram no-outline">
    <div></div>
    <button type="button" class="btn btn-outline-secondary btn-sm">Undo</button>
    <div></div>
    <button type="button" class="btn btn-danger btn-sm hidden">Clean up</button>
    <div></div>
    <div id="ab-test-axis-cover"></div>
</div>
</figure>

This A/B test has been designed to only track a meaningless metric and keep all of your personal information on your device, but in a real A/B test, your interactions would be partnered with detailed website-usage information, cookie trackers and fingerprint data to learn as much about you as possible.

(It's also usually recommended you don't tell your subjects what's happening mid-experiment...)

A/B testing has been used to optimise every aspects of websites: the order of menu bar items, font sizes, spacing between paragraphs, the ads you are served, the prices of items in a shop, and more.

It can be used to optimise less tangible things as well, like the addictiveness of a feed, what tone and phrasing to use in an email asking users to upgrade their account, or how long to set the timer for a _"Limited time only!"_ shop discount.

Unlike research in a university, **no ethics board or regulator is required to approve or monitor these experiments**.

For instance, [Facebook conducted an experiment](https://www.pnas.org/content/pnas/111/24/8788.full.pdf) on almost 700,000 users for a week in 2012 by deliberately removing either happy or sad posts from the feeds of subjects to see how it would influence what they wrote in Facebook posts later on.

> When positive expressions were reduced, people produced fewer positive posts and more negative posts; when negative expressions were reduced, the opposite pattern occurred. These results indicate that emotions expressed by others on Facebook influence our own emotions, constituting experimental evidence for massive-scale contagion via social networks.

In 2014, the dating site OKCupid [published results from an experiment](https://www.gwern.net/docs/psychology/okcupid/weexperimentonhumanbeings.html) where it tampered with the _'match percentage'_ shown to its users for each of their matches:

> We asked: does the displayed match percentage cause [...] people to actually like each other? As far as we can measure, yes, it does. When we tell people they are a good match, they act as if they are. Even when they should be wrong for each other.

The ethics of experimenting on these users' emotions was widely criticised back in 2014. However, seven years on, very little has changed -- you're probably still being experimented on every single day.

The only difference now is that companies have learnt not to publicly broadcast their more dubious experiments quite so much.

### Original Sin

There is a pattern in all of these forms of creepiness on the internet. _Advertising._

[The inventor of the popup ad](https://www.theatlantic.com/technology/archive/2014/08/advertising-is-the-internets-original-sin/376041/) now calls advertising the internet's _"Original Sin"_ -- it has shaped the technology, the industries and our experience of the internet irreversibly.

It incentivises companies to experiment on their users to create more addictive websites that users will scroll through for as long as possible.

It forces companies to choose how ethical they can bear to be, in the full knowledge that the less ethical they are, the more detailed their user profiles could become and the more revenue they could produce.

And it means that **it is no longer in very many people's interest for users of the internet to actually know how it works**. The more users know, the better equipped they would be to protect themselves.

Instead, it is more profitable for the internet to seem like 'magic', all while you are being monitored, tracked and experimented on without your knowledge. 

Try not to think about it too much next time you click on a link.