export interface LoginResponse {
    access_token: string;
    token_type: string;
    expire_in: number;
    user?: Usuario;  
}

export interface Usuario {
    id: number;
    name: string;
    email: string;
    foto: string | null;
}