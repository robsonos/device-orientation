/* eslint-disable @typescript-eslint/no-unused-vars */
import { WebPlugin } from '@capacitor/core';

import type {
  DeviceOrientationPlugin,
  DeviceOrientationData,
  DeviceOrientationWatchCallback,
  DeviceOrientationOptions,
  DeviceOrientationClearWatchOptions,
  DeviceOrientationCallbackID,
} from './definitions';

export class DeviceOrientationWeb extends WebPlugin implements DeviceOrientationPlugin {
  private watchHandlers = new Map<string, (event: DeviceOrientationEvent) => void>();

  async watchOrientation(
    callback: DeviceOrientationWatchCallback,
    _options?: DeviceOrientationOptions,
  ): Promise<DeviceOrientationCallbackID> {
    if (
      typeof DeviceMotionEvent === 'undefined' ||
      // @ts-expect-error ignore
      typeof DeviceMotionEvent.requestPermission !== 'function'
    ) {
      return this.startWatch(callback);
    }

    // For iOS 13+, we need to request permission
    const state = await (DeviceOrientationEvent as any).requestPermission();
    if (state === 'granted') {
      return this.startWatch(callback);
    } else {
      throw this.unavailable('Permission to access device orientation was denied.');
    }
  }

  private startWatch(callback: DeviceOrientationWatchCallback): string {
    const watchId = this.generateWatchId();
    const handler = (event: DeviceOrientationEvent) => {
      const alpha = event.alpha ?? 0;
      // Convert from CCW (Web Standard) to CW (Android/Compass)
      const cwAzimuth = (360 - alpha) % 360;

      const deviceOrientation: DeviceOrientationData = {
        orientation: {
          azimuth: cwAzimuth,
          pitch: event.beta ?? 0,
          roll: event.gamma ?? 0,
        },
      };
      callback(deviceOrientation);
    };

    window.addEventListener('deviceorientation', handler);
    this.watchHandlers.set(watchId, handler);
    return watchId;
  }

  async clearWatch(options: DeviceOrientationClearWatchOptions): Promise<void> {
    const handler = this.watchHandlers.get(options.id);
    if (handler) {
      window.removeEventListener('deviceorientation', handler);
      this.watchHandlers.delete(options.id);
    }
  }

  private generateWatchId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }
}
