export interface Sale {
    id? :number,
    idProduct: number,
    dateSale: string, 
    name:string,
    details:string,
    quantity:number,
    price:number,
    pay:boolean,
    dateCreate?:string | null,
    dateEdit?:string | null
}
export interface RelQuantitySale {
    name: string,
    quantity:number,
    price: number,
    pay: number
}