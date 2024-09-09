export interface IAward {
  id: string;
  name?: string | null;
  description?: string | null;
}

export type NewAward = Omit<IAward, 'id'> & { id: null };
