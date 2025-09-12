/* eslint-disable @typescript-eslint/no-unused-vars */
import { WebPlugin } from '@capacitor/core';

import type { DeviceOrientationPlugin, Orientation, OrientationWatchCallback, OrientationOptions } from './definitions';

export class DeviceOrientationWeb extends WebPlugin implements DeviceOrientationPlugin {
  private watchHandlers = new Map<string, (event: DeviceOrientationEvent) => void>();

  async watchOrientation(callback: OrientationWatchCallback, _options?: OrientationOptions): Promise<string> {
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

  private startWatch(callback: OrientationWatchCallback): string {
    const watchId = this.generateWatchId();
    const handler = (event: DeviceOrientationEvent) => {
      const orientation: Orientation = {
        heading: event.alpha || 0,
        pitch: event.beta || 0,
        roll: event.gamma || 0,
        headingError: 180,
      };
      callback(orientation);
    };

    window.addEventListener('deviceorientation', handler);
    this.watchHandlers.set(watchId, handler);
    return watchId;
  }

  async clearWatch(watchId: string): Promise<void> {
    const handler = this.watchHandlers.get(watchId);
    if (handler) {
      window.removeEventListener('deviceorientation', handler);
      this.watchHandlers.delete(watchId);
    }
  }

  private generateWatchId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }
}
