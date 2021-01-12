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

Let's get one thing absolutely clear -- websites can see absolutely everything that you are doing on them.

Every click, every drag, every key press and every hover.

What device you're using, what browser you're using, and the size of your screen (yours is <span id="screen-size-gag"></span> by the way).

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

[One such company](https://www.inspectlet.com) which provides this service proclaims that you can _"watch individual visitors use your site as if you're looking over their shoulders"_. 

(The incredible lack of self-awareness here almost trumps the creepiness...)

[According to studies](https://static.googleusercontent.com/media/research.google.com/en//pubs/archive/40760.pdf) by Google (go figure...) and others, mouse movements are a good predictor for eye movements. Companies use this to understand in even greater depth every second of your interaction with their website to optimise how quickly they can get you to sign up, how easily you can be drawn to their adverts, and what order you click on certain links.

It's also worth noting that **none of this tracking ever needs to be disclosed to the user**. 

Why do companies do this? Most websites use it for fairly tame reasons like checking to make sure users aren't confused by a page's layout or a form.

But this data can be extremely powerful. It could be used to predict a user's age and wealth to dynamically show them a website which the user will be most likely to spend money in. Or, it could be used to predict [Parkinson's disease and other health problems](https://medium.com/stanford-magazine/your-computer-may-know-you-have-parkinsons-shall-it-tell-you-e8f8907f4595) without the user's consent, and show ads to them based on these predictions.

All of this happens without the user's knowldege, and without any regulation on how that data is stored, shared, sold or analysed.

<figure>
{% include svg.html id="svg1" class="no-outline" %}
<figcaption><p class="caption">
Which sections of this article have you skipped so far, by the way?
</p></figcaption>
</figure>

We haven't even gotten to the creepy stuff yet!

### Tracking tools

All of the previous tracking methods only work on a page-by-page basis. That is, if you reload the page or come back to it later, you'll be a completely new visitor in the eyes of the company.

However, the value of this data increases exponentially if the company is able to join all of your visits together into a single profile that describes you in more and more detail over time.

This is not a new concept -- rewards cards, websites that require you to log in to identify yourself, and more have been collecting data like this for years.

However, this is taken to a completely new level with the introduction of _cookies_. 

The cookie is a system built into all modern browsers which allow websites to store small chunks of data on each user's computer.

This is used for many many legitimate purposes like storing a user's current shopping cart or storing login details as the user browses the website. These types of cookies are generally called _first-party cookies_, as the website owner is the one setting these cookies.

<figure>
<div id="set-cookie"><button type="button" class="btn btn-success">Set a pointless cookie</button></div>
</figure>

However, any website that integrates a third party like Google or Facebook automatically grants these companies the right to set _third-party cookies_. These cookies allow advertisers to create an enormous mesh of trackers that watch you hop from website to website around the internet.

<figure>
<img src="/assets/png/facebook-like-button.png" alt="Facebook Like button">
<figcaption>
<p class="caption">
A Facebook 'Like' button on a website will constantly track you and send information back to Facebook, even if you don't click it or don't have a Facebook account.
</p>
</figcaption>
</figure>

For instance, see [which companies in Facebook's mesh are tracking you right now](https://www.facebook.com/off_facebook_activity/activity_list).

(While you're there, I highly recommend clicking 'Manage Future Activity' and turning off tracking entirely).

In essence, _all parties are incentivised to share your data with each other for more targeted advertising_. Google and Facebook are kingpins in this world, storing all of this data, providing ads to all of its partner websites, and controlling over half of all online advertising revenue in many markets. 

In some positive news, **Safari and Firefox now block third-party cookies by default**, and severely limit the cookies that make it onto your computer, making it impossible for you to be tracked via this method.

And, to no-one's surprise, **Google Chrome does not block any cookies** at all.




cookies
fingerprinting
- useragent
- etag
- https://amiunique.org/fp
- https://sensorid.cl.cam.ac.uk

cambridge analytica

### Websites are experimenting on you
a/b testing
- facebook test
- okcupid test







## Resources

Learn about how cookies are (or aren't) protected on your browser - https://www.cookiestatus.com/

