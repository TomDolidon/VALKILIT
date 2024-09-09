import { IAddress, NewAddress } from './address.model';

export const sampleWithRequiredData: IAddress = {
  id: '3e516587-0c85-4e39-af85-5a749cf9d9b4',
  street: 'Passage Adolphe Mille',
  postalCode: 12841,
  city: 'Lyon',
  country: 'Maroc',
};

export const sampleWithPartialData: IAddress = {
  id: 'aea18ba8-5654-4ae0-957a-ba05f0935681',
  street: 'Passage du Dahomey',
  postalCode: 2109,
  city: 'Rouen',
  country: 'Bahreïn',
};

export const sampleWithFullData: IAddress = {
  id: 'c6907028-9e48-43ee-9167-3187b10dc147',
  street: 'Impasse Monsieur-le-Prince',
  postalCode: 22864,
  city: 'Drancy',
  country: 'Chili',
};

export const sampleWithNewData: NewAddress = {
  street: 'Avenue de Caumartin',
  postalCode: 6302,
  city: 'Clichy',
  country: 'Cambodge',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
