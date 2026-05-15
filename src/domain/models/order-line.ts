export class OrderLine {

  productId!:number;

  productName?:string;

  quantity!:number;

  unitPrice!:number;

  discountRate!:number;

  lineTotal!:number;

  constructor(
    partial?:Partial<OrderLine>
  ){

    Object.assign(
      this,
      partial
    );

  }

}