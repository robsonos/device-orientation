/**
 * Represents the physical orientation of the device.
 */
export interface Orientation {
  /**
   * The estimated heading of the device in degrees (0° to 360°)
   *
   * The heading of the device is defined as the direction where the top of the device is pointing, assuming that the
   * user is looking at the phone's screen and the phone is in hand. The heading is estimated clockwise from the true
   * north when magnetic declination is available, and clockwise from the magnetic north otherwise. Therefore, when the
   * device is pointing towards the north, the reported heading is ideally 0 degrees, towards east is 90 degrees, south
   * is 180 degrees and west is 270 degrees. Note that the heading may deviate from its ideal value because of local
   * magnetic disturbances or an uncalibrated magnetometer sensor.
   */
  heading: number;

  /**
   * Angle of rotation about the -x axis in degrees (-90° to 90°).
   *
   * This value represents the angle between a plane parallel to the device's screen and a plane parallel to the
   * ground. Assuming that the bottom edge of the device faces the user and that the screen is face-up, tilting the top
   * edge of the device toward the ground creates a positive pitch angle.
   */
  pitch: number;

  /**
   * Angle of rotation about the y axis in degrees (-180° to 180).
   *
   * This value represents the angle between a plane perpendicular to the device's screen and a plane perpendicular to
   * the ground. Assuming that the bottom edge of the device faces the user and that the screen is face-up, tilting the
   * right edge of the device toward the ground creates a positive roll angle.
   */
  roll: number;

  /**
   * The estimated error in the reported heading of the device in degrees (0° to 180).
   *
   * The reported error represents half the error cone. For example a value of 10.0 corresponds to a true heading
   * between -10.0 degrees and 10.0 degrees around the heading output. This method returns 180 in the case that the
   * estimated heading error is invalid. The error cone corresponds to two sigma error for small angles, which is
   * approximately the 95th percentile two-sided confidence interval. For large angles, the concept of a 95th
   * percentile confidence begins to break down, ultimately becoming meaningless when there is no knowledge of the
   * heading. Thus, when 180 degrees is reported it is no longer the 95th percentile confidence interval but instead a
   * declaration of complete ignorance of the true heading.
   */
  headingError: number;
}

/**
 * Callback for the watchOrientation method.
 */
export type OrientationWatchCallback = (orientation: Orientation | null, err?: any) => void;

export interface WatchOptions {
  /**
   * Specifies the desired frequency for orientation updates.
   *
   * This setting influences how often your application receives orientation data, directly affecting power consumption.
   * The actual update rate is not guaranteed and may vary depending on device capabilities, system load, or other
   * applications' requests. In some cases, updates may be delivered at a different rate or not at all if orientation
   * sources are unavailable.
   *
   * Available options:
   * - `'default'`:
   *   - 50Hz / 20ms period.
   *   - Recommended for users looking for a trade-off between lower battery usage and frequent orientation updates.
   * - `'fast'`
   *   - 200Hz / 5ms period.
   *   - This higher update is for users requiring a higher level of precision, at the cost of battery usage.
   * - '`medium`'
   *   - 100Hz / 10ms period.
   *   - This higher update frequency is for users requiring a higher level of precision, at the cost of battery usage.
   *
   * @default 'default'
   */
  frequency: 'medium' | 'fast' | 'default';
}

export interface DeviceOrientationPlugin {
  /**
   * Set up a listener to continuously receive orientation updates.
   *
   * @param callback Options for the watch.
   * @param options Options for the watch.
   * @returns A promise that resolves with a watch ID.
   */
  watchOrientation(callback: OrientationWatchCallback, options?: WatchOptions): Promise<string>;

  /**
   * Remove a watch listener by its ID.
   *
   * @param watchId The watch ID to clear.
   */
  clearWatch(watchId: string): Promise<void>;
}
