import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IBook } from 'app/entities/book/book.model';
import { BookService } from 'app/entities/book/service/book.service';
import { IPurchaseCommand } from 'app/entities/purchase-command/purchase-command.model';
import { PurchaseCommandService } from 'app/entities/purchase-command/service/purchase-command.service';
import { IPurchaseCommandLine } from '../purchase-command-line.model';
import { PurchaseCommandLineService } from '../service/purchase-command-line.service';
import { PurchaseCommandLineFormService } from './purchase-command-line-form.service';

import { PurchaseCommandLineUpdateComponent } from './purchase-command-line-update.component';

describe('PurchaseCommandLine Management Update Component', () => {
  let comp: PurchaseCommandLineUpdateComponent;
  let fixture: ComponentFixture<PurchaseCommandLineUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let purchaseCommandLineFormService: PurchaseCommandLineFormService;
  let purchaseCommandLineService: PurchaseCommandLineService;
  let bookService: BookService;
  let purchaseCommandService: PurchaseCommandService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PurchaseCommandLineUpdateComponent],
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
      .overrideTemplate(PurchaseCommandLineUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PurchaseCommandLineUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    purchaseCommandLineFormService = TestBed.inject(PurchaseCommandLineFormService);
    purchaseCommandLineService = TestBed.inject(PurchaseCommandLineService);
    bookService = TestBed.inject(BookService);
    purchaseCommandService = TestBed.inject(PurchaseCommandService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Book query and add missing value', () => {
      const purchaseCommandLine: IPurchaseCommandLine = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
      const book: IBook = { id: '92884dda-2094-4b0f-918f-d054332e1a38' };
      purchaseCommandLine.book = book;

      const bookCollection: IBook[] = [{ id: 'b635bcb0-0bad-44cf-9acd-29577e040551' }];
      jest.spyOn(bookService, 'query').mockReturnValue(of(new HttpResponse({ body: bookCollection })));
      const additionalBooks = [book];
      const expectedCollection: IBook[] = [...additionalBooks, ...bookCollection];
      jest.spyOn(bookService, 'addBookToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ purchaseCommandLine });
      comp.ngOnInit();

      expect(bookService.query).toHaveBeenCalled();
      expect(bookService.addBookToCollectionIfMissing).toHaveBeenCalledWith(
        bookCollection,
        ...additionalBooks.map(expect.objectContaining),
      );
      expect(comp.booksSharedCollection).toEqual(expectedCollection);
    });

    it('Should call PurchaseCommand query and add missing value', () => {
      const purchaseCommandLine: IPurchaseCommandLine = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
      const purchaseCommand: IPurchaseCommand = { id: '61d070cd-4d02-4cb6-96e2-a2489d513350' };
      purchaseCommandLine.purchaseCommand = purchaseCommand;

      const purchaseCommandCollection: IPurchaseCommand[] = [{ id: '33ed544a-aeed-4268-a2b3-e3124db54bfd' }];
      jest.spyOn(purchaseCommandService, 'query').mockReturnValue(of(new HttpResponse({ body: purchaseCommandCollection })));
      const additionalPurchaseCommands = [purchaseCommand];
      const expectedCollection: IPurchaseCommand[] = [...additionalPurchaseCommands, ...purchaseCommandCollection];
      jest.spyOn(purchaseCommandService, 'addPurchaseCommandToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ purchaseCommandLine });
      comp.ngOnInit();

      expect(purchaseCommandService.query).toHaveBeenCalled();
      expect(purchaseCommandService.addPurchaseCommandToCollectionIfMissing).toHaveBeenCalledWith(
        purchaseCommandCollection,
        ...additionalPurchaseCommands.map(expect.objectContaining),
      );
      expect(comp.purchaseCommandsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const purchaseCommandLine: IPurchaseCommandLine = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
      const book: IBook = { id: 'f35cb61c-8883-4a2c-b95f-a04658976967' };
      purchaseCommandLine.book = book;
      const purchaseCommand: IPurchaseCommand = { id: '365c5d2c-abb0-4476-9a35-81cd1bbb4179' };
      purchaseCommandLine.purchaseCommand = purchaseCommand;

      activatedRoute.data = of({ purchaseCommandLine });
      comp.ngOnInit();

      expect(comp.booksSharedCollection).toContain(book);
      expect(comp.purchaseCommandsSharedCollection).toContain(purchaseCommand);
      expect(comp.purchaseCommandLine).toEqual(purchaseCommandLine);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPurchaseCommandLine>>();
      const purchaseCommandLine = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(purchaseCommandLineFormService, 'getPurchaseCommandLine').mockReturnValue(purchaseCommandLine);
      jest.spyOn(purchaseCommandLineService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ purchaseCommandLine });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: purchaseCommandLine }));
      saveSubject.complete();

      // THEN
      expect(purchaseCommandLineFormService.getPurchaseCommandLine).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(purchaseCommandLineService.update).toHaveBeenCalledWith(expect.objectContaining(purchaseCommandLine));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPurchaseCommandLine>>();
      const purchaseCommandLine = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(purchaseCommandLineFormService, 'getPurchaseCommandLine').mockReturnValue({ id: null });
      jest.spyOn(purchaseCommandLineService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ purchaseCommandLine: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: purchaseCommandLine }));
      saveSubject.complete();

      // THEN
      expect(purchaseCommandLineFormService.getPurchaseCommandLine).toHaveBeenCalled();
      expect(purchaseCommandLineService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPurchaseCommandLine>>();
      const purchaseCommandLine = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(purchaseCommandLineService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ purchaseCommandLine });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(purchaseCommandLineService.update).toHaveBeenCalled();
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

    describe('comparePurchaseCommand', () => {
      it('Should forward to purchaseCommandService', () => {
        const entity = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const entity2 = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
        jest.spyOn(purchaseCommandService, 'comparePurchaseCommand');
        comp.comparePurchaseCommand(entity, entity2);
        expect(purchaseCommandService.comparePurchaseCommand).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
