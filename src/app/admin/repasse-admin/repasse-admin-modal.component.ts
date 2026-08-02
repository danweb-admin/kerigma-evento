import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Wallet } from '../models/wallet';
import { Repasse } from '../models/repasse';


@Component({
    selector: 'app-repasse-admin-modal',
    templateUrl: './repasse-admin-modal.component.html',
    styleUrls: ['./repasse-admin-modal.component.scss']
})
export class RepasseAdminModalComponent implements OnInit {

    @Input() wallet!: Wallet;
    @Input() repasses: Repasse[] = [];

    @Output() closed = new EventEmitter<void>();
    @Output() aprovarRepasse = new EventEmitter<Repasse>();
    @Output() rejeitarRepasse = new EventEmitter<Repasse>();
    @Output() pagarRepasse = new EventEmitter<any>();

    repassePagamento: Repasse | null = null;
    comprovanteUrl = '';

    constructor() { }

    ngOnInit(): void {

    }

    get quantidadePendentes(): number {
        return this.repasses.filter(x => x.status === 'Pendente').length;
    }

    get valorPendente(): number {
        return this.repasses
            .filter(x => x.status === 'Pendente')
            .reduce((total, item) => total + item.valor, 0);
    }

    fechar(): void {
        this.closed.emit();
    }

    aprovar(item: Repasse): void {
        if (!confirm(`Aprovar o repasse de ${item.nomeBeneficiario}?`))
            return;

        this.aprovarRepasse.emit(item);
    }

    rejeitar(item: Repasse): void {
        if (!confirm(`Rejeitar o repasse de ${item.nomeBeneficiario}?`))
            return;

        this.rejeitarRepasse.emit(item);
    }

    abrirPagamento(item: Repasse): void {
        this.repassePagamento = item;
        this.comprovanteUrl = item.comprovante ?? '';
    }

    cancelarPagamento(): void {
        this.repassePagamento = null;
        this.comprovanteUrl = '';
    }

    confirmarPagamento(item: Repasse): void {

        if (!this.comprovanteUrl) {
            alert('Informe a URL do comprovante.');
            return;
        }
        
        this.pagarRepasse.emit({
            id: item.id,
            comprovante: this.comprovanteUrl
        });

        this.repassePagamento = null;
        this.comprovanteUrl = '';
    }

    visualizar(item: Repasse): void {

        if (!item.comprovante)
            return;
        window.open(item.comprovante, '_blank');
    }

}