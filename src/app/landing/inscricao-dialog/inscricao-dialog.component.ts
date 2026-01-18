import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventoService } from 'src/app/admin/services/eventos.service';
import { ValidateService } from '../services/validate.service';
import { ToastrService } from 'ngx-toastr';

interface Decanato {
  id: string;
  name: string;
}

@Component({
  selector: 'app-inscricao-dialog',
  styleUrls: ['./inscricao-dialog.component.scss'],
  templateUrl: './inscricao-dialog.component.html',
})
export class InscricaoDialogComponent implements OnInit{
  @Input() show = false;
  @Output() closed = new EventEmitter<void>();
  @Input() eventoId!: string;
  @ViewChild('cpfInput') cpfInput!: ElementRef;
  
  selectedTab: 'inscricao' | 'pagamento' = 'inscricao';
  
  inscricaoForm: FormGroup;
  decanatos: Decanato[] = [];
  
  grupos: any[] = [];
  gruposComFiltro: any[] = []; 
  
  semGrupo = false;
  permitirPagamento = false;
  
  valorInscricao!: number;
  formaSelecionada: 'pix' | 'cartao' | null = null;
  modoVisualizacao = false;
  qrCode = false;
  mostrarCartao =  true;
  mostrarQRCode =  true;
  bloquearConfirmar = false;
  qrCodeLink: string  = ''
  pixCopiaECola: string = '';
  copiado = false;
  codigoInscricao: string = '';
  linkPgtoCartao: string = '';
  habilitarPix: boolean = false;
  habilitarCartao: boolean = false;
  qtdParcelas: number = 1;
  // Tempo total do Pix (em segundos)
  tempoTotalPix = 15 * 60; // 15 minutos
  tempoRestante = this.tempoTotalPix;
  
  pixExpirado = false;
  private timerPix: any;
  statusPagamento: 'PENDENTE' | 'PAGO' | 'EXPIRADO' = 'PENDENTE';
  private pollingPix: any;
  
  constructor(private fb: FormBuilder,
    private service: EventoService,
    private validateService: ValidateService,
    private toastr: ToastrService
  ) {
    this.inscricaoForm = this.fb.group({
      eventoId: this.eventoId,
      cpf: ['', Validators.required],
      nome: ['', Validators.required],
      email: ['', [Validators.required]],
      telefone: ['', Validators.required],
      decanatoId: [''],
      grupoOracaoId: [''],
      semGrupo: [false],
      servoId: [''],
      tipoPagamento: this.formaSelecionada,
      valorInscricao: [],
      numeroCartao: [],
      nomeCartao: [],
      validade: [],
      cvv: [],
      quantidadeParcelas: [0]
      
    });
  }
  ngOnInit(): void {
    this.carregarDecanato();
    this.carregarGrupoOracoes();
    this.getEventoById();
    
    
    this.inscricaoForm.patchValue({ eventoId: this.eventoId });
    
    this.inscricaoForm.get('decanatoId')?.valueChanges.subscribe(decanatoId => {
      if (decanatoId) {
        this.gruposComFiltro = this.filtrarGruposPorDecanato(decanatoId)
      } else {
        this.gruposComFiltro = [];
        this.inscricaoForm.patchValue({ grupoOracaoId: '' });
      }
    });
    
    this.inscricaoForm.get('semGrupo')?.valueChanges.subscribe((value) => {
      this.semGrupo = value;
      
      if (value) {
        // desmarca e desativa decanato/grupo
        this.inscricaoForm.patchValue({
          decanatoId: '',
          grupoOracaoId: ''
        });
        this.inscricaoForm.get('decanatoId')?.disable();
        this.inscricaoForm.get('grupoOracaoId')?.disable();
      } else {
        // reativa os campos
        this.inscricaoForm.get('decanatoId')?.enable();
        this.inscricaoForm.get('grupoOracaoId')?.enable();
      }
    });
    
    this.buscaLoteInscricao();
    
  }
  
  formatarTempo(): string {
    const min = Math.floor(this.tempoRestante / 60);
    const sec = this.tempoRestante % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  }
  
  iniciarVerificacaoPagamento() {
    this.pollingPix = setInterval(() => {
      this.service.verificarStatus(this.codigoInscricao)
      .subscribe(
        response => {
        if (response.status === 'PAGO') {
          clearInterval(this.pollingPix);
          clearInterval(this.timerPix);
          
          this.statusPagamento = 'PAGO';
        }
      },
        (error: any) =>{
            console.log(error);
            
        });
    }, 5000); // a cada 5 segundos
  }
  
  
  buscaLoteInscricao(){
    this.service.getLoteInscricao(this.eventoId).subscribe({
      next: (valor) => {
        
        this.valorInscricao = valor;
        this.inscricaoForm.patchValue({valorInscricao: valor});
      },
      error: (e) => {
        
        this.toastr.error('Evento não está ativo para receber Inscrições!');
        this.bloquearConfirmar = true;
        this.valorInscricao = 0;
      }
    });
  }
  
  proximo() {
    if (this.inscricaoForm.invalid) {
      this.inscricaoForm.markAllAsTouched();
      return;
    }
    
    this.selectedTab = 'pagamento'
    
    // lógica para ir à próxima aba (Forma de Pagamento)
  }
  
  
  fechar() {
    this.closed.emit();
  }
  
  salvar() {
    if (this.inscricaoForm.valid) {
      console.log('Dados inscrição:', this.inscricaoForm.value);
      this.selectedTab = 'pagamento';
    }
  }
  
  formaPagamento(forma: any){
    this.formaSelecionada = forma;
    this.inscricaoForm.patchValue({tipoPagamento: forma})
  }
  
  confirmar() {
    
    if (!this.formaSelecionada){
      this.toastr.warning('Selecione uma forma de pagamento! Pix ou Cartão')
      return;
    }
    // Aqui você envia a forma de pagamento para o backend
    this.service.inscricao(this.inscricaoForm.value).subscribe(resp => {
      
      if (resp.tipoPagamento === 'pix'){
        this.toastr.success('A inscrição será efetivada após o pagamento, verifique seu email!');
        
        this.qrCode = true;
        this.qrCodeLink = `data:image/png;base64,${resp.linkQrCodeBase64}`;
        this.pixCopiaECola = resp.qrCodeCopiaCola;
        this.mostrarCartao = false;
        this.iniciarTimerPix();
        this.iniciarVerificacaoPagamento();
      }
      
      if (resp.tipoPagamento === 'cartao'){
        this.toastr.success('Link para pagamento com cartão de crédito foi gerado com sucesso.!');
        this.mostrarQRCode = false
        this.linkPgtoCartao = resp.linkPgtoCartao;
      }
      
      this.codigoInscricao = resp.codigoInscricao;
      this.bloquearConfirmar = true;
    },(error: any) =>{
      this.toastr.warning(error.error.message)
    });
    
  }
  
  iniciarTimerPix() {
    // Evita múltiplos timers
    if (this.timerPix) {
      clearInterval(this.timerPix);
    }
    
    this.pixExpirado = false;
    this.tempoRestante = this.tempoTotalPix;
    
    this.timerPix = setInterval(() => {
      this.tempoRestante--;
      
      if (this.tempoRestante <= 0) {
        clearInterval(this.timerPix);
        this.pixExpirado = true;
      }
    }, 1000);
  }
  
  
  copiarCodigoPix(event: any) {
    event.preventDefault();
    navigator.clipboard.writeText(this.pixCopiaECola)
    .then(() => {
      this.toastr.info('Código PIX copiado!')
    })
    .catch(err => {
      console.error('Erro ao copiar PIX: ', err);
    });
  }
  
  voltar(){
    
  }
  
  getEventoById(){
    this.service.getById(this.eventoId).subscribe(resp => {
      this.habilitarCartao = resp.habilitarCartao;
      this.habilitarPix = resp.habilitarPix;
      this.qtdParcelas = resp.qtdParcelas;
    });
  }
  
  validarCpf(event: any) {
    let cpf = event.target.value;
    
    if (!this.validateService.validarCpf(cpf)){
      this.toastr.warning("CPF Inválido.")
      
      setTimeout(() => {
        this.cpfInput.nativeElement.focus();
      }, 0);
      
      return;
    }
    
    this.service.getServoByCPF(cpf).subscribe(resp => {
      
      this.inscricaoForm.patchValue({
        servoId: resp.id,
        cpf: cpf,
        nome: resp.name,
        email: resp.email.toLowerCase(),
        telefone: resp.cellPhone,
        decanatoId: resp.grupoOracao?.paroquiaCapela?.decanatoId,
        grupoOracaoId: resp.grupoOracao?.id
      });
      
      this.inscricaoForm.get('semGrupo')?.disable();
      
      this.modoVisualizacao = true;
      
    },(error: any) =>{
      if (error.status === 404) {
        // Usuário não encontrado — habilita todos os campos
        this.inscricaoForm.get('nome')?.enable();
        this.inscricaoForm.get('telefone')?.enable();
        this.inscricaoForm.get('decanatoId')?.enable();
        this.inscricaoForm.get('grupoOracaoId')?.enable();
        this.inscricaoForm.get('email')?.enable();
        
        this.toastr.info('Cadastro não encontrado, preencha seus dados.');
      } else {
        this.toastr.error('Erro ao buscar CPF.');
      }
      
    });
  }
  
  irParaPagamento(event: any){
    event.preventDefault();
    if (this.linkPgtoCartao) {
      window.open(this.linkPgtoCartao, '_blank');
    }
  }
  
  selecionarForma(forma: 'pix' | 'cartao') {
    this.formaSelecionada = forma;
  }
  
  getDescricaoForma(forma: string): string {
    return forma === 'pix'
    ? 'Pagamento via Pix (QR Code instantâneo)'
    : 'Pagamento com Cartão de Crédito';
  }
  
  carregarDecanato(){
    this.service.getDecanatos().subscribe(resp => {
      this.decanatos = resp;
    })
  }
  
  carregarGrupoOracoes() {
    this.service.getGrupoOracoes().subscribe(resp => {
      this.grupos = resp;
    })
  }
  
  
  filtrarGruposPorDecanato(decanatoId: string): any[] {
    return this.grupos.filter(g =>
      g.paroquiaCapela?.decanatoSetor?.id === decanatoId
    );
  }
}
