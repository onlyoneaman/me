---
title: 'How to Make Rails Response Faster'
description: 'As your document or response size increases , it can result in much slower response time, lets look into some practices to make it faster.'
date: '2022-08-12'
slug: /pensieve/how-to-make-rails-response-faster
canonical_url:
tags:
  - rails
  - ruby
  - performance
---

## How to Make Rails Response Faster

![How to make Rails Response faster](./make-rails-response-faster.png)

As your document or response size increases 📈, it can result in much slower response time 📈 📈 , even in seconds 😿 which results in a pretty bad user experience. Speed is the key here 🚤, the quicker your site is the more your users like it. PageSpeed and Responses Size are also responsible for SEO Rankings and is a major part of [LightSpeed](https://developers.google.com/speed)

In the below section, we explore how this is achieved and tested, if you have a code to fix 🐛, Just Jump to Implementation [here](#3b6e) and check [this](#37d0) out later.

### So, How do we achieve this?

I found Rack::Deflater recently, and regret how I wasn’t using it for a long time. I experimented over Rack::Deflater by sending a heavy json as response and comparing the performance of rails app with and without Rack::Deflater . Below we can see the Package Size of 8.3 Mb which was transferred without Rack::Deflater and 359 Kb which was transferred with Rack::Deflater. The Actual Factor and the ratio of Compression can vary a bit, it consistently results in a faster response, thus undoubtedly Rack::Deflater does makes the user experience better by compressing and sending resources.

![Size of package transferred over network with and without Rack::Deflater](https://cdn-images-1.medium.com/max/2000/1*KbgjoCoVJFU89m8W876fEw.png)

So how does Rack::Deflater does this. Rackk Deflate compresses the body of web page before responding to a request. When the response is then received by the client, it sees the gzip compression enabled via the header Content-Encoding=gzip and unzips it before rendering it. Though it sounds like a lot of trouble, remember generally CPUs are fast, and networks are slow. Thus, It’s much faster and more efficient to just send less data “over the internet” even if we spend time compressing and expanding that data.

“Transferred” is the compressed size of all resources. You can think of it as the amount of upload and download data that a mobile user will use in order to load this page. “Resources” is the uncompressed size of all resources.

### Implementation

Just add the below line in your application.rb file.

    *config.middleware.use Rack::Deflater*

Your file should be like this after it.

    ....
    class Application < Rails::Application
      ...
      *config.middleware.use Rack::Deflater
      ...
    end
    ....*

## TroubleShooting

- Check if you have placed the middleware line correctly in code.

- If you are using ActionDispatch::Static in your app. Then,Rack::Deflater should be placed after ActionDispatch::Static. The reasoning is that if your app is also serving static assets (e.g., Heroku), when assets are served from disk they are already compressed. Inserting it before would only end up in Rack::Deflater attempting to re-compress those assets. Therefore as a performance optimisation:

```ruby
# application.rb

  config.middleware.insert_after ActionDispatch::Static, Rack::Deflater
```

- If you are using any other middleware it might conflict withRack::Deflater , it should work if you use insert_before (instead of "use"), to place it near the top of the middleware stack, prior to any other middleware that might send a response. .use places it at the bottom of the stack. Let’s say, the topmost middleware is Rack::Sendfile. So we would use:

```
  config.middleware.insert_before(Rack::Sendfile, Rack::Deflater)
```

You can get the list of middleware in order of loading by doing rake middleware from the command line.

## Conclusion

I hope you have found this useful 😄. Thank you for reading.
Drop a Response or 📬 if you have any queries or just wanna connect ☕️.
