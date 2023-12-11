import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy, RouterModule } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LogOvernightSleepPageModule } from './log-overnight-sleep/log-overnight-sleep.module';
import { LogSleepinessPageModule } from './log-sleepiness/log-sleepiness.module';
import { UiComponent } from './ui/ui.component';
import { ChunkPipe } from './chunk.pipe';

@NgModule({
  declarations: [
    AppComponent,
    UiComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    LogOvernightSleepPageModule,
    LogSleepinessPageModule,
    RouterModule,
    IonicModule.forRoot()
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}