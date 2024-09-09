import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';
import { IAddress } from 'app/entities/address/address.model';

export interface IClient {
  id: string;
  birthdate?: dayjs.Dayjs | null;
  internalUser?: Pick<IUser, 'id' | 'login'> | null;
  address?: IAddress | null;
}

export type NewClient = Omit<IClient, 'id'> & { id: null };
