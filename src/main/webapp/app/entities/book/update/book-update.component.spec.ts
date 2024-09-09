import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IPublisher } from 'app/entities/publisher/publisher.model';
import { PublisherService } from 'app/entities/publisher/service/publisher.service';
import { IBookCategory } from 'app/entities/book-category/book-category.model';
import { BookCategoryService } from 'app/entities/book-category/service/book-category.service';
import { IAuthor } from 'app/entities/author/author.model';
import { AuthorService } from 'app/entities/author/service/author.service';
import { IBook } from '../book.model';
import { BookService } from '../service/book.service';
import { BookFormService } from './book-form.service';

import { BookUpdateComponent } from './book-update.component';

describe('Book Management Update Component', () => {
  let comp: BookUpdateComponent;
  let fixture: ComponentFixture<BookUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let bookFormService: BookFormService;
  let bookService: BookService;
  let publisherService: PublisherService;
  let bookCategoryService: BookCategoryService;
  let authorService: AuthorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BookUpdateComponent],
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
      .overrideTemplate(BookUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BookUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    bookFormService = TestBed.inject(BookFormService);
    bookService = TestBed.inject(BookService);
    publisherService = TestBed.inject(PublisherService);
    bookCategoryService = TestBed.inject(BookCategoryService);
    authorService = TestBed.inject(AuthorService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Publisher query and add missing value', () => {
      const book: IBook = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
      const publisher: IPublisher = { id: 'a7df1216-892e-423c-beb4-15a62bd5320d' };
      book.publisher = publisher;

      const publisherCollection: IPublisher[] = [{ id: '9fa97738-25dd-4c66-aa42-3bf2dfb694a5' }];
      jest.spyOn(publisherService, 'query').mockReturnValue(of(new HttpResponse({ body: publisherCollection })));
      const additionalPublishers = [publisher];
      const expectedCollection: IPublisher[] = [...additionalPublishers, ...publisherCollection];
      jest.spyOn(publisherService, 'addPublisherToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ book });
      comp.ngOnInit();

      expect(publisherService.query).toHaveBeenCalled();
      expect(publisherService.addPublisherToCollectionIfMissing).toHaveBeenCalledWith(
        publisherCollection,
        ...additionalPublishers.map(expect.objectContaining),
      );
      expect(comp.publishersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call BookCategory query and add missing value', () => {
      const book: IBook = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
      const categories: IBookCategory[] = [{ id: '763389b6-3a9e-4c95-9fee-9385fc3dfbd1' }];
      book.categories = categories;

      const bookCategoryCollection: IBookCategory[] = [{ id: '7eb2792c-3571-4a1c-ac63-ed04c6045c81' }];
      jest.spyOn(bookCategoryService, 'query').mockReturnValue(of(new HttpResponse({ body: bookCategoryCollection })));
      const additionalBookCategories = [...categories];
      const expectedCollection: IBookCategory[] = [...additionalBookCategories, ...bookCategoryCollection];
      jest.spyOn(bookCategoryService, 'addBookCategoryToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ book });
      comp.ngOnInit();

      expect(bookCategoryService.query).toHaveBeenCalled();
      expect(bookCategoryService.addBookCategoryToCollectionIfMissing).toHaveBeenCalledWith(
        bookCategoryCollection,
        ...additionalBookCategories.map(expect.objectContaining),
      );
      expect(comp.bookCategoriesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Author query and add missing value', () => {
      const book: IBook = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
      const authors: IAuthor[] = [{ id: 'dbe56e3a-0890-4f00-94f7-bdb339bac407' }];
      book.authors = authors;

      const authorCollection: IAuthor[] = [{ id: 'cf46e0b4-5da8-46f1-bc4a-d7deac20ec72' }];
      jest.spyOn(authorService, 'query').mockReturnValue(of(new HttpResponse({ body: authorCollection })));
      const additionalAuthors = [...authors];
      const expectedCollection: IAuthor[] = [...additionalAuthors, ...authorCollection];
      jest.spyOn(authorService, 'addAuthorToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ book });
      comp.ngOnInit();

      expect(authorService.query).toHaveBeenCalled();
      expect(authorService.addAuthorToCollectionIfMissing).toHaveBeenCalledWith(
        authorCollection,
        ...additionalAuthors.map(expect.objectContaining),
      );
      expect(comp.authorsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const book: IBook = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
      const publisher: IPublisher = { id: 'cc1ee9f8-ee41-4655-82ee-965b4bc8b3d6' };
      book.publisher = publisher;
      const category: IBookCategory = { id: '1b9690eb-db0f-44db-91e1-fc9b6a9838b9' };
      book.categories = [category];
      const author: IAuthor = { id: '5e43e932-c3fe-467c-ad8b-94d6b6daab20' };
      book.authors = [author];

      activatedRoute.data = of({ book });
      comp.ngOnInit();

      expect(comp.publishersSharedCollection).toContain(publisher);
      expect(comp.bookCategoriesSharedCollection).toContain(category);
      expect(comp.authorsSharedCollection).toContain(author);
      expect(comp.book).toEqual(book);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBook>>();
      const book = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(bookFormService, 'getBook').mockReturnValue(book);
      jest.spyOn(bookService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ book });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: book }));
      saveSubject.complete();

      // THEN
      expect(bookFormService.getBook).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(bookService.update).toHaveBeenCalledWith(expect.objectContaining(book));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBook>>();
      const book = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(bookFormService, 'getBook').mockReturnValue({ id: null });
      jest.spyOn(bookService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ book: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: book }));
      saveSubject.complete();

      // THEN
      expect(bookFormService.getBook).toHaveBeenCalled();
      expect(bookService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBook>>();
      const book = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(bookService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ book });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(bookService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('comparePublisher', () => {
      it('Should forward to publisherService', () => {
        const entity = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const entity2 = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
        jest.spyOn(publisherService, 'comparePublisher');
        comp.comparePublisher(entity, entity2);
        expect(publisherService.comparePublisher).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareBookCategory', () => {
      it('Should forward to bookCategoryService', () => {
        const entity = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const entity2 = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
        jest.spyOn(bookCategoryService, 'compareBookCategory');
        comp.compareBookCategory(entity, entity2);
        expect(bookCategoryService.compareBookCategory).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareAuthor', () => {
      it('Should forward to authorService', () => {
        const entity = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const entity2 = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
        jest.spyOn(authorService, 'compareAuthor');
        comp.compareAuthor(entity, entity2);
        expect(authorService.compareAuthor).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
