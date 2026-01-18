import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AdminRoutingModule } from './admin-routing.module';
import { SectionListComponent } from './section-list/ section-list.component';
import { EventoFormComponent } from './evento-form/evento-form.component';
import { EventoListComponent } from './evento-list/evento-list.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { SectionFormComponent } from './section-form/section-form.component';
import { ModalReenvioComponent } from './modal-reenvio/modal-reenvio.component';
import { LoginComponent } from './login/login.component';
import { AuthLayoutComponent } from './auth/auth-layout.component';
import { UsuariosFormComponent } from './usuarios/usuarios-form/usuario-form.component';
import { UsuariosListComponent } from './usuarios/usuarios-list/usuarios-list.component';


@NgModule({
  declarations: [
    EventoListComponent,
    EventoFormComponent,
    SectionListComponent,
    SectionFormComponent,
    ModalReenvioComponent,
    LoginComponent,
    AuthLayoutComponent,
    UsuariosFormComponent,
    UsuariosListComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    AdminRoutingModule,
    AngularEditorModule
  ]
})
export class AdminModule {}
