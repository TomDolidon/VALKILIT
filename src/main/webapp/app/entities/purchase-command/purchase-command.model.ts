import dayjs from 'dayjs/esm';
import { IAddress } from 'app/entities/address/address.model';
import { IClient } from 'app/entities/client/client.model';
import { PurchaseCommandStatus } from 'app/entities/enumerations/purchase-command-status.model';
import { IPurchaseCommandLine } from '../purchase-command-line/purchase-command-line.model';

export interface IPurchaseCommand {
  id: string;
  expeditionDate?: dayjs.Dayjs | null;
  status?: keyof typeof PurchaseCommandStatus | null;
  deliveryAddress?: IAddress | null;
  client?: IClient | null;
}

export type NewPurchaseCommand = Omit<IPurchaseCommand, 'id'> & { id: null };

export interface IPurchaseCommandWithLines {
  id: string;
  expeditionDate?: dayjs.Dayjs | null;
  status?: keyof typeof PurchaseCommandStatus | null;
  purchaseCommandLines?: IPurchaseCommandLine[] | null;
  deliveryAddress?: IAddress | null;
  client?: IClient | null;
}
