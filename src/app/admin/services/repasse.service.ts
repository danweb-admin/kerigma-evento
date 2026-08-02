import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Repasse } from '../models/repasse';

const URL_REPASSE = 'repasse';

@Injectable({
    providedIn: 'root'
})
export class RepasseService {

    private baseUrl = 'https://backend.kerigma-eventos.online/api/v1';
    // private baseUrl = 'http://localhost:5290/api/v1';

    constructor(
        private http: HttpClient
    ) { }

    /**
     * Solicita um novo repasse
     */
    solicitar(repasse: Repasse): Observable<Repasse> {

        return this.http
            .post<Repasse>(`${this.baseUrl}/${URL_REPASSE}`, repasse)
            .pipe(
                map((resp: Repasse) => resp)
            );

    }

    /**
     * Atualiza um repasse
     */
    update(repasse: Repasse): Observable<Repasse> {

        return this.http
            .put<Repasse>(`${this.baseUrl}/${URL_REPASSE}`, repasse)
            .pipe(
                map((resp: Repasse) => resp)
            );

    }

    /**
     * Busca um repasse pelo Id
     */
    getById(id: string): Observable<Repasse> {

        return this.http
            .get<Repasse>(`${this.baseUrl}/${URL_REPASSE}/${id}`)
            .pipe(
                map((resp: Repasse) => resp)
            );

    }

    /**
     * Lista os repasses de um evento
     */
    getByEvento(eventoId: string): Observable<Repasse[]> {

        return this.http
            .get<Repasse[]>(`${this.baseUrl}/${URL_REPASSE}/evento/${eventoId}`)
            .pipe(
                map((resp: Repasse[]) => resp)
            );

    }

    /**
     * Aprova um repasse
     */
    aprovar(id: string): Observable<Repasse> {

        return this.http
            .put<Repasse>(
                `${this.baseUrl}/${URL_REPASSE}/${id}/aprovar`,
                {}
            )
            .pipe(
                map((resp: Repasse) => resp)
            );

    }

    /**
     * Rejeita um repasse
     */
    rejeitar(id: string): Observable<Repasse> {

        return this.http
            .put<Repasse>(
                `${this.baseUrl}/${URL_REPASSE}/${id}/rejeitar`,
                {}
            )
            .pipe(
                map((resp: Repasse) => resp)
            );

    }

    /**
     * Efetua o pagamento do repasse
     */
    pagar(id: string, comprovanteUrl: string): Observable<Repasse> {

        return this.http
            .put<Repasse>(
                `${this.baseUrl}/${URL_REPASSE}/${id}/pagar`,
                {
                    comprovante: comprovanteUrl
                }
            )
            .pipe(
                map((resp: Repasse) => resp)
            );

    }

    /**
     * Exclui um repasse
     */
    delete(id: string): Observable<any> {

        return this.http
            .delete(`${this.baseUrl}/${URL_REPASSE}/${id}`);

    }

}