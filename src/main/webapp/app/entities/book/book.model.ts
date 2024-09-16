import dayjs from 'dayjs/esm';
import { IPublisher } from 'app/entities/publisher/publisher.model';
import { IBookCategory } from 'app/entities/book-category/book-category.model';
import { IAuthor } from 'app/entities/author/author.model';
import { BookFormat } from 'app/entities/enumerations/book-format.model';
import { Language } from 'app/entities/enumerations/language.model';

export interface IBook {
  id: string;
  title?: string | null;
  subtitle?: string | null;
  imageFile?: File | null;
  imageUri?: string | null;
  price?: number | null;
  isbn?: string | null;
  format?: keyof typeof BookFormat | null;
  stock?: number | null;
  description?: string | null;
  pageCount?: number | null;
  language?: keyof typeof Language | null;
  publishDate?: dayjs.Dayjs | null;
  publisher?: IPublisher | null;
  categories?: IBookCategory[] | null;
  authors?: IAuthor[] | null;
}

export type NewBook = Omit<IBook, 'id'> & { id: null };
