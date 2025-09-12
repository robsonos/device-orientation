<p align="center"><br><img src="https://user-images.githubusercontent.com/236501/85893648-1c92e880-b7a8-11ea-926d-95355b8175c7.png" width="128" height="128" /></p>
<h3 align="center">Device Orientation</h3>
<p align="center"><strong><code>capacitor-community-device-orientation</code></strong></p>
<p align="center">
  Capacitor plugin to interface with device orientation.
</p>

<p align="center">
  <img 
      alt="Maintenance status"
      src="https://img.shields.io/maintenance/yes/2025?style=flat-square"/>
  <a
    href="https://github.com/robsonos/device-orientation/actions/workflows/ci.yml"
    style="color: inherit; text-decoration: none;">
    <img
      alt="GitHub Workflow Status (with event)"
      src="https://img.shields.io/github/actions/workflow/status/robsonos/device-orientation/ci.yml"/>
  </a>
  <a
    href="https://www.npmjs.com/package/capacitor-community-device-orientation"
    style="color: inherit; text-decoration: none;">
    <img
      alt="GitHub License"
      src="https://img.shields.io/npm/l/capacitor-community-device-orientation?style=flat-square"/>
  </a>
  <br />
  <a
    href="https://www.npmjs.com/package/capacitor-community-device-orientation"
    style="color: inherit; text-decoration: none;">
    <img
      alt="Version from npmjs"
      src="https://img.shields.io/npm/v/capacitor-community-device-orientation?style=flat-square"/>
  </a>
  <a
    href="https://www.npmjs.com/package/capacitor-community-device-orientation"
    style="color: inherit; text-decoration: none;">
    <img
      alt="Downloads from npmjs"
      src="https://img.shields.io/npm/dw/capacitor-community-device-orientation?style=flat-square"/>
  </a>
  <a href="#contributors"
    style="color: inherit; text-decoration: none;">
    <img
      alt="GitHub contributors from allcontributors.org"
      src="https://img.shields.io/github/all-contributors/robsonos/device-orientation">
  </a>
</p>

## Table of Contents

- [Maintainers](#maintainers)
- [Installation](#installation)
- [Permissions](#permissions)
- [API](#api)
- [Contributors](#contributors)

## Maintainers

| Maintainer | GitHub                                  | Active |
| ---------- | --------------------------------------- | ------ |
| robsonos   | [robsonos](https://github.com/robsonos) | yes    |

## Installation

```bash
npm install capacitor-community-device-orientation
npx cap sync
```

## Permissions

Please check the sample permissions in [Android](./example/android/app/src/main/AndroidManifest.xml) and [iOS](./example/ios/App/App/Info.plist) folders.

- **Android**: No permissions are required. The output rate on Android is limited to 200Hz on devices running API level 31 (Android S) or higher, unless the android.permissions.HIGH_SAMPLING_RATE_SENSORS permission was added to your Manifest.xml.

## Power consideration

Always request the longest update period (lowest frequency) that is sufficient for your use case. While more frequent updates can be required for high precision tasks (for example Augmented Reality), it comes with a power cost. If you do not know which update period to use, we recommend starting with `'default'` period as it fits most client needs.

## API

<docgen-index>

- [`watchOrientation(...)`](#watchorientation)
- [`clearWatch(...)`](#clearwatch)
- [Interfaces](#interfaces)
- [Type Aliases](#type-aliases)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

### watchOrientation(...)

```typescript
watchOrientation(callback: OrientationWatchCallback, options?: OrientationOptions | undefined) => Promise<string>
```

Set up a listener to continuously receive orientation updates.

| Param          | Type                                                                          | Description            |
| -------------- | ----------------------------------------------------------------------------- | ---------------------- |
| **`callback`** | <code><a href="#orientationwatchcallback">OrientationWatchCallback</a></code> | Options for the watch. |
| **`options`**  | <code><a href="#orientationoptions">OrientationOptions</a></code>             | Options for the watch. |

**Returns:** <code>Promise&lt;string&gt;</code>

**Since:** 7.0.0

---

### clearWatch(...)

```typescript
clearWatch(watchId: string) => Promise<void>
```

Remove a watch listener by its ID.

| Param         | Type                | Description            |
| ------------- | ------------------- | ---------------------- |
| **`watchId`** | <code>string</code> | The watch ID to clear. |

**Since:** 7.0.0

---

### Interfaces

#### Orientation

Represents the physical orientation of the device.

| Prop               | Type                | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | Since |
| ------------------ | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| **`heading`**      | <code>number</code> | The estimated heading of the device in degrees (0° to 360°) The heading of the device is defined as the direction where the top of the device is pointing, assuming that the user is looking at the phone's screen and the phone is in hand. The heading is estimated clockwise from the true north when magnetic declination is available, and clockwise from the magnetic north otherwise. Therefore, when the device is pointing towards the north, the reported heading is ideally 0 degrees, towards east is 90 degrees, south is 180 degrees and west is 270 degrees. Note that the heading may deviate from its ideal value because of local magnetic disturbances or an uncalibrated magnetometer sensor.                                                                                                          | 7.0.0 |
| **`pitch`**        | <code>number</code> | Angle of rotation about the -x axis in degrees (-90° to 90°). This value represents the angle between a plane parallel to the device's screen and a plane parallel to the ground. Assuming that the bottom edge of the device faces the user and that the screen is face-up, tilting the top edge of the device toward the ground creates a positive pitch angle.                                                                                                                                                                                                                                                                                                                                                                                                                                                          | 7.0.0 |
| **`roll`**         | <code>number</code> | Angle of rotation about the y axis in degrees (-180° to 180). This value represents the angle between a plane perpendicular to the device's screen and a plane perpendicular to the ground. Assuming that the bottom edge of the device faces the user and that the screen is face-up, tilting the right edge of the device toward the ground creates a positive roll angle.                                                                                                                                                                                                                                                                                                                                                                                                                                               |       |
| **`headingError`** | <code>number</code> | The estimated error in the reported heading of the device in degrees (0° to 180). The reported error represents half the error cone. For example a value of 10.0 corresponds to a true heading between -10.0 degrees and 10.0 degrees around the heading output. This method returns 180 in the case that the estimated heading error is invalid. The error cone corresponds to two sigma error for small angles, which is approximately the 95th percentile two-sided confidence interval. For large angles, the concept of a 95th percentile confidence begins to break down, ultimately becoming meaningless when there is no knowledge of the heading. Thus, when 180 degrees is reported it is no longer the 95th percentile confidence interval but instead a declaration of complete ignorance of the true heading. | 7.0.0 |

#### OrientationOptions

| Prop            | Type                                         | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Default                | Since |
| --------------- | -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- | ----- |
| **`frequency`** | <code>'default' \| 'medium' \| 'fast'</code> | Specifies the desired frequency for orientation updates. This setting influences how often your application receives orientation data, directly affecting power consumption. The actual update rate is not guaranteed and may vary depending on device capabilities, system load, or other applications' requests. In some cases, updates may be delivered at a different rate or not at all if orientation sources are unavailable. Available options: - `'default'`: 50Hz / 20ms period, Recommended for users looking for a trade-off between lower battery usage and frequent orientation updates. - `'fast'`: 200Hz / 5ms period. This higher update is for users requiring a higher level of precision, at the cost of battery usage. - '`medium`': 100Hz / 10ms period. This higher update frequency is for users requiring a higher level of precision, at the cost of battery usage. | <code>'default'</code> | 7.0.0 |

### Type Aliases

#### OrientationWatchCallback

Callback for the watchOrientation method.

<code>
  (orientation: <a href="#orientation">Orientation</a>, err?: any): void
</code>

</docgen-api>

### Errors

The plugin returns specific errors with specific codes on native Android. Web does not follow this standard for errors.

The following table list all the plugin errors:

| Error code    | Platform(s) | Message                               |
| ------------- | ----------- | ------------------------------------- |
| DEV-ORI--0001 | Android     | Could not start orientation listener. |
| DEV-ORI--0002 | Android     | WatchId not found.                    |
| DEV-ORI--0003 | Android     | WatchId needs to be provided.         |

There was en error trying to obtain the location.

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
