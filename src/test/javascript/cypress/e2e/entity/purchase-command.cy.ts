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

describe('PurchaseCommand e2e test', () => {
  const purchaseCommandPageUrl = '/purchase-command';
  const purchaseCommandPageUrlPattern = new RegExp('/purchase-command(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const purchaseCommandSample = { status: 'FAILED_PAYMENT' };

  let purchaseCommand;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/purchase-commands+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/purchase-commands').as('postEntityRequest');
    cy.intercept('DELETE', '/api/purchase-commands/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (purchaseCommand) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/purchase-commands/${purchaseCommand.id}`,
      }).then(() => {
        purchaseCommand = undefined;
      });
    }
  });

  it('PurchaseCommands menu should load PurchaseCommands page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('purchase-command');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('PurchaseCommand').should('exist');
    cy.url().should('match', purchaseCommandPageUrlPattern);
  });

  describe('PurchaseCommand page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(purchaseCommandPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create PurchaseCommand page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/purchase-command/new$'));
        cy.getEntityCreateUpdateHeading('PurchaseCommand');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', purchaseCommandPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/purchase-commands',
          body: purchaseCommandSample,
        }).then(({ body }) => {
          purchaseCommand = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/purchase-commands+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [purchaseCommand],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(purchaseCommandPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details PurchaseCommand page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('purchaseCommand');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', purchaseCommandPageUrlPattern);
      });

      it('edit button click should load edit PurchaseCommand page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('PurchaseCommand');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', purchaseCommandPageUrlPattern);
      });

      it('edit button click should load edit PurchaseCommand page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('PurchaseCommand');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', purchaseCommandPageUrlPattern);
      });

      it('last delete button click should delete instance of PurchaseCommand', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('purchaseCommand').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', purchaseCommandPageUrlPattern);

        purchaseCommand = undefined;
      });
    });
  });

  describe('new PurchaseCommand page', () => {
    beforeEach(() => {
      cy.visit(`${purchaseCommandPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('PurchaseCommand');
    });

    it('should create an instance of PurchaseCommand', () => {
      cy.get(`[data-cy="expeditionDate"]`).type('2024-09-08');
      cy.get(`[data-cy="expeditionDate"]`).blur();
      cy.get(`[data-cy="expeditionDate"]`).should('have.value', '2024-09-08');

      cy.get(`[data-cy="status"]`).select('RETURN_REQUESTED');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        purchaseCommand = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', purchaseCommandPageUrlPattern);
    });
  });
});
