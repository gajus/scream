# Scream

[![NPM version](https://badge.fury.io/js/scream.svg)](http://badge.fury.io/js/scream)
[![Bower version](https://badge.fury.io/bo/scream.svg)](http://badge.fury.io/bo/scream)

Viewport management for mobile. Manage `viewport` in different states of device orientation. Scale document to fit viewport. Calculate the dimensions of the "minimal" iOS 8 view relative to your viewport width.

## Managing the Viewport

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

### Configuration

| Name | Description | Default |
| --- | --- | --- |
| `width.portrait` | Viewport width in the portrait orientation. | `screen.width` (`device-width`) |
| `width.landscape` | Viewport width in the landscape orientation. | `screen.width` (`device-width`) |

## Screen

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

## Viewport

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

## Minimal View

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
 * @return {Boolean}
 */
scream.isMinimalView();
```

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