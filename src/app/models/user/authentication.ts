export interface Authentication {
    username?: string,
    password: string,
    email: number,
    confirmPassword?: string,
    name?: string 
}

export interface AuthenticationResponse {
    username: string;
    email: string;
    name: string;
    active: boolean
    dateCreate:string;
    dateEdit: string;
    lastLogin: string;
    token: string;
    tokenExpiration:string;
}