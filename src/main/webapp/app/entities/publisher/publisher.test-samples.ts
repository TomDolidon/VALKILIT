import { IPublisher, NewPublisher } from './publisher.model';

export const sampleWithRequiredData: IPublisher = {
  id: '585b2f7d-1883-4579-8ccd-268f9f157e86',
  name: 'aussitôt que tâter',
};

export const sampleWithPartialData: IPublisher = {
  id: 'cf374faf-8725-44d6-aed3-3df896f4f023',
  name: 'actionnaire oups',
  description: '../fake-data/blob/hipster.txt',
};

export const sampleWithFullData: IPublisher = {
  id: 'c5b34082-d551-47e7-b376-5d28f79063f4',
  name: 'tant',
  description: '../fake-data/blob/hipster.txt',
};

export const sampleWithNewData: NewPublisher = {
  name: 'à peine',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
