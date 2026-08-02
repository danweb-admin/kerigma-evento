import { Component, Input, OnInit } from '@angular/core';
import { Wallet } from '../models/wallet';
import { WalletMovimento } from '../models/walletmovimento';
import { WalletService } from '../services/wallet.service';
import { AuthService } from '../services/auth.service';
import { Repasse } from '../models/repasse';
import { RepasseService } from '../services/repasse.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-evento-wallet',
  templateUrl: './evento-wallet.component.html',
  styleUrls: ['./evento-wallet.component.scss']
})
export class EventoWalletComponent implements OnInit {
  
  @Input() eventoId!: string;
  showRepasse = false;
  
  showRepasseAdmin = false;
  repasses: Repasse[] = [];
  
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
  isAdmin = false;
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
    private walletService: WalletService,
    private authService: AuthService,
    private repasseService: RepasseService,
    private toastr: ToastrService
  ) { 
    let role = localStorage.getItem('role');
    if (role === 'admin'){
      this.isAdmin = true;
    }
    
  }
  
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
    this.showRepasse = true;
  }
  
  fecharRepasse(): void {
    this.showRepasse = false;
  }
  
  repasseSalvo(): void {
    this.showRepasse = false;
    
    // Atualiza os dados da tela
    this.carregarDados();
  }
  
  abrirRepassesAdmin() {
    this.repasseService
    .getByEvento(this.eventoId)
    .subscribe(resp => {
      
      this.repasses = resp;
      this.showRepasseAdmin = true;
    }); 
  }
  
  fecharRepassesAdmin() {
    this.showRepasseAdmin = false;
    
  }
  
  aprovarRepasse(repasse: Repasse) {
    
    this.repasseService
    .aprovar(repasse.id)
    .subscribe(() => {
      repasse.status = 'Aprovado';
      this.toastr.success('Repasse aprovado.');
      window.location.reload();
    }); 
  }
  
  rejeitarRepasse(repasse: Repasse) {
    
    this.repasseService
    .rejeitar(repasse.id)
    .subscribe(() => {  
      repasse.status = 'Rejeitado';

      this.toastr.success('Repasse rejeitado.');
    }); 
  }
  
  pagarRepasse(event: any) {
    this.repasseService
    .pagar(event.id, event.comprovante)
    .subscribe(() => {
      
      const repasse = this.repasses.find(x => x.id == event.id);
      
      if (repasse) {
        repasse.status = 'Pago';
        repasse.comprovante = event.comprovanteUrl;
      }
      
      this.wallet.saldoDisponivel -= repasse!.valor;
      
      this.toastr.success(
        'Repasse efetuado com sucesso.'
      );
      
      this.fecharRepassesAdmin();
      this.carregarDados();
    });
    
  }
  
}