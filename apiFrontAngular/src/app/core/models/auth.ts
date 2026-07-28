export interface LoginResponse {
    access_token: string;
    token_type: string;
    expire_in: number;
}

export interface Usuario {
    id: number;
    name: string;
    email: string;
    foto: string | null;
}