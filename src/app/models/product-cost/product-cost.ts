export interface ProductCostRequest {
    idCost?: number;
    totalProductPrice: number;
    totalQuantity: number;
    quantityRequired: number;
    ingredientCost: number;
}
  
export interface ProductTotalCostRequest {
    idProduct: number;
    totalProductCost: number;
    unitCost: ProductCostRequest[];
}