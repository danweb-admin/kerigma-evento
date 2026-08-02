export interface WalletMovimento {

    id: string;

    walletId: string;
    organizadorId: string;

    financeiroId?: string;
    repasseId?: string;

    dataMovimento: Date;

    tipo: string;

    descricao: string;

    entrada: number;

    saida: number;

    saldoAnterior: number;

    saldoAtual: number;

    referencia: string;

    observacao: string;

    origem: string;
    nomeParticipante: string;
    comprovante: string

}