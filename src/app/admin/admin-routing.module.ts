import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { EventoListComponent } from './evento-list/evento-list.component';
import { EventoFormComponent } from './evento-form/evento-form.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { AuthLayoutComponent } from './auth/auth-layout.component';
import { UsuariosFormComponent } from './usuarios/usuarios-form/usuario-form.component';
import { UsuariosListComponent } from './usuarios/usuarios-list/usuarios-list.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: 'eventos', component: EventoListComponent, canActivate: [AuthGuard] },
      { path: 'eventos/novo', component: EventoFormComponent, canActivate: [AuthGuard] },
      { path: 'eventos/editar/:id', component: EventoFormComponent, canActivate: [AuthGuard] },
      { path: 'usuarios', component: UsuariosListComponent, canActivate: [AuthGuard] },
      { path: 'usuarios/novo', component: UsuariosFormComponent, canActivate: [AuthGuard] },
      { path: 'usuarios/editar/:id', component: UsuariosFormComponent, canActivate: [AuthGuard] },
      { path: '', redirectTo: 'eventos', pathMatch: 'full' }
    ]
  },
  {
    path: 'login',
    component: AuthLayoutComponent,
    children: [
      { path: '', component: LoginComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}


