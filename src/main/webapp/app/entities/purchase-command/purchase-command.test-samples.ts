import dayjs from 'dayjs/esm';

import { IPurchaseCommand, NewPurchaseCommand } from './purchase-command.model';

export const sampleWithRequiredData: IPurchaseCommand = {
  id: '13c995be-33b6-40a7-81ac-99c43557d0ba',
  status: 'RETURN_REQUESTED',
};

export const sampleWithPartialData: IPurchaseCommand = {
  id: 'fca3c292-07d0-49bc-b6ce-c6a2fbb77f90',
  status: 'RETURN_REQUESTED',
};

export const sampleWithFullData: IPurchaseCommand = {
  id: '0d72e82c-a9db-448b-934f-9ffcd4527b66',
  expeditionDate: dayjs('2024-09-09'),
  status: 'PREPARING',
};

export const sampleWithNewData: NewPurchaseCommand = {
  status: 'PREPARING',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
