import { IReview, NewReview } from './review.model';

export const sampleWithRequiredData: IReview = {
  id: '5d2ef741-1a62-4d62-971e-a6357f3626f6',
  rating: 32149,
};

export const sampleWithPartialData: IReview = {
  id: 'a3e040db-5fa2-4469-a7e8-6dcc5a08ce83',
  rating: 3567,
  comment: '../fake-data/blob/hipster.txt',
};

export const sampleWithFullData: IReview = {
  id: '6638c6d7-6965-43e7-9678-c9065b5f441c',
  rating: 11091,
  comment: '../fake-data/blob/hipster.txt',
};

export const sampleWithNewData: NewReview = {
  rating: 28701,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
