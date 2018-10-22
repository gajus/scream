import Sister from 'sister';
import OrientationChangeEnd from 'orientationchangeend';

const OCE = OrientationChangeEnd();

type ConfigType = {
    width: {
        portrait: ?number,
        landscape: ?number
    }
};

export default (config: ConfigType = {}): Object => {
    const scream = {};
    const eventEmitter = Sister();

    config.width = config.width || {};

    if (!config.width.portrait) {
        config.width.portrait = window.screen.width;
    }

    if (!config.width.landscape) {
        config.width.landscape = window.screen.width;
    }

    /**
     * Viewport width relative to the device orientation.
     */
    scream.getViewportWidth = (): number => {
        return config.width[scream.getOrientation()];
    };

    /**
     * Viewport height relative to the device orientation and to scale with the viewport width.
     */
    scream.getViewportHeight = (): number => {
        return Math.round(scream.getScreenHeight() / scream.getScale());
    };

    /**
     * The ratio between screen width and viewport width.
     */
    scream.getScale = (): number => {
        return scream.getScreenWidth() / scream.getViewportWidth();
    };

    const OrientationType = 'portrait' | 'landscape';

    scream.getOrientation = (): OrientationType => {
        return window.orientation === 0 || window.orientation === 180 ? 'portrait' : 'landscape';
    };

    /**
     * Screen width relative to the device orientation.
     */
    scream.getScreenWidth = (): number => {
        return window.screen[scream.getOrientation() === 'portrait' ? 'width' : 'height'];
    };

    /**
     * Screen width relative to the device orientation.
     */
    scream.getScreenHeight = (): number => {
        return window.screen[scream.getOrientation() === 'portrait' ? 'height' : 'width'];
    };

    /**
     * Generates a viewport tag reflecting the content width relative to the device orientation
     * and scale required to fit the content in the viewport.
     *
     * Appends the tag to the document.head and removes the preceding additions.
     */
    scream.updateViewport = () => {
        const width = scream.getViewportWidth();
        const scale = scream.getScale();

        const content =
             'width=' + width +
            ', initial-scale=' + scale +
            ', minimum-scale=' + scale +
            ', maximum-scale=' + scale +
            ', user-scalable=0';

        const viewport = document.createElement('meta');

        viewport.name = 'viewport';
        viewport.content = content;

        const oldViewport = window.document.head.querySelector('meta[name="viewport"]');

        if (oldViewport) {
            oldViewport.parentNode.removeChild(oldViewport);
        }

        window.document.head.appendChild(viewport);
    };

    /**
     * @property 0 window.innerWidth when device is in a portrait orientation, scale 0.25 and page is the minimal view
     * @property 1 window.innerHeight when device is in a portrait orientation, scale 0.25 and page is the minimal view
     * @property 2 window.innerWidth when device is in a landscape orientation, scale 0.25 and page is the minimal view
     * @property 3 window.innerHeight when device is in a landscape orientation, scale 0.25 and page is the minimal view
     * @property 4 screen.width
     * @property 5 screen.height
     * @property 6 devicePixelRatio
     * @property 7 name
     */
    type SpecType = Array;

    /**
     * Uses static device environment variables (screen.width, screen.height, devicePixelRatio) to recognize device spec.
     */
    scream.deviceSpec = (): SpecType => {
        let index,
            spec;

        const specs = [
            [1280, 1762, 1920, 1280, 320, 480, 2, 'iPhone 4/4S'],
            [1280, 2114, 2272, 1280, 320, 568, 2, 'iPhone 5/5c/5s/SE and 6/6s (Zoomed)'],
            [1500, 2510, 2668, 1500, 375, 667, 2, 'iPhone 6/6s/7/8'],
            [1656, 2785, 2944, 1656, 414, 736, 3, 'iPhone 6+/6s+/7+/8+'],
            [1500, 2509, 2668, 1500, 375, 667, 3, 'iPhone 6+/6s+/7+/8+ (Zoomed)'],

            [3072, 3936, 4096, 2912, 768, 1024, 1, 'iPad 2'],
            [3072, 3938, 4096, 2914, 768, 1024, 2, 'iPad Air/Retina/Pro (9.7-inch)'],
            [3336, 4290, 4448, 3178, 834, 1112, 2, 'iPad Pro (10.5-inch)'],
            [4096, 5306, 5464, 3938, 1024, 1366, 2, 'iPad Pro (12.9-inch)'],

            [1656, 3330, 3584, 1656, 414, 896, 2, 'iPhone XR'],
            [1500, 2993, 3248, 1500, 375, 812, 3, 'iPhone X/XS'],
            [1656, 3329, 3584, 1656, 414, 896, 3, 'iPhone XS Max']
        ];

        index = specs.length;

        while (index--) {
            if (window.screen.width === specs[index][4] &&
                window.screen.height === specs[index][5] &&
                window.devicePixelRatio === specs[index][6]) {
                spec = specs[index];

                break;
            }
        }

        return spec;
    };

    /**
     * Returns height of the usable viewport in the minimal view relative to the current viewport width.
     *
     * This method will work with iOS8 only.
     *
     * @see http://stackoverflow.com/questions/26827822/how-is-the-window-innerheight-derived-of-the-minimal-view/26827842
     * @see http://stackoverflow.com/questions/26801943/how-to-get-the-window-size-of-fullscream-view-when-not-in-fullscream
     */
    scream.getMinimalViewHeight = (): number => {
        let height;

        const orientation = scream.getOrientation();
        const spec = scream.deviceSpec();

        if (!spec) {
            throw new Error('Not a known iOS device. If you are using an iOS device, report it to https://github.com/gajus/scream/issues/1.');
        }

        if (orientation === 'portrait') {
            height = Math.round(scream.getViewportWidth() * spec[1] / spec[0]);
        } else {
            height = Math.round(scream.getViewportWidth() * spec[3] / spec[2]);
        }

        return height;
    };

    type DimensionsType = {
        width: number,
        height: number
    };

    /**
     * Returns dimensions of the usable viewport in the minimal view relative to the current viewport width and orientation.
     */
    scream.getMinimalViewSize = (): DimensionsType => {
        const width = scream.getViewportWidth();
        const height = scream.getMinimalViewHeight();

        return {
            height,
            width
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
     */
    scream.isMinimalView = (): boolean => {
        // It is enough to check the height, because the viewport is based on width.
        return window.innerHeight === scream.getMinimalViewSize().height;
    };

    /**
     * Detect when view changes from full to minimal and vice-versa.
     */
    scream.detectViewChange = () => {
        let lastView;

        // This method will only with iOS 8.
        // Overwrite the event handler to prevent an error.
        if (!scream.deviceSpec()) {
            /* eslint-disable no-console */
            console.log('View change detection has been disabled. Unrecognized device. If you are using an iOS device, report it to https://github.com/gajus/scream/issues/1.');
            /* eslint-enable */

            return () => {};
        }

        return () => {
            const currentView = scream.isMinimalView() ? 'minimal' : 'full';

            if (lastView !== currentView) {
                eventEmitter.trigger('viewchange', {
                    viewName: currentView
                });

                lastView = currentView;
            }
        };
    };

    scream.detectViewChange = scream.detectViewChange();

    scream.setupDOMEventListeners = () => {
        let isOrientationChanging;

        // Media matcher is the first to pick up the orientation change.
        window
            .matchMedia('(orientation: portrait)')
            .addListener(() => {
                isOrientationChanging = true;
            });

        OCE.on('orientationchangeend', () => {
            isOrientationChanging = false;

            scream.updateViewport();
            scream.detectViewChange();

            eventEmitter.trigger('orientationchangeend');
        });

        window.addEventListener('orientationchange', () => {
            scream.updateViewport();
        });

        window.addEventListener('resize', () => {
            if (!isOrientationChanging) {
                scream.detectViewChange();
            }
        });

        // iPhone 6 plus does not trigger resize event when leaving the minimal-ui in the landscape orientation.
        window.addEventListener('scroll', () => {
            if (!isOrientationChanging) {
                scream.detectViewChange();
            }
        });

        setTimeout(() => {
            scream.detectViewChange();
        });
    };

    scream.updateViewport();
    scream.setupDOMEventListeners();

    scream.on = eventEmitter.on;
    scream.off = eventEmitter.off;

    return scream;
};
