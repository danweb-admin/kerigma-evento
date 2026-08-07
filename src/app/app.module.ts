import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { EventoLandingComponent } from './landing/evento-landing/evento-landing.component';
import { LandingModule } from './landing/landing.module';
import { ToastrModule } from 'ngx-toastr';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxMaskModule } from 'ngx-mask';
import { Interceptor } from './interceptor.service';
import { SpinnerComponent } from './spinner.component';
import { TokenInterceptor } from './admin/services/token.interceptor';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { PoliticaPrivacidadeModalComponent } from './shared/politica-privacidade-modal/politica-privacidade-modal.component';
import { SobreKerigmaModalComponent } from './shared/sobre-kerigma-modal/sobre-kerigma-modal.component';
import { SharedModule } from './shared/share.module';


registerLocaleData(localePt);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AdminComponent,
    SpinnerComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    LandingModule,
    SharedModule,
    AngularEditorModule,
    NgxMaskModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
  ],
  providers: [
  { provide: LOCALE_ID, useValue: 'pt-BR' },

  { provide: HTTP_INTERCEPTORS, useClass: Interceptor, multi: true },

  {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi: true
  }
],
  bootstrap: [AppComponent]
})
export class AppModule { }
