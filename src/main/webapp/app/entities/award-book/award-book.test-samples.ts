import dayjs from 'dayjs/esm';

import { IAwardBook, NewAwardBook } from './award-book.model';

export const sampleWithRequiredData: IAwardBook = {
  id: 18913,
  year: dayjs('2024-09-09'),
};

export const sampleWithPartialData: IAwardBook = {
  id: 26729,
  year: dayjs('2024-09-09'),
};

export const sampleWithFullData: IAwardBook = {
  id: 8677,
  year: dayjs('2024-09-09'),
};

export const sampleWithNewData: NewAwardBook = {
  year: dayjs('2024-09-09'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
