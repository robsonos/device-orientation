import { Injectable } from '@angular/core';
import { type Orientation, type OrientationOptions, DeviceOrientation } from 'capacitor-community-device-orientation';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DeviceOrientationService {
  watchOrientationObservable(options: OrientationOptions): Observable<Orientation> {
    return new Observable<Orientation>((observer) => {
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
