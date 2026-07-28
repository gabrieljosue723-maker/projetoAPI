export interface UsuarioDoProdto {
    foto: string | null;
    name: string;
    email: string;
}

export interface Produto {
    id: number;
    user: UsuarioDoProdto;
    nome: string;
    descricao: string;
    preco: number;
    imagem: string;
}