---
layout: post
title: You Are Being Watched
scripts: ['core', 'internet-tracking']
styles: ['internet-tracking']
use_d3: true
image: "/assets/jpg/evil-cookies.jpg"
subtitle: And other scary stories
---

_Disclaimer: While this article does contain some extremely creepy forms of tracking, it is just for demonstration purposes here and no data about you is actually collected. It's a shame that the same cannot be said for the rest of the internet._

What happens when you open up a website? The answer may surprise you... but deep down, let's be honest, it probably doesn't.

In short, the internet is creepy. Really creepy.

Here are just a couple of the things that will (probably) be happening behind the scenes on the next website you visit.

### Screen recordings

Let's get one thing absolutely clear -- websites can see absolutely everything that you are doing.

Every click, every drag, every key press and every hover.

Every twist and shake of your smartphone.

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

(Yes, apparently this is something to brag about, not an admission of guilt.)

On top of this, according to [studies by Google](https://static.googleusercontent.com/media/research.google.com/en//pubs/archive/40760.pdf) and more, mouse movements are an excellent predictor for eye movements. Coupled with screen recordings, companies are able to track every second of your interaction with their website in even greater detail to optimise how quickly they can get you to sign up, how easily you can be drawn to their ads, and what order you click on certain links.

It's also worth noting that **none of this tracking ever needs to be disclosed to the user**. 

Why do companies do this? In theory it is used for fairly tame purposes like checking that users are understanding how to fill out an online form correctly.

But this data can be extremely powerful. It can be used to predict a user's age and wealth to dynamically show them a website which they will be most likely to spend money in.

Or, it can be used to predict a user's preferences and beliefs based on how they scroll and pause at different articles in a news feed.

Or, it can be used to predict [Parkinson's disease and other health problems](https://medium.com/stanford-magazine/your-computer-may-know-you-have-parkinsons-shall-it-tell-you-e8f8907f4595) without the user's consent, and show ads to them based on these predictions.

All of this happens without the user's knowldege, and without any regulation on how that data is stored, shared, sold or analysed.

<figure>
{% include svg.html id="svg1" class="no-outline" %}
<figcaption><p class="caption">
Have you skipped anything so far, by the way?
</p></figcaption>
</figure>

And we haven't even gotten to the creepy stuff yet!

### Cookies

All of the previous tracking methods only work on a page-by-page basis. In other words, if you reload the page, you'll be a completely new visitor in the eyes of the company.

However, the value of this data increases exponentially if the company is able to join all of your visits together into a single profile that describes you in more and more detail over time. After all, tracking what your users do is only useful if you can put that data to use next time they visit.

This has been done for years with [rewards cards systems](https://www.bbc.co.uk/news/technology-43483426) and by forcing users to provide excessive amounts of personal information when they buy something online to identify them.

However, the introduction of _cookies_ takes this to a whole new level. 

<figure>
<img src="/assets/jpg/evil-cookies.jpg" alt="Evil cookies" class="diagram">
<figcaption class="caption">
<!-- <p class="caption"> -->
Kudos to whoever came up with such an delightful name for such an un-delightful concept
<!-- </p> -->
</figcaption>
</figure>

The cookie is a system built into all modern browsers which allows websites to store small chunks of data on each user's computer. Think of cookies as the breadcrumbs a website sprinkles on your computer so that it can pick up where it left off each time you visit. (The irony of using a food analogy here is not lost on me...)

These cookies (known as _first-party cookies_) are used for many many legitimate purposes like storing a user's current shopping cart or keeping a user logged in as they move from page to page. 

<figure id="cookie-buttons">
<button type="button" class="btn btn-lg btn-success" id="set-cookie" disabled></button>
<button type="button" class="btn btn-danger btn-sm hidden" id="delete-cookie">Clean up</button>
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

This is a particularly powerful tool for large companies like Google, Twitter and Facebook who have fingers in the proverbial pies of millions of websites. They can use cookies to watch users hop from website to website, learning more about each user's preferences, behaviours and interests as they browse. 

For instance, [see which websites Facebook is tracking you on here](https://www.facebook.com/off_facebook_activity/activity_list).

(While you're there, I highly recommend clicking 'Manage Future Activity' and turning off tracking entirely.)

In some positive news, **the browsers Firefox and Safari now block third-party cookies by default**, and severely limit the other cookies that make it onto your computer, making it impossible for you to be tracked via this method. 

Users are also protected by legislation [in Europe](https://gdpr.eu/cookies/) and, to a lesser degree, [in California](https://oag.ca.gov/privacy/ccpa). However, most of the world remains in a digital Wild West as they roam the internet. 

### Fingerprinting

Cookies are just one technique companies use to track their users. After all, what happens when a user clears their cookies? Switches browser? Disables third-party cookies entirely? Instead, they can resort to _fingerprinting_ their users.

When you visit a website, the company is able to see a whole range of information about your device. Some of it is necessary, like your screen size and your default language, but it also sees much more obscure details like your speakers' decibel range and your device's default fonts.

This information is all assembled into a 'fingerprint' - a list of settings and parameters which can be used to distinguish your device from millions of others . Any company that knows this fingerprint will be able to recognise you any time you open their website, and show you content accordingly. 

[See how uniquely identifiable your fingerprint is here](https://amiunique.org/fp). 

While it is easy to delete a cookie, it can be near-impossible to remove a fingerprint short of changing your device or browser entirely. This makes fingerprints a valuable commodity for an advertising company, and companies will go to extreme lengths to fingerprint users in ever-increasing detail.

For instance, [one strategy](https://www.usenix.org/conference/usenixsecurity19/presentation/shusterman) takes advantage of the computer's caching system by testing which sections of memory have been used recently and which haven't.

[Another strategy](https://sensorid.cl.cam.ac.uk/) monitors an iPhone's exact acceleration and orientation when held in the owner's hand to determine exactly how each iPhone's gyroscope and accelerometer were calibrated when it was built, uniquely identifying it.

Fingeprints can also be combined with other strategies to become even more valuable. If two fingerprinted devices are often using the same IP address or logged into the same accounts, they are probably owned by the same user. These fingerprints can therefore be connected, like two fingers on the same hand, to create an even more detailed profile of that user.

There are no easy solutions here since every new development in browsers and devices can become new potential targets for fingerprinting.

We are locked in an arms race to protect ourselves against emerging fingerprinting strategies every day, and so far, we are probably losing. 

### Secret experiments

Who's to say all the visitors to a website need to be shown the same website?

Instead, every visit can be an opportunity to experiment on users in a process called _A/B testing_. 

For example, let's say you're designing a new website and you want to place an ad in the spot which will be clicked on most. Instead of surveying your users manually, you can run a simple experiment:
1. Split your users into group A and group B
1. Show each half a different version of the website
1. Watch each group to determine which version produces the most ad clicks

It is remarkably easy to turn users into data points this way to optimise every tiny aspect of a website --

The order of menu bar items, font sizes, and spacing between paragraphs.

The content you are shown in a feed, the ads you are served, and the prices of items in a shop.

For instance, in social media platforms [like Linkedin](https://dl.acm.org/doi/pdf/10.1145/2783258.2788602), hundreds of experiments are run every day and can target users to be experimented on based on their location, spoken languages and more. 

Yet again, as you've probably guessed, **none of these experiments ever need to be disclosed to the user**.

And, unlike research in a university, **there is no ethics board or regulator keeping these experiments accountable**.

For instance, in 2014, Facebook [published results from an experiment](https://www.pnas.org/content/pnas/111/24/8788.full.pdf) it conducted on almost 700,000 users.

For a whole week, Facebook deliberately removed either happy or sad posts from the feeds of subjects to see how it would influence what they wrote in Facebook posts later on.

> When positive expressions were reduced, people produced fewer positive posts and more negative posts; when negative expressions were reduced, the opposite pattern occurred. These results indicate that emotions expressed by others on Facebook influence our own emotions, constituting experimental evidence for massive-scale contagion via social networks.

Also in 2014, the dating site OKCupid [published results from some of its own experiments](https://www.gwern.net/docs/psychology/okcupid/weexperimentonhumanbeings.html). The most notable of these was 'Experiment 3', which tampered with the compatibility rating (_'match percentage'_) OKCupid showed its users for each match:

> We asked: does the displayed match percentage cause [...] people to actually like each other? As far as we can measure, yes, it does. When we tell people they are a good match, they act as if they are. Even when they should be wrong for each other.

Facebook and OKCupid's willingness to manipulate their users in search of new data points probably should have been a wake-up call. However, seven years on, very little has changed, and you're probably still being experimented on every single day.

### How did we get here?

advertising incentives

monopolies

no regulation - more money to be less ethical

## Resources

Learn about how cookies are (or aren't) protected on your browser - https://www.cookiestatus.com/