import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SobreKerigmaModalComponent } from './sobre-kerigma-modal/sobre-kerigma-modal.component';
import { PoliticaPrivacidadeModalComponent } from './politica-privacidade-modal/politica-privacidade-modal.component';


@NgModule({
  declarations: [
    PoliticaPrivacidadeModalComponent,
    SobreKerigmaModalComponent
  ],

  imports: [
    CommonModule
  ],

  exports: [
    PoliticaPrivacidadeModalComponent,
    SobreKerigmaModalComponent
  ]
})
export class SharedModule { }