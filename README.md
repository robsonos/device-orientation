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

- **Android**: No permissions are required. The output rate on Android is limited to 200Hz on devices running API level 31 (Android S) or higher, unless the android.permissions. `HIGH_SAMPLING_RATE_SENSORS` permission was added to your Manifest.xml.

- **iOS**: iOS requires the `NSMotionUsageDescription` key to be added to your app's `Info.plist` file.

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
watchOrientation(callback: DeviceOrientationWatchCallback, options?: DeviceOrientationOptions | undefined) => Promise<DeviceOrientationCallbackID>
```

Set up a listener to continuously receive device orientation updates.

On **Android**, this API returns a complete <a href="#deviceorientationdata">`DeviceOrientationData`</a> object, including
`fused` heading and `attitude` quaternion data from the FusedOrientationProviderClient
for high accuracy.

On **iOS**, this API returns a <a href="#deviceorientationdata">`DeviceOrientationData`</a> object containing `orientation`
and `attitude` data. The `fused` property will be undefined.

On the **Web**, this API returns a partial <a href="#deviceorientationdata">`DeviceOrientationData`</a> object containing
only the `orientation` property (azimuth, pitch, roll) from the standard
DeviceOrientationEvent API. The `fused` and `attitude` properties will be undefined.
On iOS 13+, this will first prompt the user for permission.

| Param          | Type                                                                                      | Description                                               |
| -------------- | ----------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| **`callback`** | <code><a href="#deviceorientationwatchcallback">DeviceOrientationWatchCallback</a></code> | The function to call when a new orientation is available. |
| **`options`**  | <code><a href="#deviceorientationoptions">DeviceOrientationOptions</a></code>             | Options for configuring the watch.                        |

**Returns:** <code>Promise&lt;string&gt;</code>

**Since:** 7.0.0

---

### clearWatch(...)

```typescript
clearWatch(options: DeviceOrientationClearWatchOptions) => Promise<void>
```

Remove a watch listener by its ID.

| Param         | Type                                                                                              | Description                                                 |
| ------------- | ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| **`options`** | <code><a href="#deviceorientationclearwatchoptions">DeviceOrientationClearWatchOptions</a></code> | The options object containing the ID of the watch to clear. |

**Since:** 7.0.0

---

### Interfaces

#### DeviceOrientationData

A comprehensive object containing all available orientation data from a single device event.

| Prop              | Type                                                          | Description                                                                             | Since |
| ----------------- | ------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ----- |
| **`orientation`** | <code><a href="#orientation">Orientation</a></code>           | The device's orientation expressed in Euler angles. This is available on all platforms. | 7.0.0 |
| **`fused`**       | <code><a href="#fusedorientation">FusedOrientation</a></code> | The fused heading data, which includes corrections for True North.                      | 7.0.0 |
| **`attitude`**    | <code><a href="#attitude">Attitude</a></code>                 | The raw attitude data as a quaternion.                                                  | 7.0.0 |

#### Orientation

Euler angles (Azimuth, Pitch, Roll) calculated from the raw device attitude.

| Prop          | Type                | Description                                                                                                                                                                                                                         | Since |
| ------------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| **`azimuth`** | <code>number</code> | The angle of rotation about the -z axis, in degrees. This value represents the angle between the device's y-axis and the magnetic north pole. On Android, the range is [-180, 180]. On iOS (native and web), the range is [0, 360]. | 7.0.0 |
| **`pitch`**   | <code>number</code> | The angle of rotation about the -x axis, in degrees. This value represents the angle between a plane parallel to the device's screen and a plane parallel to the ground. On Android, the range is [-90, 90].                        | 7.0.0 |
| **`roll`**    | <code>number</code> | The angle of rotation about the y-axis, in degrees. This value represents the angle between a plane perpendicular to the device's screen and a plane perpendicular to the ground. On Android, the range is [-180, 180].             | 7.0.0 |

#### FusedOrientation

High-level, filtered heading data from the fused orientation provider.

| Prop               | Type                | Description                                                                                                 | Since |
| ------------------ | ------------------- | ----------------------------------------------------------------------------------------------------------- | ----- |
| **`heading`**      | <code>number</code> | The estimated heading of the device in degrees from [0, 360), aiming for True North when possible.          | 7.0.0 |
| **`headingError`** | <code>number</code> | The estimated error in the reported heading in degrees, from [0, 180]. This represents half the error cone. | 7.0.0 |

#### Attitude

The raw attitude of the device represented as a quaternion.

| Prop             | Type                                              | Description                                                              | Since |
| ---------------- | ------------------------------------------------- | ------------------------------------------------------------------------ | ----- |
| **`quaternion`** | <code><a href="#quaternion">Quaternion</a></code> | The device's attitude, represented as a rotation vector in a quaternion. | 7.0.0 |

#### DeviceOrientationOptions

Options for configuring the orientation watch.

| Prop            | Type                                         | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Default                | Since |
| --------------- | -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- | ----- |
| **`frequency`** | <code>'default' \| 'medium' \| 'fast'</code> | The desired frequency of updates. - `'default'`: 50Hz / 20ms period, Recommended for users looking for a trade-off between lower battery usage and frequent orientation updates. - `'fast'`: 200Hz / 5ms period. This higher update is for users requiring a higher level of precision, at the cost of battery usage. - '`medium`': 100Hz / 10ms period. This higher update frequency is for users requiring a higher level of precision, at the cost of battery usage. | <code>'default'</code> | 7.0.0 |

#### DeviceOrientationClearWatchOptions

Options for the clearWatch method.

| Prop     | Type                                                                                | Description                                              | Since |
| -------- | ----------------------------------------------------------------------------------- | -------------------------------------------------------- | ----- |
| **`id`** | <code><a href="#deviceorientationcallbackid">DeviceOrientationCallbackID</a></code> | The callback ID returned by `watchOrientation` to clear. | 7.0.0 |

### Type Aliases

#### DeviceOrientationWatchCallback

The callback function to be invoked on each orientation update.

<code>
  (orientation: <a href="#deviceorientationdata">DeviceOrientationData</a>, err?: any): void
</code>

#### Quaternion

A 4-element array representing the [qx, qy, qz, qw] components of a quaternion.

<code>[qx: number, qy: number, qz: number, qw: number]</code>

#### DeviceOrientationCallbackID

A string identifier for a registered watch callback.

<code>string</code>

</docgen-api>

### Errors

The plugin returns specific errors with specific codes on native Android. Web does not follow this standard for errors. The following table list all the plugin errors:

| Error code   | Platform(s) | Message                               |
| ------------ | ----------- | ------------------------------------- |
| DEV-ORI-0001 | Android     | Could not start orientation listener. |
| DEV-ORI-0002 | Android     | WatchId not found.                    |
| DEV-ORI-0003 | Android     | WatchId needs to be provided.         |

There was en error trying to obtain the location.

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
