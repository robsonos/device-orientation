/**
 * A 4-element array representing the [qx, qy, qz, qw] components of a quaternion.
 *
 * @since 7.0.0
 */
export type Quaternion = [qx: number, qy: number, qz: number, qw: number];

/**
 * Euler angles (Azimuth, Pitch, Roll) calculated from the raw device attitude.
 *
 * @since 7.0.0
 */
export interface Orientation {
  /**
   * The angle of rotation about the -z axis, in degrees. This value represents
   * the angle between the device's y-axis and the north pole.
   * The value is normalized to [0, 360] and is Clockwise (Compass style).
   * - **iOS**: Relative to True North (requires location permissions).
   * - **Android**: Relative to True North (if location is available), otherwise Magnetic North.
   *
   * @since 7.0.0
   */
  azimuth: number;

  /**
   * The angle of rotation about the -x axis, in degrees. This value represents
   * the angle between a plane parallel to the device's screen and a plane
   * parallel to the ground.
   * On Android and iOS, the range is [-90, 90].
   * Positive values indicate the top of the device is pointing down (towards the ground).
   * Negative values indicate the top of the device is pointing up (towards the sky).
   *
   * @since 7.0.0
   */
  pitch: number;

  /**
   * The angle of rotation about the y-axis, in degrees. This value represents
   * the angle between a plane perpendicular to the device's screen and a
   * plane perpendicular to the ground.
   * On Android and iOS, the range is [-180, 180].
   *
   * @since 7.0.0
   */
  roll: number;
}

/**
 * High-level, filtered heading data from the fused orientation provider.
 *
 * @platform android
 * @since 7.0.0
 */
export interface FusedOrientation {
  /**
   * The estimated heading of the device in degrees from [0, 360). Relative to True North
   * if location is available), otherwise Magnetic North.
   *
   * @since 7.0.0
   */
  heading: number;

  /**
   * The estimated error in the reported heading in degrees, from [0, 180].
   * This represents half the error cone.
   *
   * @since 7.0.0
   */
  headingError: number;
}

/**
 * The raw attitude of the device represented as a quaternion.
 * On both Android and iOS, the quaternion represents the rotation from the
 * East-North-Up (ENU) world reference frame to the device frame.
 *
 * @platform android, ios
 * @since 7.0.0
 */
export interface Attitude {
  /**
   * The device's attitude, represented as a rotation vector in a quaternion.
   *
   * @since 7.0.0
   */
  quaternion: Quaternion;
}

/**
 * A comprehensive object containing all available orientation data from a single device event.
 *
 * @since 7.0.0
 */
export interface DeviceOrientationData {
  /**
   * The device's orientation expressed in Euler angles. This is available on all platforms.
   *
   * @since 7.0.0
   */
  orientation: Orientation;

  /**
   * The fused heading data, which includes corrections for True North.
   *
   * @platform android
   * @since 7.0.0
   */
  fused?: FusedOrientation;

  /**
   * The accuracy of the magnetic field calibration.
   * -1: Uncalibrated
   * 0: Low
   * 1: Medium
   * 2: High
   *
   * @platform ios
   * @since 7.2.0
   */
  magneticFieldAccuracy?: number;

  /**
   * The raw attitude data as a quaternion.
   *
   * @platform android, ios
   * @since 7.0.0
   */
  attitude?: Attitude;
}

/**
 * The callback function to be invoked on each orientation update.
 *
 * @since 7.0.0
 */
export type DeviceOrientationWatchCallback = (orientation: DeviceOrientationData, err?: any) => void;

/**
 * Options for configuring the orientation watch.
 *
 * @since 7.0.0
 */
export interface DeviceOrientationOptions {
  /**
   * The desired frequency of updates.
   * - `'default'`: 50Hz / 20ms period, Recommended for users looking for a trade-off between lower battery usage and
   * frequent orientation updates.
   * - `'fast'`: 200Hz / 5ms period. This higher update is for users requiring a higher level of precision, at the cost
   * of battery usage.
   * - '`medium`': 100Hz / 10ms period. This higher update frequency is for users requiring a higher level of
   * precision, at the cost of battery usage.
   *
   * @default 'default'
   * @since 7.0.0
   */
  frequency: 'medium' | 'fast' | 'default';
}

/**
 * A string identifier for a registered watch callback.
 *
 * @since 7.0.0
 */
export type DeviceOrientationCallbackID = string;

/**
 * Options for the clearWatch method.
 *
 * @since 7.0.0
 */
export interface DeviceOrientationClearWatchOptions {
  /**
   * The callback ID returned by `watchOrientation` to clear.
   *
   * @since 7.0.0
   */
  id: DeviceOrientationCallbackID;
}

export interface DeviceOrientationPlugin {
  /**
   * Set up a listener to continuously receive device orientation updates.
   *
   * On **Android**, this API returns a complete `DeviceOrientationData` object, including
   * `fused` heading and `attitude` quaternion data from the FusedOrientationProviderClient
   * for high accuracy.
   *
   * On **iOS**, this API returns a `DeviceOrientationData` object containing `orientation`
   * and `attitude` data. The `fused` property will be undefined.
   *
   * On the **Web**, this API returns a partial `DeviceOrientationData` object containing
   * only the `orientation` property (azimuth, pitch, roll) from the standard
   * DeviceOrientationEvent API. The `fused` and `attitude` properties will be undefined.
   * On iOS 13+, this will first prompt the user for permission.
   *
   * @param callback The function to call when a new orientation is available.
   * @param options Options for configuring the watch.
   * @returns A promise that resolves with the callback ID of the watch.
   * @example
   * const watchId = await DeviceOrientation.watchOrientation((orientationData) => {
   * console.log('Orientation:', orientationData.orientation);
   * if (orientationData.fused) {
   * console.log('Fused Heading:', orientationData.fused.heading);
   * }
   * if (orientationData.attitude) {
   * console.log('Quaternion:', orientationData.attitude.quaternion);
   * }
   * });
   * @since 7.0.0
   */
  watchOrientation(
    callback: DeviceOrientationWatchCallback,
    options?: DeviceOrientationOptions,
  ): Promise<DeviceOrientationCallbackID>;

  /**
   * Remove a watch listener by its ID.
   *
   * @param options The options object containing the ID of the watch to clear.
   * @returns A promise that resolves when the watch is successfully cleared.
   * @example
   * DeviceOrientation.clearWatch({ id: watchId });
   * @since 7.0.0
   */
  clearWatch(options: DeviceOrientationClearWatchOptions): Promise<void>;
}
