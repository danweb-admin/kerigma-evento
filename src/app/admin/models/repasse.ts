export interface Repasse {
    id: string;
    eventoId: string;
    walletId: string;
    valor: number;
    status: string;
    nomeBeneficiario: string;
    emailBeneficiario: string;
    conta: string;
    tipoConta: string;
    tipoChavePix: string;
    chavePix: string;
    observacao: string;
    comprovante: string;
    dataSolicitacao?: Date;
    dataPagamento?: Date;

}