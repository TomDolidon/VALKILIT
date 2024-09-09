import { IBook } from 'app/entities/book/book.model';
import { IPurchaseCommand } from 'app/entities/purchase-command/purchase-command.model';

export interface IPurchaseCommandLine {
  id: string;
  quantity?: number | null;
  unitPrice?: number | null;
  book?: IBook | null;
  purchaseCommand?: IPurchaseCommand | null;
}

export type NewPurchaseCommandLine = Omit<IPurchaseCommandLine, 'id'> & { id: null };
