import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Home', url: '/home', icon: 'home' },
    { title: 'Log Overnight Sleep', url: '/log-overnight-sleep', icon: 'bed' },
    { title: 'Log Sleepiness', url: '/log-sleepiness', icon: 'moon' },
  ];
  
  // Ensure enable is set to true
  public menuOptions = { enable: true };
}
