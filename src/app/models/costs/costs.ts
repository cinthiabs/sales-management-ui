export interface Cost {
    id?: number,
    quantity: string,
    name:string,
    dateCost:string,
    unitPrice:number,
    totalPrice:number,
    dateCreate?:string | null,
    dateEdit?:string | null
}