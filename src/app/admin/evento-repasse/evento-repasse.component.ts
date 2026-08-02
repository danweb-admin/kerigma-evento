import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { Wallet } from '../models/wallet';
import { RepasseService } from '../services/repasse.service';

@Component({
  selector: 'app-evento-repasse',
  templateUrl: './evento-repasse.component.html',
  styleUrls: ['./evento-repasse.component.scss']
})
export class EventoRepasseComponent implements OnInit {

  @Input() wallet!: Wallet;
  @Input() eventoId!: string;

  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  form!: FormGroup;
  salvando = false;

  tiposPix = [
    'CPF',
    'CNPJ',
    'EMAIL',
    'TELEFONE',
    'ALEATORIA'
  ];

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private repasseService: RepasseService
  ) { }

  ngOnInit(): void {

    this.form = this.fb.group({
      eventoId: [this.eventoId],
      walletId: [this.wallet.id],
      valor: [
        this.wallet.saldoDisponivel,
        [
          Validators.required,
          Validators.min(0.01)
        ]
      ],
      nomeBeneficiario: ['', Validators.required],
      emailBeneficiario: ['', Validators.required],
      chavePix: ['', Validators.required],
      tipoChavePix: ['CPF', Validators.required],
      observacao: ['']
    });

  }

  solicitar() {
    if (this.form.invalid)
      return;

    if (this.form.value.valor > this.wallet.saldoDisponivel) {
      this.toastr.error('O valor solicitado é maior que o saldo disponível.');
      return;
    }

    this.salvando = true;
    this.repasseService
      .solicitar(this.form.value)
      .subscribe({
        next: () => {
          this.toastr.success('Repasse solicitado com sucesso.');

          this.saved.emit();
          this.close.emit();
        },
        error: () => {
          this.salvando = false;
        }
      });
  }

  cancelar() {
    this.close.emit();
  }
}