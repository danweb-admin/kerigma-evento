import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { EventoService } from '../../services/eventos.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-usuarios-list',
  templateUrl: './usuarios-list.component.html'
})
export class UsuariosListComponent implements OnInit {
  
  modalAberto = false;
  formUsuario!: FormGroup;

  usuarios: any[] = [];
  eventos: any[] = [];
  carregando = false;
  

  
  constructor(private toastr: ToastrService, 
                private fb: FormBuilder,
              private eventoService: EventoService
  ) {}
  
  ngOnInit() {
    this.formUsuario = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.required],
      eventoId: ['', Validators.required],
      active: [true]
    });
    this.carregarUsuarios();
    this.carregarEventos();
  }

  
  
  carregarUsuarios() {
    this.carregando = true;

    this.eventoService.getUsuarios().subscribe(resp => {
      this.usuarios = resp;
      this.carregando = false;
    })
  }

  carregarEventos(){
    this.eventoService.getEventos().subscribe(resp => {
      this.eventos = resp;
      this.carregando = false;
    })
  }
  
  abrirModal() {
    this.formUsuario.reset({ ativo: true });
    this.modalAberto = true;
  }

  fecharModal() {
    this.modalAberto = false;
  }

  salvar() {
    if (this.formUsuario.invalid) return;

    const payload = this.formUsuario.value;

    console.log('Salvar usuário:', payload);

    // chamada backend
    this.eventoService.createUsuarioCheckin(payload).subscribe(() => {
      this.fecharModal();
      this.carregarUsuarios();
    },(error: any) =>{
        debugger
      this.toastr.warning(error.error.message)
    });
  }
}
