import dayjs from 'dayjs/esm';

import { IBook, NewBook } from './book.model';

export const sampleWithRequiredData: IBook = {
  id: 'b332d914-5695-435f-8890-e14aab64f365',
  title: 'cot cot',
  price: 31626.84,
  format: 'PAPERBACK',
  stock: 1927,
  language: 'EN',
  publishDate: dayjs('2024-09-08'),
};

export const sampleWithPartialData: IBook = {
  id: '5dc0ace5-84d7-4dff-85fa-1d21f31f29d2',
  title: 'dans la mesure où',
  subtitle: 'groin groin',
  price: 4010.05,
  isbn: 'miaou',
  format: 'POCKET',
  stock: 28216,
  pageCount: 31190,
  language: 'EN',
  publishDate: dayjs('2024-09-08'),
};

export const sampleWithFullData: IBook = {
  id: 'a14c02d5-2f5a-46b4-9dfe-95e31c0e1f72',
  title: 'si ah de façon à',
  subtitle: 'hier hebdomadaire',
  imageUri: 'pff cocorico ouin',
  price: 10870.43,
  isbn: 'enregistrer plutôt énorme',
  format: 'POCKET',
  stock: 314,
  description: '../fake-data/blob/hipster.txt',
  pageCount: 19112,
  language: 'FR',
  publishDate: dayjs('2024-09-08'),
};

export const sampleWithNewData: NewBook = {
  title: 'lunatique',
  price: 14873.83,
  format: 'POCKET',
  stock: 9788,
  language: 'FR',
  publishDate: dayjs('2024-09-09'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
