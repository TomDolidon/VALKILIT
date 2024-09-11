import { IAuthor } from 'app/entities/author/author.model';
import { BookFormat } from 'app/entities/enumerations/book-format.model';

export default interface IBookFilter {
  authors?: IAuthor[];
  formats?: BookFormat[];
  priceRange: [number, number];
}
