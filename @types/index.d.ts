export = scream;
export as namespace scream;

declare namespace scream {
  interface IWidthType {
    portrait?: number;
    landscape?: number;
  }

  interface IDimensionsType {
    width: number;
    height: number;
  }

  interface IConfigType {
    viewport?: boolean;
    width?: IWidthType;
  }

  interface IListener<T> {
    name: string;
    handler: (event: T) => void;
  }

  type EventType = "viewchange" | "orientationchangeend";
  type OrientationType = "portrait" | "landscape";

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
  type SpecType = [number, number, number, number, number, number, string];
}

declare class scream {
  constructor(config: scream.IConfigType);

  /**
   * Whether to manage the viewport of the page.
   */
  public manageViewport(): boolean;

  /**
   * Viewport width relative to the device orientation.
   */
  public getViewportWidth(): number;

  /**
   * Viewport height relative to the device orientation and to scale with the viewport width.
   */
  public getViewportHeight(): number;

  /**
   * The ratio between screen width and viewport width.
   */
  public getScale(): number;

  /**
   * Get current orientation
   */
  public getOrientation(): scream.OrientationType;

  /**
   * Screen width relative to the device orientation.
   */
  public getScreenWidth(): number;

  /**
   * Screen height relative to the device orientation.
   */
  public getScreenHeight(): number;

  /**
   * Returns height of the usable viewport in the minimal view relative to the current viewport width.
   *
   * This method will work with iOS8 only.
   *
   * @see http://stackoverflow.com/questions/26827822/how-is-the-window-innerheight-derived-of-the-minimal-view/26827842
   * @see http://stackoverflow.com/questions/26801943/how-to-get-the-window-size-of-fullscream-view-when-not-in-fullscream
   */
  public getMinimalViewHeight(): number;

  /**
   * Returns dimensions of the usable viewport in the minimal view relative to the current viewport width and orientation.
   */
  public getMinimalViewSize(): scream.IDimensionsType;

  /**
   * Returns padding needed to prevent content from clashing with notch
   * https://stackoverflow.com/questions/46318395/detecting-mobile-device-notch
   */
  public getNotchPadding(): number;

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
  public isMinimalView(): boolean;

  /**
   * Event Emitter
   */
  public on<T extends scream.EventType>(
    event: T,
    handler: (event: T) => void
  ): scream.IListener<T>;
  public off<T>(listener: scream.IListener<T>): void;

  /**
   * Generates a viewport tag reflecting the content width relative to the device orientation
   * and scale required to fit the content in the viewport if enabled.
   *
   * Appends the tag to the document.head and removes the preceding additions.
   */
  private updateViewport(): number;

  /**
   * Uses static device environment variables (screen.width, screen.height, devicePixelRatio) to recognize device spec.
   */
  private deviceSpec(): scream.SpecType;

  /**
   * Detect when view changes from full to minimal and vice-versa.
   */
  private detectViewChange(): () => void;

  private setupDOMEventListeners(): void;
}
