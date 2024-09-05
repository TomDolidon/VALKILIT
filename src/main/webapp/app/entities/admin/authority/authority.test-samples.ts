import { IAuthority, NewAuthority } from './authority.model';

export const sampleWithRequiredData: IAuthority = {
  name: '2b53e749-f0bc-456b-9c36-50cb8d32ab33',
};

export const sampleWithPartialData: IAuthority = {
  name: 'b6d23cfc-12e9-4410-a6b6-319af9db3a46',
};

export const sampleWithFullData: IAuthority = {
  name: 'c07b2745-1bd1-4c51-a891-798fc56ff6d0',
};

export const sampleWithNewData: NewAuthority = {
  name: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
