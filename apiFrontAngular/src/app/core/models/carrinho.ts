import { Produto } from './produto';

export interface ItemCarrinho {
    id: number;
    quantidade: number;
    produto: Produto;
    subtotal: number;
}

export interface RespostaCarrinho {
    data: ItemCarrinho[];
    total: number;
}
