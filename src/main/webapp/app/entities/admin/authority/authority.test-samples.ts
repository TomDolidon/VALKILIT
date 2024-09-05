import { IAuthority, NewAuthority } from './authority.model';

export const sampleWithRequiredData: IAuthority = {
  name: '22efdc7a-243a-4e1b-9965-6433caa8a480',
};

export const sampleWithPartialData: IAuthority = {
  name: '29ace9b2-0d1d-4163-87da-ae4014d0918a',
};

export const sampleWithFullData: IAuthority = {
  name: '45a0db15-7603-42c8-baad-340af110a6ed',
};

export const sampleWithNewData: NewAuthority = {
  name: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
