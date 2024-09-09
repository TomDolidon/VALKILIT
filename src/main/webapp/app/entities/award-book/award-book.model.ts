import dayjs from 'dayjs/esm';
import { IBook } from 'app/entities/book/book.model';
import { IAward } from 'app/entities/award/award.model';

export interface IAwardBook {
  id: number;
  year?: dayjs.Dayjs | null;
  book?: IBook | null;
  award?: IAward | null;
}

export type NewAwardBook = Omit<IAwardBook, 'id'> & { id: null };
