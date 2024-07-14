export interface Product {
    id?: number,
    name:string,
    details:string,
    active:boolean,
    price:number,
    dateCreate?:string | null,
    dateEdit?:string | null
}
