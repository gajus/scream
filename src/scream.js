var Scream,
    Sister = require('sister'),
    OCE = require('orientationchangeend')();
    
Scream = function Scream (config) {
    var scream,
        eventEmitter,
        lastView;

    if (!(this instanceof Scream)) {
        return new Scream(config);
    }

    scream = this;

    eventEmitter = Sister();

    config = config || {};

    config.width = config.width || {};

    if (!config.width.portrait) {
        config.width.portrait = global.screen.width;
    }

    if (!config.width.landscape) {
        config.width.landscape = global.screen.width;
    }

    /**
     * Viewport width relative to the device orientation.
     *
     * @return {Number}
     */
    scream.getViewportWidth = function () {
        return config.width[scream.getOrientation()];
    };

    /**
     * Viewport height relative to the device orientation and to scale with the viewport width.
     *
     * @return {Number}
     */
    scream.getViewportHeight = function () {
        return Math.round(scream.getScreenHeight() / scream.getScale());
    };

    /**
     * The ratio between screen width and viewport width.
     *
     * @return {Number}
     */
    scream.getScale = function () {
        return scream.getScreenWidth()/scream.getViewportWidth();
    };

    /**
     * @return {String} portrait|landscape
     */
    scream.getOrientation = function () {
        return global.orientation === 0 ? 'portrait' : 'landscape';
    };

    /**
     * Screen width relative to the device orientation.
     * 
     * @return {Number}
     */
    scream.getScreenWidth = function () {
        return global.screen[scream.getOrientation() === 'portrait' ? 'width' : 'height'];
    };

    /**
     * Screen width relative to the device orientation.
     * 
     * @return {Number}
     */
    scream.getScreenHeight = function () {
        return global.screen[scream.getOrientation() === 'portrait' ? 'height' : 'width'];
    };

    /**
     * Generates a viewport tag reflecting the content width relative to the device orientation
     * and scale required to fit the content in the viewport.
     *
     * Appends the tag to the document.head and removes the preceding additions.
     */
    scream._updateViewport = function () {
        var oldViewport,
            viewport,
            width,
            scale,
            content;

        width = scream.getViewportWidth();
        scale = scream.getScale();

        content = 
             'width=' + width +
            ', initial-scale=' + scale +
            ', minimum-scale=' + scale +
            ', maximum-scale=' + scale +
            ', user-scalable=0';
        
        viewport = document.createElement('meta');
        viewport.name = 'viewport';
        viewport.content = content;

        oldViewport = global.document.head.querySelector('meta[name="viewport"]');

        if (oldViewport) {
            oldViewport.parentNode.removeChild(oldViewport);
        }

        global.document.head.appendChild(viewport);
    };

    /**
     * Returns height of the usable viewport in the minimal view relative to the current viewport width.
     * 
     * @see http://stackoverflow.com/questions/26827822/how-is-the-window-innerheight-derived-of-the-minimal-view/26827842
     * @see http://stackoverflow.com/questions/26801943/how-to-get-the-window-size-of-fullscream-view-when-not-in-fullscream
     * @return {Number}
     */
    scream._getMinimalViewHeight = function () {
        var specs,
            spec,
            i,
            height,
            orientation = scream.getOrientation();

        specs = [
            // @see ./.spec/
            // [
            //  window.innerWidth when device is in a portrait orientation, scale 0.25 and page is the minimal view,
            //  window.innerHeight when device is in a portrait orientation, scale 0.25 and page is the minimal view,
            //  window.innerWidth when device is in a landscape orientation, scale 0.25 and page is the minimal view,
            //  window.innerHeight when device is in a landscape orientation, scale 0.25 and page is the minimal view,
            //  screen.width,
            //  screen.height,
            //  devicePixelRatio,
            //  name
            // ]
            [1280, 1762, 1920, 1280, 320, 480, 2, 'iPhone 4'],
            [1280, 2114, 2272, 1280, 320, 568, 2, 'iPhone 5 or 5s'],
            [1500, 2510, 2668, 1500, 375, 667, 2, 'iPhone 6'],
            [1656, 2785, 2944, 1656, 414, 736, 3, 'iPhone 6 plus'],
            [3072, 3936, 4096, 2912, 768, 1024, 1, 'iPad 2'],
            [3072, 3938, 4096, 2914, 768, 1024, 2, 'iPad Air or Retina']
        ];

        i = specs.length;

        while (i--) {
            if (global.screen.width === specs[i][4] &&
                global.screen.height === specs[i][5] &&
                global.devicePixelRatio === specs[i][6]) {

                spec = specs[i];

                break;
            }
        }

        if (!spec) {
            throw new Error('Not a known iOS device. If you are using an iOS device, report it to https://github.com/gajus/scream/issues/1.');
        }

        if (orientation === 'portrait') {
            height = Math.round((scream.getViewportWidth() * spec[1]) / spec[0]);
        } else {
            height = Math.round((scream.getViewportWidth() * spec[3]) / spec[2]);
        }

        return height;
    };

    /**
     * Returns dimensions of the usable viewport in the minimal view relative to the current viewport width and orientation.
     * 
     * @return {Object} dimensions
     * @return {Number} dimensions.width
     * @return {Number} dimensions.height
     */
    scream.getMinimalViewSize = function () {
        var width = scream.getViewportWidth(),
            height = scream._getMinimalViewHeight();

        return {
            width: width,
            height: height
        };
    };

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
    scream.isMinimalView = function () {
        // It is enough to check the height, because the viewport is based on width.
        return global.innerHeight == scream.getMinimalViewSize().height;
    };

    /**
     * 
     */
    scream._detectViewChange = function () {
        var currentView = scream.isMinimalView() ? 'minimal' : 'full';

        if (lastView != currentView) {
            eventEmitter.trigger('viewchange', {
                viewName: currentView
            });

            lastView = currentView;
        }
    };

    scream._updateViewport();

    lastView = scream.isMinimalView() ? 'minimal' : 'full';

    OCE.on('orientationchangeend', function () {
        scream._updateViewport();
        scream._detectViewChange();

        eventEmitter.trigger('orientationchangeend');
    });

    global.addEventListener('orientationchange', function () {
        scream._updateViewport();
    });

    global.addEventListener('resize', function () {
        scream._detectViewChange();
    });

    // iPhone 6 plus does not trigger resize event when leaving the minimal-ui in the landscape orientation.
    global.addEventListener('scroll', function () {
        scream._detectViewChange();
    });

    scream.on = eventEmitter.on;
};

global.gajus = global.gajus || {};
global.gajus.Scream = Scream;

module.exports = Scream;