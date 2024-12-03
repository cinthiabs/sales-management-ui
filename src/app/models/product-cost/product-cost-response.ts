export interface ProductCostResponse {
    idProductTotalCost: number;
    idCost?: number;
    totalProductPrice: number;
    totalQuantity: number;
    quantityRequired: number;
    ingredientCost: number;
    dateCreate: Date;
    dateEdit?: Date;
}
  
export interface ProductTotalCostsResponse {
    idProductTotalCost: number;
    idProduct: number;
    totalProductCost: number;
    active: boolean;
    dateCreate: Date;
    dateEdit?: Date;
    productCost: ProductCostResponse[];
}