import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { CalendarComponent } from '../calendar/calendar.component';
import { HomePageRoutingModule } from './home-routing.module';
import { ChunkPipe } from '../chunk.pipe'; // Adjust the path as needed

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule
  ],
  declarations: [HomePage, CalendarComponent, ChunkPipe,]
})
export class HomePageModule {}
