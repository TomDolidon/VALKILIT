import dayjs from 'dayjs/esm';

import { IClient, NewClient } from './client.model';

export const sampleWithRequiredData: IClient = {
  id: '5a312625-5122-4ba5-a0aa-d4646c9a6571',
};

export const sampleWithPartialData: IClient = {
  id: '77ac8878-90e8-40ff-bec3-8a14d78eb3aa',
  birthdate: dayjs('2024-09-09'),
};

export const sampleWithFullData: IClient = {
  id: 'df7d3241-2435-443c-b75b-2e1f2c5943f5',
  birthdate: dayjs('2024-09-08'),
};

export const sampleWithNewData: NewClient = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
