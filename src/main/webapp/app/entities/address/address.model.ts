export interface IAddress {
  id: string;
  street?: string | null;
  postalCode?: number | null;
  city?: string | null;
  country?: string | null;
}

export type NewAddress = Omit<IAddress, 'id'> & { id: null };
