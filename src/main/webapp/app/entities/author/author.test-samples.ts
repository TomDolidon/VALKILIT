import { IAuthor, NewAuthor } from './author.model';

export const sampleWithRequiredData: IAuthor = {
  id: '099f1a80-c60c-48c1-851f-a00b13fcc697',
  name: 'offrir énergique disperser',
};

export const sampleWithPartialData: IAuthor = {
  id: 'dfba222a-2144-4598-ae59-1ea7f30a22d7',
  name: 'dès que par rapport à dans la mesure où',
};

export const sampleWithFullData: IAuthor = {
  id: '46c04670-88ca-425c-9a2a-8214e199a09c',
  name: 'vivace police',
  description: '../fake-data/blob/hipster.txt',
};

export const sampleWithNewData: NewAuthor = {
  name: 'grandement',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
