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

@Component({
  standalone: true,
  selector: 'jhi-book-filter',
  templateUrl: './book-filter.component.html',
  styleUrl: './book-filter.component.scss',
  imports: [CommonModule, FormsModule, AutoCompleteModule, ChipsModule, SliderModule],
})
export class BookFilterComponent {
  authors: any[] = [];
  filteredAuthors: any[] = [];
  selectedAuthor: string | null = null;

  priceValues: number[] = [0, 100];

  minPrice = 0;
  maxPrice = 100;

  filter: IBookFilter = {
    authors: [] as IAuthor[],
    formats: [] as BookFormat[],
    priceRange: [0, 100],
  };

  // Pour le slider
  priceRange: { min: number; max: number } = {
    min: 0,
    max: 1000,
  };

  value!: number;
  range!: [number, number];

  public BookFormat = BookFormat;
  bookFormatKeys = Object.keys(BookFormat);

  @Output() filterChanged = new EventEmitter<IBookFilter>();

  constructor(private authorService: AuthorService) {}

  ngOnInit() {
    this.loadAuthors();
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

  filterAuthors(event: any): void {
    const query = event.query.toLowerCase();
    this.filteredAuthors = this.authors.filter(author => author.name.toLowerCase().includes(query));
  }

  // addAuthor(event: any): void {
  //   const author = event ? event.value : this.selectedAuthor;
  //   if (author && !this.filter.authors!.includes(author)) {
  //     this.filter.authors!.push(author);
  //     this.selectedAuthor = null; // Réinitialiser le champ de saisie
  //   }
  // }

  // removeAuthor(event: any): void {
  //   this.filter.authors = this.filter.authors!.filter(a => a !== event.value);
  // }

  applyFilter(): void {
    console.log('🔊 ~ BookFilterComponent ~ applyFilter ~ applyFilter:');
    this.filterChanged.emit(this.filter);
  }
}
