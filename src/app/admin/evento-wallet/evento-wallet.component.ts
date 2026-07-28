import { Component, Input, OnInit } from '@angular/core';
import { Wallet } from '../models/wallet';
import { WalletMovimento } from '../models/walletmovimento';
import { WalletService } from '../services/wallet.service';

@Component({
  selector: 'app-evento-wallet',
  templateUrl: './evento-wallet.component.html',
  styleUrls: ['./evento-wallet.component.scss']
})
export class EventoWalletComponent implements OnInit {

  @Input() eventoId!: string;

  wallet: Wallet = {
    id: '',
    organizadorId: '',
    saldoDisponivel: 0,
    saldoPendente: 0,
    saldoRepassado: 0,
    receitaTotal: 0
  };

  movimentos: WalletMovimento[] = [];
  movimentosFiltro: WalletMovimento[] = [];

  loading = false;

  filtro = {
    pesquisa: '',
    tipo: 'Todos',
    dataInicial: null as Date | null,
    dataFinal: null as Date | null
  };

  tipos: string[] = [
    'Todos',
    'Pagamento PIX',
    'Pagamento Cartão',
    'Liberação',
    'Repasse',
    'Ajuste'
  ];

  constructor(
    private walletService: WalletService
  ) { }

  ngOnInit(): void {

    if (!this.eventoId)
      return;

    this.carregarDados();

  }

  carregarDados(): void {

    this.loading = true;

    this.walletService.getWallet(this.eventoId)
      .subscribe({

        next: (resp) => {
          this.wallet = resp;
            console.log(this.wallet)
        }

      });

    this.walletService.getExtrato(this.eventoId)
      .subscribe({

        next: (resp) => {

          this.movimentos = resp;
          this.movimentosFiltro = [...resp];

          this.loading = false;

        },
        error: () => {

          this.loading = false;

        }

      });

      

  }

  filtrar(): void {

    this.movimentosFiltro = this.movimentos.filter(x => {

      let valido = true;

      if (this.filtro.tipo !== 'Todos')
        valido = valido && x.tipo === this.filtro.tipo;

      if (this.filtro.pesquisa) {

        const pesquisa = this.filtro.pesquisa.toLowerCase();

        valido =
          valido &&
          (
            (x.descricao ?? '').toLowerCase().includes(pesquisa) ||
            (x.referencia ?? '').toLowerCase().includes(pesquisa) ||
            (x.observacao ?? '').toLowerCase().includes(pesquisa)
          );

      }

      if (this.filtro.dataInicial)
        valido =
          valido &&
          new Date(x.dataMovimento) >= this.filtro.dataInicial;

      if (this.filtro.dataFinal)
        valido =
          valido &&
          new Date(x.dataMovimento) <= this.filtro.dataFinal;

      return valido;

    });

  }

  limparFiltro(): void {

    this.filtro = {

      pesquisa: '',
      tipo: 'Todos',
      dataInicial: null,
      dataFinal: null

    };

    this.movimentosFiltro = [...this.movimentos];

  }

  get totalEntradas(): number {

    return this.movimentosFiltro
      .reduce((a, b) => a + b.entrada, 0);

  }

  get totalSaidas(): number {

    return this.movimentosFiltro
      .reduce((a, b) => a + b.saida, 0);

  }

  exportarExcel(): void {

    // implementar futuramente

  }

  solicitarRepasse(): void {

    // abrir dialog posteriormente

  }

}