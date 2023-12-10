// External dependencies
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Components
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { HomeComponent } from './home/home.component';
import { MaterialModule } from './shared/material/material.module';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [AppComponent,HomeComponent],
  imports: [AppRoutingModule, HttpClientModule, BrowserModule,BrowserAnimationsModule,SharedModule,MaterialModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
