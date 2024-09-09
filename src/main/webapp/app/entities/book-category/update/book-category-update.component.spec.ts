import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IBook } from 'app/entities/book/book.model';
import { BookService } from 'app/entities/book/service/book.service';
import { BookCategoryService } from '../service/book-category.service';
import { IBookCategory } from '../book-category.model';
import { BookCategoryFormService } from './book-category-form.service';

import { BookCategoryUpdateComponent } from './book-category-update.component';

describe('BookCategory Management Update Component', () => {
  let comp: BookCategoryUpdateComponent;
  let fixture: ComponentFixture<BookCategoryUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let bookCategoryFormService: BookCategoryFormService;
  let bookCategoryService: BookCategoryService;
  let bookService: BookService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BookCategoryUpdateComponent],
      providers: [
        provideHttpClient(),
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(BookCategoryUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BookCategoryUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    bookCategoryFormService = TestBed.inject(BookCategoryFormService);
    bookCategoryService = TestBed.inject(BookCategoryService);
    bookService = TestBed.inject(BookService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Book query and add missing value', () => {
      const bookCategory: IBookCategory = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
      const books: IBook[] = [{ id: 'f144055b-e7c1-4339-aaa9-90c3414c3711' }];
      bookCategory.books = books;

      const bookCollection: IBook[] = [{ id: 'fa2dc484-2d30-4530-9a60-ffd0785d5698' }];
      jest.spyOn(bookService, 'query').mockReturnValue(of(new HttpResponse({ body: bookCollection })));
      const additionalBooks = [...books];
      const expectedCollection: IBook[] = [...additionalBooks, ...bookCollection];
      jest.spyOn(bookService, 'addBookToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ bookCategory });
      comp.ngOnInit();

      expect(bookService.query).toHaveBeenCalled();
      expect(bookService.addBookToCollectionIfMissing).toHaveBeenCalledWith(
        bookCollection,
        ...additionalBooks.map(expect.objectContaining),
      );
      expect(comp.booksSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const bookCategory: IBookCategory = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
      const book: IBook = { id: '4f24f5b9-a1b0-4117-bdc1-5ca04b54f003' };
      bookCategory.books = [book];

      activatedRoute.data = of({ bookCategory });
      comp.ngOnInit();

      expect(comp.booksSharedCollection).toContain(book);
      expect(comp.bookCategory).toEqual(bookCategory);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBookCategory>>();
      const bookCategory = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(bookCategoryFormService, 'getBookCategory').mockReturnValue(bookCategory);
      jest.spyOn(bookCategoryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bookCategory });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: bookCategory }));
      saveSubject.complete();

      // THEN
      expect(bookCategoryFormService.getBookCategory).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(bookCategoryService.update).toHaveBeenCalledWith(expect.objectContaining(bookCategory));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBookCategory>>();
      const bookCategory = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(bookCategoryFormService, 'getBookCategory').mockReturnValue({ id: null });
      jest.spyOn(bookCategoryService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bookCategory: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: bookCategory }));
      saveSubject.complete();

      // THEN
      expect(bookCategoryFormService.getBookCategory).toHaveBeenCalled();
      expect(bookCategoryService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBookCategory>>();
      const bookCategory = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(bookCategoryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bookCategory });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(bookCategoryService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareBook', () => {
      it('Should forward to bookService', () => {
        const entity = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const entity2 = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
        jest.spyOn(bookService, 'compareBook');
        comp.compareBook(entity, entity2);
        expect(bookService.compareBook).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
