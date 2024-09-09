import { IBookCategory, NewBookCategory } from './book-category.model';

export const sampleWithRequiredData: IBookCategory = {
  id: '8a562e91-e9fa-429a-8307-3c80f35d2d19',
  name: 'vouh',
};

export const sampleWithPartialData: IBookCategory = {
  id: 'c413e7e2-a427-4053-af08-792d2d369a30',
  name: 'membre à vie',
  description: '../fake-data/blob/hipster.txt',
};

export const sampleWithFullData: IBookCategory = {
  id: '9fd1f31a-56be-4fb8-951b-9281817b1aee',
  name: 'presque grandement',
  description: '../fake-data/blob/hipster.txt',
};

export const sampleWithNewData: NewBookCategory = {
  name: 'quand aïe ouch',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
