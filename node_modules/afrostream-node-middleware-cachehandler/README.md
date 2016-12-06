# afrostream node module express middleware cachehandler

allow a response to be dynamic, cached, or static  
( handling headers)  
works on local (dev env) & heroku & behind fastly|highwinds

## res.noCache()

response will not be cached by (cdn|proxy|browser)  
use for dynamic content

## res.cache()

response will be cached (cdn|proxy|browser) for 60sec

## res.isStatic()

response will be cached (cdn|proxy|browser) for 1 year

## res.isDynamic() [deprecated]

response will be cached at 0sec (Expires=0)    
Nb hits = nb cdn host