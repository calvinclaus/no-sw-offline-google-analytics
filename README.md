# no-sw-offline-google-analytics
Service Worker independent offline Google Analytics Wrapper that caches calls to `ga(...)` when offline and retries them when online again.


![funny img](http://i.giphy.com/10jJopkIyx8aGs.gif)

## Disclaimer

You sould use this library if you need offline GA tracking without relying on Service Worker. If you have no problem with your offline support failing on browsers that do not support Service Workers use: <a href="https://www.npmjs.com/package/sw-offline-google-analytics">sw-offline-google-analytics</a> instead.

## Installation

This package is distributed via npm:

```
npm i -S no-sw-offline-google-analytics
```
The only dependency is for the `ga` object to be globally available. This is automatically the case if you include the standard Google Analytics snippet in your .html files. 

NOTE:
Should you not want `ga` exposed globally please either file a PR that allows passing `ga` in from the outside (much appreciated), or report an issue.


## Usage

To use the wrapper instead of calling `ga(...)` directly you call `gaWrapper.ga(...)`. 
A call to `ga(...)` is cached when `navigator.onLine == false`.
Cached calls will be retried every 5s (by default) and as soon as the script is required. 

```javascript
import gaWrapper from "no-sw-offline-google-analytics";

gaWrapper.ga('send', 'pageview', window.location.pathname);
...
gaWrapper.ga(any, function, call, to, ga, api, allowed, here)

```

Options have to be set directly on the object:
```javascript
import gaWrapper from "no-sw-offline-google-analytics";
gaWrapper.NUM_SENT_PER_BATCH = 1; //number of cached requests sent before waiting BATCH_TIMEOUT.
gaWrapper.BATCH_TIMEOUT= 1000; //number of milliseconds until next NUM_SENT_PER_BATCH cached calles are retried.
gaWrapper.RETRY_INTERVAL= 5000; //number of milliseconds between checks if navigator.onLine == true again.
```


## Contributing

Is appreciated. Start by filing an issue. 

## Other
This library was crafted by [Calvin Claus](https://twitter.com/calvin_claus).
