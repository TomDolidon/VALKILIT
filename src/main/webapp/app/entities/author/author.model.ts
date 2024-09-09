import { IBook } from 'app/entities/book/book.model';

export interface IAuthor {
  id: string;
  name?: string | null;
  description?: string | null;
  books?: IBook[] | null;
}

export type NewAuthor = Omit<IAuthor, 'id'> & { id: null };
