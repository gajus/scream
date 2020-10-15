import Sister from 'sister';
import OrientationChangeEnd from 'orientationchangeend';

const OCE = OrientationChangeEnd();

type ConfigType = {
    viewport: ?boolean,
    width: {
        portrait: ?number,
        landscape: ?number
    }
};

export default (config: ConfigType = {}): Object => {
    const scream = {};
    const eventEmitter = Sister();

    const deviceSpecsByOS = new Map<number, Array>([
        [
            0, // Default - pre iOS13 device specs
            [
                [1280, 1762, 1920, 1280, 320, 480, 2, 'iPhone 4/4s'],
                [1280, 2114, 2272, 1280, 320, 568, 2, 'iPhone 5/5c/5s/SE and 6/6s (Zoomed)'],
                [1500, 2510, 2668, 1500, 375, 667, 2, 'iPhone 6/6s/7/8'],
                [1656, 2785, 2944, 1656, 414, 736, 3, 'iPhone 6+/6s+/7+/8+'],
                [1500, 2509, 2668, 1500, 375, 667, 3, 'iPhone 6+/6s+/7+/8+ (Zoomed)'],

                [3072, 3936, 4096, 2912, 768, 1024, 1, 'iPad 2'],
                [3072, 3938, 4096, 2914, 768, 1024, 2, 'iPad Air/Retina/Pro (9.7-inch)'],
                [3336, 4290, 4448, 3178, 834, 1112, 2, 'iPad Pro (10.5-inch)'],
                [3336, 4602, 4776, 3162, 834, 1194, 2, 'iPad Pro (11-inch)'],
                [4096, 5306, 5464, 3938, 1024, 1366, 2, 'iPad Pro (12.9-inch)'],
                [4096, 5290, 5464, 3922, 1024, 1366, 2, 'iPad Pro (12.9-inch) 3rd generation'],

                [1656, 3330, 3584, 1656, 414, 896, 2, 'iPhone XR'],
                [1500, 2993, 3248, 1500, 375, 812, 3, 'iPhone X/XS'],
                [1656, 3329, 3584, 1656, 414, 896, 3, 'iPhone XS Max'],
            ]
        ],
        [
            13,
            [
                [1280, 1764, 1920, 1280, 320, 480, 2, 'iPhone 4/4s (iOS 13)'],
                [1280, 2116, 2272, 1280, 320, 568, 2, 'iPhone 5/5c/5s/SE and 6/6s (Zoomed) (iOS 13)'],
                [1500, 2512, 2668, 1500, 375, 667, 2, 'iPhone 6/6s/7/8 (iOS 13)'],
                [1656, 2788, 2944, 1656, 414, 736, 3, 'iPhone 6+/6s+/7+/8+ (iOS 13)'],
                [1500, 2512, 2668, 1500, 375, 667, 3, 'iPhone 6+/6s+/7+/8+ (Zoomed) (iOS 13)'],

                [3072, 3940, 4096, 3166, 768, 1024, 2, 'iPad Air/Retina/Pro (9.7-inch) (iOS 13)'],
                [3336, 4276, 4448, 3164, 834, 1112, 2, 'iPad Pro (10.5-inch) (iOS 13)'],
                [3336, 4604, 4776, 3164, 834, 1194, 2, 'iPad Pro (11-inch) (iOS 13)'],
                [4096, 5308, 5464, 3940, 1024, 1366, 2, 'iPad Pro (12.9-inch) (iOS 13)'],
                [4096, 5292, 5464, 3924, 1024, 1366, 2, 'iPad Pro (12.9-inch) 3rd generation (iOS 13)'],

                [1656, 3332, 3584, 1656, 414, 896, 2, 'iPhone XR (iOS 13)'],
                [1500, 2996, 3248, 1500, 375, 812, 3, 'iPhone X/XS (iOS 13)'],
                [1656, 3332, 3584, 1656, 414, 896, 3, 'iPhone XS Max (iOS 13)'],
            ]
        ],
        [
            14,
            [
                [1280, 1764, 1920, 1280, 320, 480, 2, 'iPhone 4/4s (iOS 14)'],
                [1280, 2116, 2272, 1280, 320, 568, 2, 'iPhone 5/5c/5s/SE and 6/6s (Zoomed) (iOS 14)'],
                [1500, 2512, 2668, 1500, 375, 667, 2, 'iPhone 6/6s/7/8/SE2 (iOS 14)'],
                [1656, 2788, 2944, 1656, 414, 736, 3, 'iPhone 6+/6s+/7+/8+ (iOS 14)'],
                [1500, 2512, 2668, 1500, 375, 667, 3, 'iPhone 6+/6s+/7+/8+ (Zoomed) (iOS 14)'],

                [3072, 3940, 4096, 3166, 768, 1024, 2, 'iPad Air/Retina/Pro (9.7-inch) (iOS 14)'],
                [3336, 4276, 4448, 3164, 834, 1112, 2, 'iPad Pro (10.5-inch) (iOS 14)'],
                [3336, 4604, 4448, 3048, 834, 1194, 2, 'iPad Pro (11-inch) (iOS 14)'],
                [4096, 5264, 4320, 3175, 810, 1080, 2, 'iPad 8th generation (iOS 14)'],
                [4096, 5308, 5464, 3940, 1024, 1366, 2, 'iPad Pro (12.9-inch) (iOS 14)'],
                [4096, 5292, 5464, 3924, 1024, 1366, 2, 'iPad Pro (12.9-inch) 3rd generation (iOS 14)'],

                [1656, 3316, 3584, 1656, 414, 896, 2, 'iPhone XR (iOS 14)'],
                [1500, 2996, 3248, 1500, 375, 812, 3, 'iPhone X/XS/11/11 Pro (iOS 14)'],
                [1656, 3332, 3584, 1656, 414, 896, 3, 'iPhone XS Max/11 Pro Max (iOS 14)'],
            ]
        ]
    ]);

    config.width = config.width || {};

    if (!config.width.portrait) {
        config.width.portrait = window.screen.width;
    }

    if (!config.width.landscape) {
        config.width.landscape = window.screen.width;
    }

    if (config.viewport === undefined) {
        config.viewport = true;
    }

    /**
     * Detects iOS version
     */
    scream.getIOSVersion = () => {
        if (/iP(hone|od|ad)/.test(navigator.platform)) {
            const v = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);
            return parseInt(v[1]);
        }

        // Detect iPadOS
        if(navigator.maxTouchPoints && navigator.maxTouchPoints > 2 && /MacIntel/.test(navigator.platform)) {
            const iPadV = navigator.appVersion.match(/Version\/(\d+).(\d+)/);
            return parseInt(iPadV[1]);
        }
    };

    /**
     * Whether to manage the viewport of the page.
     */
    scream.manageViewport = (): boolean => {
        return config.viewport;
    };

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
     * and scale required to fit the content in the viewport if enabled.
     *
     * Appends the tag to the document.head and removes the preceding additions.
     */
    scream.updateViewport = () => {
        if (!scream.manageViewport()) return;

        const width = scream.getViewportWidth();
        const scale = scream.getScale();
        const padding = scream.getNotchPadding();

        let content = 'width=' + width +
            ', initial-scale=' + scale +
            ', minimum-scale=' + scale +
            ', maximum-scale=' + scale +
            ', user-scalable=0' +
            ', viewport-fit=cover';

        if (padding > 0) {
            content = 'width=' + (width - padding) +
                ', initial-scale=' + scale +
                ', minimum-scale=' + scale +
                ', maximum-scale=' + scale +
                ', user-scalable=0';
        }

        const viewport = document.createElement('meta');
        viewport.name = 'viewport';
        viewport.content = content;

        const oldViewport = window.document.head.querySelector('meta[name="viewport"]');

        if (oldViewport) {
            // Workaround for viewport-fit change not having an immediate effect
            setTimeout(function (content, viewport) {
                if(scream.getNotchPadding() > 0 && content !== viewport) {
                    scream.updateViewport();
                }
            }, 2000, content, oldViewport.getAttribute('content'));
            oldViewport.parentNode.removeChild(oldViewport);
        } else {
            // Workaround for viewport-fit change not having an immediate effect
            setTimeout(function () {
                scream.updateViewport();
            }, 1000);
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

        const iOSVersion = scream.getIOSVersion();
        const latestDefinedSpecOS = Array.from(deviceSpecsByOS.keys()).reduce((acc, key) => Math.max(acc, key), 0);
        const defaultSpec = iOSVersion > latestDefinedSpecOS ? deviceSpecsByOS.get(latestDefinedSpecOS) : deviceSpecsByOS.get(0);
        const specs = deviceSpecsByOS.has(iOSVersion)
            ? deviceSpecsByOS.get(iOSVersion)
            : defaultSpec;

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
     * Returns padding needed to prevent content from clashing with notch
     * https://stackoverflow.com/questions/46318395/detecting-mobile-device-notch
     */
    scream.getNotchPadding = (): number => {
        let proceed = false;
        let div = document.createElement('div');
        if (CSS.supports('padding-left: env(safe-area-inset-left)')
            && CSS.supports('padding-left: env(safe-area-inset-right)')) {
            div.style.paddingLeft = 'env(safe-area-inset-left)';
            div.style.paddingRight = 'env(safe-area-inset-right)';
            proceed = true;
        } else if (CSS.supports('padding-left: constant(safe-area-inset-left)')
            && CSS.supports('padding-left: constant(safe-area-inset-right)')) {
            div.style.paddingLeft = 'constant(safe-area-inset-left)';
            div.style.paddingRight = 'constant(safe-area-inset-right)';
            proceed = true;
        }
        if (proceed) {
            document.body.appendChild(div);
            let paddingLeft = parseInt(window.getComputedStyle(div).paddingLeft);
            let paddingRight = parseInt(window.getComputedStyle(div).paddingRight);
            document.body.removeChild(div);
            return paddingLeft + paddingRight;
        }
        return 0;
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
