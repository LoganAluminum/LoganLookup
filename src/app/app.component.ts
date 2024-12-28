import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet], // Only RouterOutlet
  template: `<router-outlet></router-outlet>`, // Simple template
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {}