import { IAward, NewAward } from './award.model';

export const sampleWithRequiredData: IAward = {
  id: 'fa9f17b9-a7eb-42b7-99e3-df958c5523d3',
  name: 'brave camarade effacer',
};

export const sampleWithPartialData: IAward = {
  id: '748c2bbd-db40-4308-a411-f4fb39ffa33d',
  name: 'autrement absorber étant donné que',
  description: '../fake-data/blob/hipster.txt',
};

export const sampleWithFullData: IAward = {
  id: 'd663c3e6-c757-4633-bef3-a071883f45d1',
  name: 'parce que serviable communauté étudiante',
  description: '../fake-data/blob/hipster.txt',
};

export const sampleWithNewData: NewAward = {
  name: 'trop miaou',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
