import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { HomePage } from './home.page';
import { CalendarComponent } from '../calendar/calendar.component';
import { HomePageRoutingModule } from './home-routing.module';
import { ChunkPipe } from '../chunk.pipe';
import { HandtrackerComponent } from '../handtracker/handtracker.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule
  ],
  declarations: [HomePage, CalendarComponent, ChunkPipe, HandtrackerComponent,],
  exports: [
    HandtrackerComponent,
  ]
})
export class HomePageModule {}
