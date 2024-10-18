export interface Sale {
    id? :number;
    idProduct: number;
    idClient?: string | null;
    dateSale: string;
    name:string;
    details:string;
    quantity:number;
    price:number;
    pay:number;
    dateCreate?:string | null;
    dateEdit?:string | null;
}
export interface RelQuantitySale {
    name: string;
    quantity:number;
    price: number;
    paid: number;
    notPaid: number;
}