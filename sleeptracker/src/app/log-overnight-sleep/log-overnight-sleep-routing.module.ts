import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LogOvernightSleepPage } from './log-overnight-sleep.page';

const routes: Routes = [
  {
    path: '',
    component: LogOvernightSleepPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LogOvernightSleepPageRoutingModule {}
