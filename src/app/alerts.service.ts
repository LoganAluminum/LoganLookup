import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlertsService {
  alerts: string[] = [];

  add(message: string, debug: string = '') {
    this.alerts.push(message + (debug ? ': ' + debug : ''));
    console.warn(message, debug);
  }

  clear() {
    this.alerts = [];
  }
}