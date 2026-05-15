export interface RawNorthwindOrder {

  orderId:number;

  customerId:string;

  orderDate:string;

  requiredDate:string|null;

  shippedDate:string|null;

  freight:number;

}