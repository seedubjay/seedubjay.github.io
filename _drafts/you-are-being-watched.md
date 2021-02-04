---
layout: post
title: You Are Being Watched
scripts: ['core', 'you-are-being-watched']
styles: ['you-are-being-watched']
use_d3: true
image: "/assets/jpg/you-are-being-watched-thumbnail.jpg"
subtitle: And other scary stories
---

_Disclaimer: While this article does contain some extremely creepy forms of tracking, it is just for demonstration purposes here and none of it is actually collected, except where otherwise stated. It's a shame that the same cannot be said for the rest of the internet._

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

(The lack of self-awareness here almost trumps the creepiness... but not quite)

[According to studies](https://static.googleusercontent.com/media/research.google.com/en//pubs/archive/40760.pdf) by Google and others, mouse movements are a good predictor for eye movements. Companies use this to understand in even greater depth every second of your interaction with their website to optimise how quickly they can get you to sign up, how easily you can be drawn to their ads, and what order you click on certain links.

It's also worth noting that **none of this tracking ever needs to be disclosed to the user**. 

Why do companies do this? Most websites use it for fairly tame reasons like checking that users aren't getting confused by a page's layout or a form.

But this data can be extremely powerful. It could be used to predict a user's age and wealth to dynamically show them a website which they will be most likely to spend money in.

Or, it could be used to predict user's interests based on how quickly they scroll past each article in a news feed.

Or, it could be used to predict [Parkinson's disease and other health problems](https://medium.com/stanford-magazine/your-computer-may-know-you-have-parkinsons-shall-it-tell-you-e8f8907f4595) without the user's consent, and show ads to them based on these predictions.

All of this happens without the user's knowldege, and without any regulation on how that data is stored, shared, sold or analysed.

<figure>
{% include svg.html id="svg1" class="no-outline" %}
<figcaption><p class="caption">
Which sections of this article have you skipped so far, by the way?
</p></figcaption>
</figure>

We haven't even gotten to the creepy stuff yet!

### Cookies

All of the previous tracking methods only work on a page-by-page basis. In other words, if you reload the page, you'll be a completely new visitor in the eyes of the company.

However, the value of this data increases exponentially if the company is able to join all of your visits together into a single profile that describes you in more and more detail over time.

This has been done for years with [rewards cards systems](https://www.bbc.co.uk/news/technology-43483426) and by forcing users to provide excessive amounts of personal information when they buy something online.

However, the introduction of _cookies_ takes this to a whole new level. 

<figure>
<img src="/assets/jpg/you-are-being-watched-thumbnail.jpg" alt="Evil cookies" class="diagram">
<figcaption class="caption">
<!-- <p class="caption"> -->
Kudos to whoever came up with such an delightful name for such an un-delightful concept
<!-- </p> -->
</figcaption>
</figure>

The cookie is a system built into all modern browsers which allows websites to store small chunks of data on each user's computer. Think of cookies as the breadcrumbs a website sprinkles on your computer so that it can pick up where it left off each time you visit. (The irony of using a food analogy here is not lost on me...)

These cookies (known as _first-party cookies_) are used for many many legitimate purposes like storing a user's current shopping cart or keeping a user logged in as they move from page to page. 

<figure id="cookie-buttons">
<button type="button" class="btn btn-success" id="set-cookie" disabled></button>
<button type="button" class="btn btn-danger btn-sm hidden" id="delete-cookie">Clean up</button>
<figcaption class="caption">
While most things on this page reset completely when reloading, this cookie will stay on your computer for two days
</figcaption>
</figure>

However, visiting a website is rarely as simple as downloading a black and white chunk of text.

There are often dozens of advertisers, content providers and social media companies running ads, providing images, videos and fonts, and embedding tweets, posts and comment sections on every page you visit.

And, as you've probably guessed, **every single one of these companies is allowed to set their own cookies as well**.

<figure id="facebook-like">
<img src="/assets/png/facebook-like-button.png" alt="Facebook Like button" style="width:70%;margin:0 auto">
<figcaption>
<p class="caption">
A Facebook 'Like' button tracks you and relays information back to Facebook, even if you don't actually click the button or have a Facebook account
</p>
</figcaption>
</figure>

This is a particularly powerful tool for large companies like Google, Twitter and Facebook who have fingers in the proverbial pies of millions of websites. They can use cookies to watch users hop from website to website, learning more about each users' preferences, behaviours and interests as they go. 

For instance, see [which companies in Facebook's mesh are tracking you right now](https://www.facebook.com/off_facebook_activity/activity_list).

(While you're there, I highly recommend clicking 'Manage Future Activity' and turning off tracking entirely).

In some positive news, **the browsers Firefox and Safari now block third-party cookies by default**, and severely limit the other cookies that make it onto your computer, making it impossible for you to be tracked via this method. 

Users are also protected by legislation [in Europe](https://gdpr.eu/cookies/) and, to a lesser degree, [in California](https://oag.ca.gov/privacy/ccpa). However, most of the world remains in a digital Wild West as they roam the internet. 

### Fingerprinting

Cookies are just one technique companies use to track their users. After all, what happens when a user clears their cookies? Switches browser? Disables third-party cookies entirely? Instead, they can resort to _fingerprinting_ their users.

When you visit a website, the company is able to see a whole range of information about your device. Some of it is obvious, like your screen size and your default language, but most is rather obscure, like your speakers' decibel range and your device's default fonts.

This information is all assembled into a 'fingerprint' - a list of features which uniquely identify you. This means that even with millions of people logging into a website, it will often be able to uniquely identify you and remember your previous visits when you arrive.

[See what your fingerprint looks like here](https://amiunique.org/fp). 

While it is easy to delete a cookie, it can be near-impossible to remove a fingerprint short of changing your browser or device entirely. This makes fingerprints a valuable commodity for an advertising company, and companies will go to extreme lengths to fingerprint users in ever-increasing detail.

For instance, [one strategy](https://www.usenix.org/conference/usenixsecurity19/presentation/shusterman) takes advantage of the computer's caching system by testing which sections of memory have been used recently and which haven't.

[Another strategy](https://sensorid.cl.cam.ac.uk/), discovered by the Cambridge Computer Lab, monitors a iPhone's gyroscopic and accelerometer data to determine exactly how each iPhone's gyroscope and accelerometer were calibrated when it was built, uniquely identifying it.

Fingeprints can also be combined with other strategies to become even more valuable. If two fingerprinted devices are often using the same IP address or logged into the same accounts, they are probably owned by the same user. These fingerprints can therefore be connected, like two fingers on the same hand, to create an even more detailed profile of that user.

There are no easy solutions to fingerprinting since every new development in browsers and devices can become new potential targets for fingerprinting.

We are locked in an arms race to protect ourselves against new strategies, and so far, we are probably losing. 

### Websites are experimenting on you
a/b testing
- facebook test
- okcupid test


### How did we get here?

advertising incentives

monopolies

no regulation - more money to be less ethical


## Resources

Learn about how cookies are (or aren't) protected on your browser - https://www.cookiestatus.com/