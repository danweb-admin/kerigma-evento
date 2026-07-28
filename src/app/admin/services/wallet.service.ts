import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Wallet } from '../models/wallet';
import { WalletMovimento } from '../models/walletmovimento';

const URL_WALLET = 'wallet';

@Injectable({
    providedIn: 'root'
})
export class WalletService {
    private baseUrl = 'https://backend.kerigma-eventos.online/api/v1';
        // private baseUrl = 'http://localhost:5290/api/v1';

    constructor(
        private http: HttpClient
    ) { }
    
    /**
    * Retorna o resumo da Wallet do evento
    */
    getWallet(eventoId: string): Observable<Wallet> {
        
        return this.http
        .get<Wallet>(`${this.baseUrl}/wallet/evento/${eventoId}`)
        .pipe(
            map((resp: Wallet) => resp)
        );
        
    }
    
    /**
    * Retorna o extrato financeiro (WalletMovimento)
    */
    getExtrato(eventoId: string): Observable<WalletMovimento[]> {
        
        return this.http
        .get<WalletMovimento[]>(`${this.baseUrl}/wallet/evento/${eventoId}/extrato`)
        .pipe(
            map((resp: WalletMovimento[]) => resp)
        );
        
    }
    
}