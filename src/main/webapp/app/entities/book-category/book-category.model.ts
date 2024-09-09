import { IBook } from 'app/entities/book/book.model';

export interface IBookCategory {
  id: string;
  name?: string | null;
  description?: string | null;
  books?: IBook[] | null;
}

export type NewBookCategory = Omit<IBookCategory, 'id'> & { id: null };
