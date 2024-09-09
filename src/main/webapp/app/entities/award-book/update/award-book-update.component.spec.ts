import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IBook } from 'app/entities/book/book.model';
import { BookService } from 'app/entities/book/service/book.service';
import { IAward } from 'app/entities/award/award.model';
import { AwardService } from 'app/entities/award/service/award.service';
import { IAwardBook } from '../award-book.model';
import { AwardBookService } from '../service/award-book.service';
import { AwardBookFormService } from './award-book-form.service';

import { AwardBookUpdateComponent } from './award-book-update.component';

describe('AwardBook Management Update Component', () => {
  let comp: AwardBookUpdateComponent;
  let fixture: ComponentFixture<AwardBookUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let awardBookFormService: AwardBookFormService;
  let awardBookService: AwardBookService;
  let bookService: BookService;
  let awardService: AwardService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AwardBookUpdateComponent],
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
      .overrideTemplate(AwardBookUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AwardBookUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    awardBookFormService = TestBed.inject(AwardBookFormService);
    awardBookService = TestBed.inject(AwardBookService);
    bookService = TestBed.inject(BookService);
    awardService = TestBed.inject(AwardService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Book query and add missing value', () => {
      const awardBook: IAwardBook = { id: 456 };
      const book: IBook = { id: 'a351cc48-130c-4bb3-bbfa-c333a3204269' };
      awardBook.book = book;

      const bookCollection: IBook[] = [{ id: 'b122b001-4afd-4d20-9f72-281f33089f59' }];
      jest.spyOn(bookService, 'query').mockReturnValue(of(new HttpResponse({ body: bookCollection })));
      const additionalBooks = [book];
      const expectedCollection: IBook[] = [...additionalBooks, ...bookCollection];
      jest.spyOn(bookService, 'addBookToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ awardBook });
      comp.ngOnInit();

      expect(bookService.query).toHaveBeenCalled();
      expect(bookService.addBookToCollectionIfMissing).toHaveBeenCalledWith(
        bookCollection,
        ...additionalBooks.map(expect.objectContaining),
      );
      expect(comp.booksSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Award query and add missing value', () => {
      const awardBook: IAwardBook = { id: 456 };
      const award: IAward = { id: '7899ca8b-e1b8-4209-869d-97ae6ae56ca1' };
      awardBook.award = award;

      const awardCollection: IAward[] = [{ id: '8facfa3f-8c0f-4159-a524-1f3638e5f728' }];
      jest.spyOn(awardService, 'query').mockReturnValue(of(new HttpResponse({ body: awardCollection })));
      const additionalAwards = [award];
      const expectedCollection: IAward[] = [...additionalAwards, ...awardCollection];
      jest.spyOn(awardService, 'addAwardToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ awardBook });
      comp.ngOnInit();

      expect(awardService.query).toHaveBeenCalled();
      expect(awardService.addAwardToCollectionIfMissing).toHaveBeenCalledWith(
        awardCollection,
        ...additionalAwards.map(expect.objectContaining),
      );
      expect(comp.awardsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const awardBook: IAwardBook = { id: 456 };
      const book: IBook = { id: '8919d3ca-95dd-4046-82c9-57b26751954f' };
      awardBook.book = book;
      const award: IAward = { id: '29c1c02e-aab0-488c-aa8c-c55914d264d8' };
      awardBook.award = award;

      activatedRoute.data = of({ awardBook });
      comp.ngOnInit();

      expect(comp.booksSharedCollection).toContain(book);
      expect(comp.awardsSharedCollection).toContain(award);
      expect(comp.awardBook).toEqual(awardBook);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAwardBook>>();
      const awardBook = { id: 123 };
      jest.spyOn(awardBookFormService, 'getAwardBook').mockReturnValue(awardBook);
      jest.spyOn(awardBookService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ awardBook });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: awardBook }));
      saveSubject.complete();

      // THEN
      expect(awardBookFormService.getAwardBook).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(awardBookService.update).toHaveBeenCalledWith(expect.objectContaining(awardBook));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAwardBook>>();
      const awardBook = { id: 123 };
      jest.spyOn(awardBookFormService, 'getAwardBook').mockReturnValue({ id: null });
      jest.spyOn(awardBookService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ awardBook: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: awardBook }));
      saveSubject.complete();

      // THEN
      expect(awardBookFormService.getAwardBook).toHaveBeenCalled();
      expect(awardBookService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAwardBook>>();
      const awardBook = { id: 123 };
      jest.spyOn(awardBookService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ awardBook });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(awardBookService.update).toHaveBeenCalled();
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

    describe('compareAward', () => {
      it('Should forward to awardService', () => {
        const entity = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const entity2 = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
        jest.spyOn(awardService, 'compareAward');
        comp.compareAward(entity, entity2);
        expect(awardService.compareAward).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
