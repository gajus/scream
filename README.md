<h1 id="scream">Scream</h1>

[![NPM version](http://img.shields.io/npm/v/scream.svg?style=flat)](https://www.npmjs.org/package/scream)
[![Bower version](http://img.shields.io/bower/v/scream.svg?style=flat)](http://bower.io/search/?q=scream)

Dynamic viewport management for mobile.

* Manage `viewport` in different states of device orientation.
* Scale document to fit viewport.
* Calculate the dimensions of the "minimal" iOS 8 view relative to your viewport width.

![Demonstration using iOS simulator](./.gitdown/demonstration.gif)

<h2 id="scream-contents">Contents</h2>

* [Scream](#scream)
    * [Contents](#scream-contents)
    * [Managing the Viewport](#scream-managing-the-viewport)
        * [Configuration](#scream-managing-the-viewport-configuration)
    * [Events](#scream-events)
        * [Orientation Change](#scream-events-orientation-change)
        * [View Change](#scream-events-view-change)
    * [Screen](#scream-screen)
    * [Viewport](#scream-viewport)
    * [Minimal View](#scream-minimal-view)
    * [Download](#scream-download)


<h2 id="scream-managing-the-viewport">Managing the Viewport</h2>

Configure dimensions of the viewport at the time of the initialization:

```js
var scream = Scream({
    width: {
        portrait: 320,
        landscape: 640
    }
});
```

Scream generates the `viewport` meta tag to reflect the present orientation and in response to the [`orientationchangeend`](https://github.com/gajus/orientationchangeend) event.

```html
<meta name="viewport" content="width={width},initial-scale={scale},minimum-scale={scale},maximum-scale={scale},user-scale=0">
```

* `{width}` the width set in the configuration for the current orientation.
* `{scale}` calculated scale needed to fit the document in the screen.

<h3 id="scream-managing-the-viewport-configuration">Configuration</h3>

| Name | Description | Default |
| --- | --- | --- |
| `width.portrait` | Viewport width in the portrait orientation. | `screen.width` (`device-width`) |
| `width.landscape` | Viewport width in the landscape orientation. | `screen.width` (`device-width`) |

<h2 id="scream-events">Events</h2>

<h3 id="scream-events-orientation-change">Orientation Change</h3>

> The `orientationchangeend` event is fired when the orientation of the device has changed and the associated rotation animation has been complete.

– https://github.com/gajus/orientationchangeend

This is proxy for your convenience to perform operations that must follow the change of the device orientation and in the context of updated viewport tag. This is required when determining the view state.

```js
scream.on('orientationchangeend', function () {
    // Invoked after the orientation change and the associated animation (iOS) has been completed.
});
```

<h3 id="scream-events-view-change">View Change</h3>

Invoked on page load and when view changes.

```js
scream.on('viewchange', function (e) {
    // @var {String} 'full', 'minimal'
    e.viewName;
});
```

<h2 id="scream-screen">Screen</h2>

```js
/**
 * @return {String} portrait|landscape
 */
scream.getOrientation();

/**
 * Screen width relative to the device orientation.
 *
 * @return {Number}
 */
scream.getScreenWidth();

/**
 * Screen width relative to the device orientation.
 *
 * @return {Number}
 */
scream.getScreenHeight();
```

<h2 id="scream-viewport">Viewport</h2>

```js
/**
 * Viewport width relative to the device orientation.
 * 
 * @return {Number}
 */
scream.getViewportWidth();

/**
 * Viewport height relative to the device orientation and to scale with the viewport width.
 *
 * @return {Number}
 */
scream.getViewportHeight();

/**
 * The ratio between screen width and viewport width.
 *
 * @return {Number}
 */
scream.getScale();
```

<h2 id="scream-minimal-view">Minimal View</h2>

This functionality is iOS 8 specific. It has been developed as part of [Brim](https://github.com/gajus/brim) to bring back the minimal-ui.

```js
/**
 * Returns dimensions of the usable viewport in the minimal view relative to the current viewport width and orientation.
 * 
 * @return {Object} dimensions
 * @return {Number} dimensions.width
 * @return {Number} dimensions.height
 */
scream.getMinimalViewSize();

/**
 * Returns true if screen is in "minimal" UI.
 *
 * iOS 8 has removed the minimal-ui viewport property.
 * Nevertheless, user can enter minimal-ui using touch-drag-down gesture.
 * This method is used to detect if user is in minimal-ui view.
 *
 * In case of orientation change, the state of the view can be accurately
 * determined only after orientationchangeend event.
 * 
 * @return {Boolean}
 */
scream.isMinimalView();
```

<h2 id="scream-download">Download</h2>

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