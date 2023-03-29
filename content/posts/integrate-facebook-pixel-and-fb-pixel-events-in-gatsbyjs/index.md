---
title: 'Integrate Facebook Pixel and Fb Pixel Events in GatsbyJs'
description: 'Learn how to integrate Facebook Pixel and track Pixel Events on a GatsbyJs website using the gatsby-plugin-facebook-pixel plugin. Follow Facebook event tracking documentation and use a React trick to avoid errors.'
date: '2020-10-21'
slug: /pensieve/integrate-facebook-pixel-and-fb-pixel-events-in-gatsbyjs
canonical_url:
tags:
  - gatsbyjs
  - facebook
  - pixel
---

## Integrate Facebook Pixel and Fb Pixel Events in GatsbyJs

![Gatsby-Plugin-Facebook-Pixel](https://cdn-images-1.medium.com/max/2000/1*8GuvITrUlxYGFCYCr_7Q_A.png)

![Facebook Pixel Event in Gatsby](https://cdn-images-1.medium.com/max/2000/1*JsiJZColgA4MZ_KwWjYSCQ.png)

## Problem Statement

We want to integrate Fb Pixel and also track Fb Pixel Events on our website. The website is built using GatsbyJs

If you follow Facebook Pixel Integration Guidelines, they will simply tell you to add a snippet of javascript code and place at the bottom of your head tag on your webpage.

However, on GatsbyJs you can’t amend the head tags directly, so we need a different approach!

We go to the plugin eco-system, luckily a kind developer has already created a GatsbyJs Facebook plugin, [gatsby-plugin-facebook-pixel](https://www.gatsbyjs.com/plugins/gatsby-plugin-facebook-pixel/)

Nice and straight forward, install the plugin with npm, then add the code to gatsby-config.js ensuring you add your pixel id. Simple instructions are on the link above.

    npm i gatsby-plugin-facebook-pixel

Then, add the following code in gatsby-config.js

    // In your gatsby-config.js
    plugins: [
    {
         resolve: `gatsby-plugin-facebook-pixel`,
         options: {
              pixelId: "pixel id here",
         },
    }
    ];

So what does this get you? Well, this plugin will inject the Facebook pixel javascript snippet on to your website, and this will track page views. This gives you a basis of the Facebook pixel working

## **Adding facebook pixel events**

Okay so the 1st step is done which is adding a Facebook pixel, the next step is to track events. For this, we need to take a quick look at the following documentation

[https://developers.facebook.com/docs/facebook-pixel/implementation/conversion-tracking/](https://developers.facebook.com/docs/facebook-pixel/implementation/conversion-tracking/)

## **Facebook event tracking**

This will show us how to add an event

    fbq('track', 'Purchase', {currency: "USD", value: 30.00});

Nice and simple, this is saying hey, when this event fires, track the event, the event is someone has purchased something and that purchase is worth $30.

You can then use this value to track the ROI of Facebook advertising

Okay but if you add that directly do gatsby you’ll get an error

    *fqb is not defined*

So what now, well now we take a little trick from react

    if (typeof window !== "undefined") {
      if (window.fbq != null) {
        window.fbq('track', 'Lead', {currency: "USD", value: 9.99});
      }
    }

This code is saying

- Hey do we have a browser window type object

- On that object can we find the Facebook object

- If we can let's use it and call the function to track

And Facebook Pixel is integrated to your GatsbyJs Website.
