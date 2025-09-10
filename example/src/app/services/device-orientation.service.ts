import { Injectable } from '@angular/core';
import type { Orientation, WatchOptions } from 'capacitor-community-device-orientation';
import { DeviceOrientation } from 'capacitor-community-device-orientation';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DeviceOrientationService {
  watchOrientationObservable(options: WatchOptions): Observable<Orientation | null> {
    return new Observable<Orientation | null>((observer) => {
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
          DeviceOrientation.clearWatch(watchId).catch((error) => {
            // Optionally log or handle cleanup errors
            console.warn('Failed to clear watch:', error);
          });
        }
      };
    });
  }
}
