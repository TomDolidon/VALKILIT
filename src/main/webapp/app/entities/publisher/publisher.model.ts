export interface IPublisher {
  id: string;
  name?: string | null;
  description?: string | null;
}

export type NewPublisher = Omit<IPublisher, 'id'> & { id: null };
