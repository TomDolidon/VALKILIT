import { IBook } from 'app/entities/book/book.model';

export default interface IBookCart {
  id: string;
  book: IBook;
  quantity: number;
  sub_total?: number;
}
