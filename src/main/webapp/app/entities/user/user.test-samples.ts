import { IUser } from './user.model';

export const sampleWithRequiredData: IUser = {
  id: 21024,
  login: 'FIE',
};

export const sampleWithPartialData: IUser = {
  id: 31709,
  login: '3pg+@3VIsH\\#1DBjGX\\\\6yxhTH\\}5Z-\\.6Ca47',
};

export const sampleWithFullData: IUser = {
  id: 31958,
  login: 'lk!@55HHg\\Djuh\\icMCr',
};
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
