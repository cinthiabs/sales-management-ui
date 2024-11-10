export interface Client {
    id: number;
    name: string;
    phone: string;
    location: string;
    active: boolean;
    dateCreate?:string | null;
    dateEdit?:string | null;
}