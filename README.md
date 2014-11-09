# Scream

<!--[![Build Status](https://travis-ci.org/gajus/scream.png?branch=master)](https://travis-ci.org/gajus/scream)-->

[![NPM version](https://badge.fury.io/js/scream.svg)](http://badge.fury.io/js/scream)
[![Bower version](https://badge.fury.io/bo/scream.svg)](http://badge.fury.io/bo/scream)

Viewport management for mobile. Manage `viewport` in different states of device orientation. Scale document to fit viewport. Calculate the dimensions of the "minimal" iOS 8 view relative to your viewport width.

## Managing the Viewport

When you initialize Scream, you can set viewport width for the different 

```js
var scream = Scream({
    width: {
        portrait: 320,
        landscape: 640
    }
});
```

When you initialize Scream, you can setup `width` of the `portrait` and `landscape` view.

Scream generates a `viewport` meta tag.

```html
<meta name="viewport" content="width=WIDTH,initial-scale=SCALE,minimum-scale=SCALE,maximum-scale=SCALE,user-scale=0">
```

`WIDTH` and `SCALE` are dynamic values that will change depending on the predefined viewport width and device orientation.

* `WIDTH` the width set in the `Scream` configuration for the current orientation.
* `SCALE` automatically calculated scale needed to fit content in the screen.

## Download

Using [Bower](http://bower.io/):

```sh
bower install scream
```

Using [NPM](https://www.npmjs.org/):

```sh
npm install scream
```

The old-fashioned way, download either of the following files:

* https://raw.githubusercontent.com/gajus/scream/master/dist/scream.js
* https://raw.githubusercontent.com/gajus/scream/master/dist/scream.min.js