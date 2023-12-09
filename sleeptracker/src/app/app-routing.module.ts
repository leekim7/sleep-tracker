import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomePageModule) },
  // { path: 'log-overnight-sleep', loadChildren: () => import('./log-overnight-sleep/log-overnight-sleep.module').then(m => m.LogOvernightSleepPageModule) },
  // { path: 'log-sleepiness', loadChildren: () => import('./log-sleepiness/log-sleepiness.module').then(m => m.LogSleepinessPageModule) },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
