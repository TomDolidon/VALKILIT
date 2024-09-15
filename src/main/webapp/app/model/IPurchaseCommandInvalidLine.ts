export default interface IPurchaseCommandInvalidLine {
  id: string;
  title: string;
  stock: number;
  purchaseCommandLineId: string;
  purchaseCommandQuantity: number;
  purchaseCommandUnitPrice: number;
}
