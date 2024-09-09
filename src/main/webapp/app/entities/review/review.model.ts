import { IClient } from 'app/entities/client/client.model';
import { IBook } from 'app/entities/book/book.model';

export interface IReview {
  id: string;
  rating?: number | null;
  comment?: string | null;
  client?: IClient | null;
  book?: IBook | null;
}

export type NewReview = Omit<IReview, 'id'> & { id: null };
