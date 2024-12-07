export interface Client {
    id: number;
    name: string;
    phone: string;
    location: string;
    active: boolean;
    dateCreate?:string | null;
    dateEdit?:string | null;
}
export interface RelClients{
    productName: string;
    clientName: string;
    quantity: number;
    price:number;
    pay: boolean;
    dateSale?:string | null;
}