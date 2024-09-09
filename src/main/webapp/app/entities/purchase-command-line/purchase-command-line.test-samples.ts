import { IPurchaseCommandLine, NewPurchaseCommandLine } from './purchase-command-line.model';

export const sampleWithRequiredData: IPurchaseCommandLine = {
  id: '7a72a8ed-128a-4e5a-a5df-d68b5d7b6d33',
  quantity: 23676,
  unitPrice: 10414.86,
};

export const sampleWithPartialData: IPurchaseCommandLine = {
  id: 'b03df4cb-0aca-422e-a84b-eb4f72076a3b',
  quantity: 1382,
  unitPrice: 20430.99,
};

export const sampleWithFullData: IPurchaseCommandLine = {
  id: 'c4d0ac1e-1f04-48c4-b664-c0e80cc563a8',
  quantity: 28380,
  unitPrice: 19498.81,
};

export const sampleWithNewData: NewPurchaseCommandLine = {
  quantity: 26432,
  unitPrice: 19930.63,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
