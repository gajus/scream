var Scream,
    
Scream = function Scream (config) {
    var scream;

    if (!(this instanceof Scream)) {
        return new Scream(config);
    }

    scream = this;

    config = config || {};

    config.width = config.width || {};

    if (!config.width.portrait) {
        throw new Error('Must configure config.width.portrait.');
    }

    if (!config.width.landscape) {
        throw new Error('Must configure config.width.landscape.');
    }

    /**
     * Returns height of the available viewport in the minimal view relative to the current viewport width.
     * 
     * @see http://stackoverflow.com/questions/26827822/how-is-the-window-innerheight-derived-of-the-minimal-view/26827842
     * @see http://stackoverflow.com/questions/26801943/how-to-get-the-window-size-of-fullscream-view-when-not-in-fullscream
     * @return {Number}
     */
    scream.getMinimalViewHeight = function () {
        var portrait = Math.round((scream.getViewportWidth() * 4228) / 2560),
            landscape = scream.getViewportHeight();

        return scream.getOrientation() === 'portrait' ? portrait : landscape;
    };

    /**
     * @return {String} portrait|landscape
     */
    scream.getOrientation = function () {
        return global.orientation === 0 ? 'portrait' : 'landscape';
    };

    /**
     * Screen width relative to the device orientation.
     */
    scream.getScreenWidth = function () {
        return global.screen[scream.getOrientation() === 'portrait' ? 'width' : 'height'];
    };

    /**
     * Screen width relative to the device orientation.
     */
    scream.getScreenHeight = function () {
        return global.screen[scream.getOrientation() === 'portrait' ? 'height' : 'width'];
    };

    /**
     * The ration between screen width and viewport width.
     *
     * @return {Number}
     */
    scream.getScale = function () {
        return scream.getScreenWidth()/scream.getViewportWidth();
    };

    /**
     * 
     */
    scream.updateViewport = function () {
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

        oldViewport = global.window.document.head.querySelector('meta[name="viewport"]');

        if (oldViewport) {
            oldViewport.parentNode.removeChild(oldViewport);
        }

        global.window.document.head.appendChild(viewport);
    };

    /**
     * Viewport width relative to the device orientation.
     */
    scream.getViewportWidth = function () {
        return config.width[scream.getOrientation()];
    };

    /**
     * Viewport height relative to the device orientation and to scale with the viewport width.
     */
    scream.getViewportHeight = function () {
        return Math.round(scream.getScreenHeight() / scream.getScale());
    };

    /**
     * @return {Object}
     */
    scream.getMinimalViewSize = function () {
        var width = scream.getViewportWidth(),
            height = scream.getMinimalViewHeight();

        return {
            width: width,
            height: height
        };
    };

    /**
     * When checking if view is in minimal state, it is enough to check the height,
     * because the viewport is width based.
     * 
     * @return {Boolean}
     */
    scream.isMinimalView = function () {
        return global.innerHeight == scream.getMinimalViewSize().height;
    };
};

global.gajus = global.gajus || {};
global.gajus.Scream = Scream;

module.exports = Scream;