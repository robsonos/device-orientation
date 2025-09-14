import { Injectable } from '@angular/core';
import {
  type DeviceOrientationData,
  type DeviceOrientationOptions,
  DeviceOrientation,
} from 'capacitor-community-device-orientation';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DeviceOrientationService {
  watchOrientationObservable(options: DeviceOrientationOptions): Observable<DeviceOrientationData> {
    return new Observable<DeviceOrientationData>((observer) => {
      let watchId: string | null = null;

      // Start watching
      DeviceOrientation.watchOrientation((position) => {
        observer.next(position);
      }, options)
        .then((id) => {
          watchId = id;
        })
        .catch((error) => {
          observer.error(error);
        });

      // Teardown logic
      return () => {
        if (watchId !== null) {
          DeviceOrientation.clearWatch({ id: watchId }).catch((error) => {
            // Optionally log or handle cleanup errors
            console.warn('Failed to clear watch:', error);
          });
        }
      };
    });
  }
}
