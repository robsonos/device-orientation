import { registerPlugin } from '@capacitor/core';

import type { DeviceOrientationPlugin } from './definitions';

const DeviceOrientation = registerPlugin<DeviceOrientationPlugin>('DeviceOrientation', {
  web: () => import('./web').then((m) => new m.DeviceOrientationWeb()),
});

export * from './definitions';
export { DeviceOrientation };
