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

describe('PurchaseCommandLine e2e test', () => {
  const purchaseCommandLinePageUrl = '/purchase-command-line';
  const purchaseCommandLinePageUrlPattern = new RegExp('/purchase-command-line(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const purchaseCommandLineSample = { quantity: 5808, unitPrice: 27976.7 };

  let purchaseCommandLine;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/purchase-command-lines+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/purchase-command-lines').as('postEntityRequest');
    cy.intercept('DELETE', '/api/purchase-command-lines/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (purchaseCommandLine) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/purchase-command-lines/${purchaseCommandLine.id}`,
      }).then(() => {
        purchaseCommandLine = undefined;
      });
    }
  });

  it('PurchaseCommandLines menu should load PurchaseCommandLines page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('purchase-command-line');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('PurchaseCommandLine').should('exist');
    cy.url().should('match', purchaseCommandLinePageUrlPattern);
  });

  describe('PurchaseCommandLine page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(purchaseCommandLinePageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create PurchaseCommandLine page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/purchase-command-line/new$'));
        cy.getEntityCreateUpdateHeading('PurchaseCommandLine');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', purchaseCommandLinePageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/purchase-command-lines',
          body: purchaseCommandLineSample,
        }).then(({ body }) => {
          purchaseCommandLine = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/purchase-command-lines+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [purchaseCommandLine],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(purchaseCommandLinePageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details PurchaseCommandLine page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('purchaseCommandLine');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', purchaseCommandLinePageUrlPattern);
      });

      it('edit button click should load edit PurchaseCommandLine page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('PurchaseCommandLine');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', purchaseCommandLinePageUrlPattern);
      });

      it('edit button click should load edit PurchaseCommandLine page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('PurchaseCommandLine');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', purchaseCommandLinePageUrlPattern);
      });

      it('last delete button click should delete instance of PurchaseCommandLine', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('purchaseCommandLine').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', purchaseCommandLinePageUrlPattern);

        purchaseCommandLine = undefined;
      });
    });
  });

  describe('new PurchaseCommandLine page', () => {
    beforeEach(() => {
      cy.visit(`${purchaseCommandLinePageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('PurchaseCommandLine');
    });

    it('should create an instance of PurchaseCommandLine', () => {
      cy.get(`[data-cy="quantity"]`).type('20667');
      cy.get(`[data-cy="quantity"]`).should('have.value', '20667');

      cy.get(`[data-cy="unitPrice"]`).type('22123.19');
      cy.get(`[data-cy="unitPrice"]`).should('have.value', '22123.19');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        purchaseCommandLine = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', purchaseCommandLinePageUrlPattern);
    });
  });
});
