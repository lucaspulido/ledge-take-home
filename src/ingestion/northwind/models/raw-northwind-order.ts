export interface RawNorthwindOrder {

  orderId:number;

  customerId:string;

  orderDate:string | null;

  requiredDate:string | null;

  shippedDate:string | null;

  freight:number | null;

}