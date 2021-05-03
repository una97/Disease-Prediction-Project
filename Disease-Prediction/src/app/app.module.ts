import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { HttpClientModule } from '@angular/common/http'; //must be added here to load local csv file in this project
import {File} from '@ionic-native/file/ngx';
import { PapaParseModule } from 'ngx-papaparse';




import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,HttpClientModule, PapaParseModule], 
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },File],
  bootstrap: [AppComponent],
})
export class AppModule {}
