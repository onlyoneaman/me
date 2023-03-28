---
title: 'Unlocking the Power of Redis: Storing Any Object as Cache in Ruby on Rails'
description: 'Unlock the full potential of Redis for storing any object as cache in Ruby on Rails. Learn how Redis works as a cache, how we can store classes and prevent threads fighting over single Redis connection.'
date: '2023-03-21'
slug: /pensieve/unlocking-the-power-of-redis-storing-any-object-as-cache-in-ruby-on-rails
canonical:
tags:
  - Ruby on Rails
  - Ruby
  - Redis
---

## Unlocking the Power of Redis: Storing Any Object as Cache in Ruby on Rails

### Unlock the full potential of Redis for storing any object as cache in Ruby on Rails. Learn how Redis works as a cache, how we can store classes and prevent threads fighting over single Redis connection.

![Unlocking the Power of Redis: Storing Any Object as Cache in Ruby on Rails](./image.jpg)

Redis is an open-source, in-memory data structure store that can be used for caching, messaging, and real-time analytics. It has become increasingly popular in recent years because it is extremely fast, scalable, and easy to use. In this blog, we will be focusing on using Redis as a cache for storing any object in Ruby on Rails. We will explore the many benefits of using Redis as a cache and demonstrate how to integrate it into your Ruby on Rails application. We will also look into storing complex classes and arrays into redis efficiently, and finally how can we prevent different threads fighting over single redis connection.

### What is Redis?

Redis stands for Remote Dictionary Server. It is an in-memory data structure store that is used as a database, cache, and message broker. It is an open-source project written in ANSI C. Redis supports a wide range of data structures such as strings, hashes, lists, sets, and sorted sets. Its amazing speed comes from its ability to keep the data in memory, which allows read/write operations to be performed with incredibly low latency.

### Why Use Redis as a Cache?

Caching is a mechanism for improving the performance of your application by storing frequently accessed data in memory. This reduces the number of times your application has to access the database, which in turn reduces the response time of your application. Redis is an excellent choice for caching because it is incredibly fast and can store any type of data. Redis is also very easy to use and can be integrated into your Ruby on Rails application with minimal effort.

### How Redis Works as a Cache

Redis works by storing the data in key-value pairs in memory. When you request data from Redis, it checks if the data is already in memory, and if it is, it returns the data from memory. If the data is not in memory, Redis will fetch it from the database, store it in memory, and return it to you. This process is known as caching. When you modify the data, Redis will write the changes to the database and update the cached version in memory. This ensures that the cached version is always updated with the database.

### How to Use Redis in Ruby on Rails

Using Redis in Ruby on Rails is very easy. First, you need to add the Redis gem to your Gemfile:

    gem 'redis'

Next, you need to configure Redis in your environment file.
Initialize a redis.rb file inside config/initializers with the below content.

    REDIS_CLIENT = Redis.new(url: "YOUR_REDIS_URL", timeout: 1)

This configuration sets up Redis as the REDIS_CLIENT for your application. You can then use REDIS_CLIENT.set and REDIS_CLIENT.get to store and retrieve data from Redis. Here is an example of how to use Redis to cache data:

    data = {test: "hello"}
    REDIS_CLIENT.set("test_key", data, ex: 60)
    cached_user = REDIS_CLIENT.get("test_key")

In this example, we are caching the object with an expiration time of 1minutes. When we retrieve the object from the cache, we get the cached version if it is still within the 1-minute expiration time, and if not, we fetch it from the database and store it in the cache again.

## Next Steps

### Storing Objects (Arrays / JSON / other classes) in redis.

Storing plain hashes or simple objects like strings, numbers is straightforward. But things get complicated as we try storing different classes or arrays using redis.

E.g.

    data = User.first
    REDIS_CLIENT.set("test_key", data, ex: 60)
    cached_user = REDIS_CLIENT.get("test_key")
    # Result ->  "#<V1User:0x000055e224d30520>"

Here, We need attributes like email, name, id associated with User to get stores in cache, but Redis stored the class instance simple. To avoid this, we need to convert such classes into attributes and pass a simple hash to Redis instead of Class.

    data = User.first
    data_to_store = JSON.dump(data.attributes)
    REDIS_CLIENT.set("test_key", data_to_store, ex: 60)
    cached_user = REDIS_CLIENT.get("test_key")
    proper_cached_user = JSON.parse(cached_user)
    # Result ->   {"id"=>1, "email"=>"aman@gmail.com"}

Similarly, there could be attributes which contain classes as a child, Let’s create a function which drills down below the object, converting it suitable to be stored in Redis.

    def create_redis_cache
      key = "test_key"
      items = [User.first, User.second, {test: User.third}]
      items_to_store = attributes_from_item(items)
      REDIS_CLIENT.set(key, JSON.dump(items_to_store), ex: 60)
    end

    def get_redis_cache
      key = "test_key"
      items = REDIS_CLIENT.get(key)
      final_items = JSON.parse(items)
    end

     def attributes_from_item(item)
        return item unless item.respond_to?(:attributes)
        new_item = {}
        item.attributes.each do |k, v|
          if v.is_a?(Hash)
            new_item[k] = attributes_from_item(v)
          elsif v.is_a?(Array)
            new_item[k] = v.map{|e| attributes_from_item(e)}
          else
            new_item[k] = v
          end
        end
        new_item
      end

You can use the above create_redis_cache and get_redis_cache methods to store and retrieve cache with any data type without worrying about validity of cache.

### Managing Concurrency

When deploying rails, we often have a side worker like sidekiq, which runs parallel, doing tasks without disturbing the web application. When sidekiq opens many threads, your redis can start misbehaving due to the high number of open connections (sidekiq threads + puma threads) threads fighting over one connection (since the Redis Client only runs one command at a time, using a Monitor.). To solve this, You use a separate global connection pool for your application code.

Add connection_pool to your Gemfile.

    gem 'connection_pool'

and then create limited pools in redis like this in your redis.rb initializer:

    require 'connection_pool'

    REDIS = ConnectionPool.new(size: 10) { Redis.new, timeout: 1 }

This ensures that even if you have lots of concurrency, you’ll only have 10 connections open to memcached per Sidekiq process.

Now in your application code anywhere, you can do this:

    REDIS.with do |conn|
      # some redis operations
      r = conn.get(redis_key)
    end

You’ll have up to 10 connections to share amongst your puma/sidekiq workers. This will lead to better performance since, as you correctly note, you won’t have all the threads fighting over a single Redis connection.

If you have survived till here, here is an [article](https://onlyoneaman.medium.com/how-to-make-rails-response-faster-a8cc5f1242d) which will help you decrease your API Response time multi-folds.

### Advanced Features of Redis

Redis is an incredibly versatile tool and has many advanced features that can be used to improve performance and functionality. Here are some of the most useful advanced features of Redis:

1. Pub/Sub
   Redis supports Publish/Subscribe messaging which allows you to set up a messaging system between your application and other external sources. This feature can be used to push data from your application to external sources or to receive data from external sources in real-time.

2. Lua Scripting
   Redis supports Lua scripting which allows you to execute complex operations on the server-side. This can be used to perform complex calculations, transformations, or data manipulations.

3. Transactions
   Redis supports transactions which allow you to execute multiple commands in a single operation. This feature is useful when you need to ensure that a set of commands are executed atomically, meaning that either all of them are executed or none of them are executed.

4. TTL
   Redis allows you to set an expiration time for the data in the key-value pair. This is known as Time to Live (TTL). When the TTL expires, Redis automatically removes the key-value pair from memory. This feature can be used to reduce memory usage and to ensure that the cached data is always up to date.

### Conclusion

Redis is an excellent choice for caching frequently accessed data in your Ruby on Rails application. It is fast, scalable, and easy to use. Redis can store any type of data in memory and can be integrated into your application with minimal effort. It has many advanced features that can be used to improve performance and functionality. Using Redis as a cache can significantly improve the response time of your application and reduce the load on your database. Redis is a powerful tool that can help your application keep up with the demands of your users and stay ahead of the competition.

Did the article help or anything else you would like to suggest or add? Add a response or drop a message below to me. 😉

Follow me on [Medium](https://onlyoneaman.medium.com/) for more articles. Also, Let’s connect if we haven’t yet [Twitter](https://twitter.com/onlyoneaman), [LinkedIn](https://www.linkedin.com/in/onlyoneaman/).

### References

[**How to Make Rails Response Faster**](https://onlyoneaman.medium.com/how-to-make-rails-response-faster-a8cc5f1242d)

[**Advanced Options**](https://github.com/mperham/sidekiq/wiki/Advanced-Options#connection-pooling)

[**GitHub - redis/redis-rb: A Ruby client library for Redis**](https://github.com/redis/redis-rb)

[**ActiveSupport::Cache::Store**](https://api.rubyonrails.org/v7.0.4/classes/ActiveSupport/Cache/Store.html)

[**Documentation**](https://redis.io/docs/)
