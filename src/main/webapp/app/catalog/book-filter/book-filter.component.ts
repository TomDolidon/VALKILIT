/* eslint-disable */

import { CommonModule } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IAuthor } from 'app/entities/author/author.model';
import { AuthorService } from 'app/entities/author/service/author.service';
import { BookFormat } from 'app/entities/enumerations/book-format.model';
import IBookFilter from 'app/model/IBookFilter';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ChipsModule } from 'primeng/chips';
import { SliderModule } from 'primeng/slider';
import { CheckboxModule } from 'primeng/checkbox';
import { FloatLabelModule } from 'primeng/floatlabel';
import { TranslateModule } from '@ngx-translate/core';
import TranslateDirective from '../../shared/language/translate.directive';
import { IBookCategory } from 'app/entities/book-category/book-category.model';
import { BookCategoryService } from 'app/entities/book-category/service/book-category.service';

@Component({
  standalone: true,
  selector: 'jhi-book-filter',
  templateUrl: './book-filter.component.html',
  styleUrl: './book-filter.component.scss',
  imports: [
    CommonModule,
    FormsModule,
    AutoCompleteModule,
    ChipsModule,
    SliderModule,
    CheckboxModule,
    FloatLabelModule,
    TranslateModule,
    TranslateDirective,
  ],
})
export class BookFilterComponent {
  authors: any[] = [];
  filteredAuthors: any[] = [];
  // selectedAuthor: string | null = null;

  categories: any[] = [];
  filteredCategories: any[] = [];
  // selectedCategories: string | null = null;

  minPrice = 0;
  maxPrice = 100;

  filter: IBookFilter = {
    authors: [] as IAuthor[],
    categories: [] as IBookCategory[],
    formats: [] as BookFormat[],
    priceRange: [0, 100],
  };

  public BookFormat = BookFormat;
  bookFormatKeys = Object.keys(BookFormat);

  @Output() filterChanged = new EventEmitter<IBookFilter>();

  constructor(
    private authorService: AuthorService,
    private categoryService: BookCategoryService,
  ) {}

  /**
   * On component mount, retrieve authors to fill autocomplete
   */
  ngOnInit() {
    this.loadAuthors();
    this.loadCategories();
  }

  private loadAuthors(): void {
    this.authorService.query().subscribe({
      next: (res: HttpResponse<IAuthor[]>) => {
        this.authors = res.body || [];
      },
      error: () => {
        console.error('Error loading authors');
      },
    });
  }

  private loadCategories(): void {
    this.categoryService.query().subscribe({
      next: (res: HttpResponse<IAuthor[]>) => {
        this.categories = res.body || [];
      },
      error: () => {
        console.error('Error loading authors');
      },
    });
  }

  filterAuthors(event: any): void {
    const query = event.query.toLowerCase();
    this.filteredAuthors = this.authors.filter(author => author.name.toLowerCase().includes(query));
  }

  filterCategories(event: any): void {
    const query = event.query.toLowerCase();
    this.filteredCategories = this.categories.filter(category => category.name.toLowerCase().includes(query));
  }

  /**
   * Emit filter change
   */
  applyFilter(): void {
    this.filterChanged.emit(this.filter);
  }
}
