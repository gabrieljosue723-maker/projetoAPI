export interface UsuarioDoProdto {
    foto: string | null;
    name: string;
    email: string;
}

export interface Produto {
    id: number;
    nome: string;
    descricao: string;
    preco: number;
    imagem: string;
    telefone?: string;    
    whatsapp?: string;      
    facebook?: string; 
    user: {
        id: number;
        name: string;
    };
    created_at: string;
}