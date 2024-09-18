import { IAuthor } from 'app/entities/author/author.model';
import { IBookCategory } from 'app/entities/book-category/book-category.model';
import { BookFormat } from 'app/entities/enumerations/book-format.model';

export default interface IBookFilter {
  authors?: IAuthor[];
  categories?: IBookCategory[];
  formats?: BookFormat[];
  priceRange: [number, number];
}
