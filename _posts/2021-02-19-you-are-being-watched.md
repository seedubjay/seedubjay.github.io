---
layout: post
title: You Are Being Watched
internal_title: 'internet-tracking'
scripts: ['core', 'internet-tracking']
styles: ['internet-tracking']
use_d3: true
image: "/assets/jpg/evil-cookies.jpg"
thumbnail: "/assets/jpg/evil-cookies-thumbnail.jpg"
subtitle: And other scary campfire stories to tell your friends at night
related: ['21st-century-privacy', 'wikipedia-clicks']
---

_Disclaimer: All of the creepy tracking here is only done as a demo and none of it is actually collected. (It's a shame the same cannot be said for the rest of the internet.)_

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

(Yes, apparently this is a brag, not an admission of guilt.)

It's also worth noting that **none of this tracking ever needs to be disclosed to users**. 

Why do companies do this? It is usually for fairly tame purposes like checking that users are understanding how to fill out an online form correctly.

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

The _cookie_ is a system built into all browsers which allows companies to store small chunks of data on your computer. They can then access this data later on to 'pick up where they left off' instead of treating you like a completely new visitor. 

For instance, the website may set a cookie to keep track of things like your current shopping cart or authentication information to keep you logged in between visits.

However, visiting a website nowadays isn't so simple.

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

For example, [see which websites in Facebook's tracking mesh are tracking you here](https://www.facebook.com/off_facebook_activity/activity_list).

In some positive news, **the browsers Firefox and Safari now block third-party cookies by default**, and severely limit the remaining ones, making it impossible for you to be tracked via this method. 

Users are also protected by legislation [in Europe](https://gdpr.eu/cookies/) and, to a lesser degree, [in California](https://oag.ca.gov/privacy/ccpa). However, most of the world remains in a digital Wild West when they roam the internet. 

### Fingerprinting

Cookies are just one technique companies use to track their users. After all, what happens when a user clears their cookies? Switches browser? Disables third-party cookies entirely? Instead, companies can resort to _fingerprinting_ their users.

When you visit a website, it is able to see a whole range of information about your device. Some of it is obviously important, like your screen size and your default language, but it also sees much more obscure details like your speakers' decibel range and your device's default fonts.

This information is all assembled into a 'fingerprint' - a list of precise settings and parameters which make your device unique. Any company that knows this fingerprint will be able to recognise you any time you open their website, and show you content accordingly.

([You can see what your fingerprint looks like here](https://amiunique.org/fp).)

Fingerprints are much harder to remove than cookies. This makes them a valuable commodity to advertising companies, who go to extreme lengths to 'fingerprint' users in ever-increasing detail.

For instance, [one strategy](https://www.usenix.org/conference/usenixsecurity19/presentation/shusterman) takes advantage of the computer's memory caching system by timing how long it takes to retrieve random chunks of information from memory.

[Another strategy](https://sensorid.cl.cam.ac.uk/) monitors an iPhone's exact acceleration and orientation when held in the owner's hand to determine exactly how each iPhone's gyroscope and accelerometer were calibrated when it was built, uniquely identifying it.

Fingerprints can also be combined with other strategies to become even more valuable. If two fingerprinted devices are often using the same IP address or logged into the same accounts, they are probably owned by the same user. These fingerprints can therefore be connected to create an even more detailed profile of that user.

There are no easy solutions here since there are constantly new targets for fingerprinting opening up, like memory caches and gyroscopes.

We are locked in an arms race to protect ourselves against emerging fingerprinting strategies. And so far, we are probably losing. 

<figure>
{% include svg.html id="svg1" class="no-outline" %}
<figcaption><p class="caption">
How much of this page have you skipped so far, by the way?
</p></figcaption>
</figure>

### Original Sin

There is a pattern in all of these forms of creepiness on the internet. _Advertising._

[The inventor of the popup ad](https://www.theatlantic.com/technology/archive/2014/08/advertising-is-the-internets-original-sin/376041/) now calls advertising the internet's _"Original Sin"_ -- it has shaped the technology, the incentives and our experience of the internet irreversibly.

It forces companies to experiment on their users to create more addictive websites that users will scroll through for as long as possible.

It forces companies to choose how ethical they can bear to be, in the full knowledge that _the less ethical they are, the more detailed their user profiles could become and the more revenue they could produce_.

And it means that **it is no longer in very many people's interest for users of the internet to actually know how it works**. The more users know, the better equipped they would be to protect themselves.

Instead, it is more profitable for the internet to seem like 'magic', all while you are being monitored, tracked and experimented on without your knowledge. 

Try not to think about it too much next time you click on a link.
