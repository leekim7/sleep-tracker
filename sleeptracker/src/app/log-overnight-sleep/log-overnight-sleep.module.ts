import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LogOvernightSleepPageRoutingModule } from './log-overnight-sleep-routing.module';
import { RouterModule } from '@angular/router';
import { LogOvernightSleepPage } from './log-overnight-sleep.page';  // Make sure this import is correct

@NgModule({
  declarations: [LogOvernightSleepPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: LogOvernightSleepPage,
      },
    ]),
  ],
})
export class LogOvernightSleepPageModule {}