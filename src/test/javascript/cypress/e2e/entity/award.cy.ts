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

describe('Award e2e test', () => {
  const awardPageUrl = '/award';
  const awardPageUrlPattern = new RegExp('/award(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const awardSample = { name: 'durant' };

  let award;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/awards+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/awards').as('postEntityRequest');
    cy.intercept('DELETE', '/api/awards/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (award) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/awards/${award.id}`,
      }).then(() => {
        award = undefined;
      });
    }
  });

  it('Awards menu should load Awards page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('award');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Award').should('exist');
    cy.url().should('match', awardPageUrlPattern);
  });

  describe('Award page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(awardPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Award page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/award/new$'));
        cy.getEntityCreateUpdateHeading('Award');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', awardPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/awards',
          body: awardSample,
        }).then(({ body }) => {
          award = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/awards+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [award],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(awardPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Award page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('award');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', awardPageUrlPattern);
      });

      it('edit button click should load edit Award page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Award');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', awardPageUrlPattern);
      });

      it('edit button click should load edit Award page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Award');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', awardPageUrlPattern);
      });

      it('last delete button click should delete instance of Award', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('award').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', awardPageUrlPattern);

        award = undefined;
      });
    });
  });

  describe('new Award page', () => {
    beforeEach(() => {
      cy.visit(`${awardPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Award');
    });

    it('should create an instance of Award', () => {
      cy.get(`[data-cy="name"]`).type('à peu près doucement');
      cy.get(`[data-cy="name"]`).should('have.value', 'à peu près doucement');

      cy.get(`[data-cy="description"]`).type('../fake-data/blob/hipster.txt');
      cy.get(`[data-cy="description"]`).invoke('val').should('match', new RegExp('../fake-data/blob/hipster.txt'));

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        award = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', awardPageUrlPattern);
    });
  });
});
