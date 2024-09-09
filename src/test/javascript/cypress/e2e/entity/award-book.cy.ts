import {
  entityConfirmDeleteButtonSelector,
  entityCreateButtonSelector,
  entityCreateCancelButtonSelector,
  entityCreateSaveButtonSelector,
  entityDeleteButtonSelector,
  entityDetailsBackButtonSelector,
  entityDetailsButtonSelector,
  entityEditButtonSelector,
  entityTableSelector,
} from '../../support/entity';

describe('AwardBook e2e test', () => {
  const awardBookPageUrl = '/award-book';
  const awardBookPageUrlPattern = new RegExp('/award-book(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const awardBookSample = { year: '2024-09-09' };

  let awardBook;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/award-books+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/award-books').as('postEntityRequest');
    cy.intercept('DELETE', '/api/award-books/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (awardBook) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/award-books/${awardBook.id}`,
      }).then(() => {
        awardBook = undefined;
      });
    }
  });

  it('AwardBooks menu should load AwardBooks page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('award-book');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('AwardBook').should('exist');
    cy.url().should('match', awardBookPageUrlPattern);
  });

  describe('AwardBook page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(awardBookPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create AwardBook page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/award-book/new$'));
        cy.getEntityCreateUpdateHeading('AwardBook');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', awardBookPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/award-books',
          body: awardBookSample,
        }).then(({ body }) => {
          awardBook = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/award-books+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [awardBook],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(awardBookPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details AwardBook page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('awardBook');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', awardBookPageUrlPattern);
      });

      it('edit button click should load edit AwardBook page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('AwardBook');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', awardBookPageUrlPattern);
      });

      it('edit button click should load edit AwardBook page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('AwardBook');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', awardBookPageUrlPattern);
      });

      it('last delete button click should delete instance of AwardBook', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('awardBook').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', awardBookPageUrlPattern);

        awardBook = undefined;
      });
    });
  });

  describe('new AwardBook page', () => {
    beforeEach(() => {
      cy.visit(`${awardBookPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('AwardBook');
    });

    it('should create an instance of AwardBook', () => {
      cy.get(`[data-cy="year"]`).type('2024-09-09');
      cy.get(`[data-cy="year"]`).blur();
      cy.get(`[data-cy="year"]`).should('have.value', '2024-09-09');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        awardBook = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', awardBookPageUrlPattern);
    });
  });
});
