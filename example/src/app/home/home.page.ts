import { DecimalPipe, JsonPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonItemDivider,
} from '@ionic/angular/standalone';

import { DeviceOrientationService } from '../services/device-orientation.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonItemDivider, IonLabel, IonItem, IonList, IonHeader, IonToolbar, IonTitle, IonContent, DecimalPipe],
})
export class HomePage {
  private readonly deviceOrientationService = inject(DeviceOrientationService);
  deviceOrientation = toSignal(this.deviceOrientationService.watchOrientationObservable({ frequency: 'default' }));

  headingAccuracy = computed(() => {
    const headingError = this.deviceOrientation()?.fused?.headingError;

    if (headingError == null || headingError < 0) {
      return 'UNKNOWN';
    }

    if (headingError === 180) {
      return 'UNRELIABLE';
    }

    if (headingError >= 90) {
      return 'INACCURATE';
    }

    if (headingError >= 45) {
      return 'LOW ACCURACY';
    }

    if (headingError >= 5) {
      return 'MED ACCURACY';
    }

    if (headingError >= 0) {
      return 'HIGH ACCURACY';
    }

    return 'UNKNOWN';
  });
}
