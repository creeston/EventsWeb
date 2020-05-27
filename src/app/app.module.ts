import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MaterialModule } from './material.module';
import { AppComponent } from './app.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { EventService } from './event-service';
import { EventModule } from './modules/event/event.module';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CallbackComponent } from './callback.component';
import { RouterModule } from '@angular/router';
import * as Auth0 from 'auth0-web';
import {HomeComponent} from './home.component';
import {NavbarModule} from './modules/navbar/navbar.module';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';



import {TranslateModule, TranslateLoader, TranslatePipe} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}


@NgModule({
  declarations: [
    AppComponent,
    CallbackComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    NoopAnimationsModule,
    MaterialModule,
    FormsModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgxMaterialTimepickerModule.setLocale('be-BY'),
    EventModule,
    HttpClientModule,
    NavbarModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    RouterModule.forRoot([
      { path: '', component: HomeComponent },
      { path: 'callback', component: CallbackComponent },
    ])
  ],
  providers: [
    EventService,
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    Auth0.configure({
      domain: 'dev-rb27frp3.eu.auth0.com',
      audience: 'events-api',
      clientID: 'Ln6J40WOoH2R5ya043dkp7tLK0zxXU1Q',
      redirectUri: 'http://localhost:4200/callback',
      scope: 'openid profile manage:events'
    });
  }
}
