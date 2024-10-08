package com.valkylit.web.rest;

import com.valkylit.domain.Client;
import com.valkylit.domain.PurchaseCommand;
import com.valkylit.domain.PurchaseCommandLine;
import com.valkylit.domain.User;
import com.valkylit.repository.ClientRepository;
import com.valkylit.repository.PurchaseCommandRepository;
import com.valkylit.security.SecurityUtils;
import com.valkylit.service.MailService;
import com.valkylit.service.PurchaseCommandService;
import com.valkylit.service.UserService;
import com.valkylit.service.dto.PurchaseCommandInvalidLineDTO;
import com.valkylit.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.valkylit.domain.PurchaseCommand}.
 */
@RestController
@RequestMapping("/api/purchase-commands")
@Transactional
public class PurchaseCommandResource {

    private static final Logger LOG = LoggerFactory.getLogger(PurchaseCommandResource.class);

    private static final String ENTITY_NAME = "purchaseCommand";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    @Autowired
    private PurchaseCommandRepository purchaseCommandRepository;

    @Autowired
    private PurchaseCommandService purchaseCommandService;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private MailService mailService;

    @Autowired
    private UserService userService;

    /**
     * {@code POST  /purchase-commands} : Create a new purchaseCommand.
     *
     * @param purchaseCommand the purchaseCommand to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new purchaseCommand, or with status {@code 400 (Bad Request)} if the purchaseCommand has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<PurchaseCommand> createPurchaseCommand(@Valid @RequestBody PurchaseCommand purchaseCommand)
        throws URISyntaxException {
        LOG.debug("REST request to save PurchaseCommand : {}", purchaseCommand);
        if (purchaseCommand.getId() != null) {
            throw new BadRequestAlertException("A new purchaseCommand cannot already have an ID", ENTITY_NAME, "idexists");
        }
        purchaseCommand = purchaseCommandRepository.save(purchaseCommand);
        return ResponseEntity.created(new URI("/api/purchase-commands/" + purchaseCommand.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, purchaseCommand.getId().toString()))
            .body(purchaseCommand);
    }

    /**
     * {@code PUT  /purchase-commands/:id} : Updates an existing purchaseCommand.
     *
     * @param id the id of the purchaseCommand to save.
     * @param purchaseCommand the purchaseCommand to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated purchaseCommand,
     * or with status {@code 400 (Bad Request)} if the purchaseCommand is not valid,
     * or with status {@code 500 (Internal Server Error)} if the purchaseCommand couldn't be updated.
     */
    @PutMapping("/{id}")
    public ResponseEntity<PurchaseCommand> updatePurchaseCommand(
        @PathVariable(value = "id", required = false) final UUID id,
        @Valid @RequestBody PurchaseCommand purchaseCommand
    ) {
        LOG.debug("REST request to update PurchaseCommand : {}, {}", id, purchaseCommand);
        if (purchaseCommand.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, purchaseCommand.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!purchaseCommandRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        purchaseCommand = purchaseCommandRepository.save(purchaseCommand);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, purchaseCommand.getId().toString()))
            .body(purchaseCommand);
    }

    /**
     * {@code PATCH  /purchase-commands/:id} : Partial updates given fields of an existing purchaseCommand, field will ignore if it is null
     *
     * @param id the id of the purchaseCommand to save.
     * @param purchaseCommand the purchaseCommand to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated purchaseCommand,
     * or with status {@code 400 (Bad Request)} if the purchaseCommand is not valid,
     * or with status {@code 404 (Not Found)} if the purchaseCommand is not found,
     * or with status {@code 500 (Internal Server Error)} if the purchaseCommand couldn't be updated.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<PurchaseCommand> partialUpdatePurchaseCommand(
        @PathVariable(value = "id", required = false) final UUID id,
        @NotNull @RequestBody PurchaseCommand purchaseCommand
    ) {
        LOG.debug("REST request to partial update PurchaseCommand partially : {}, {}", id, purchaseCommand);
        if (purchaseCommand.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, purchaseCommand.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!purchaseCommandRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<PurchaseCommand> result = purchaseCommandRepository
            .findById(purchaseCommand.getId())
            .map(existingPurchaseCommand -> {
                if (purchaseCommand.getExpeditionDate() != null) {
                    existingPurchaseCommand.setExpeditionDate(purchaseCommand.getExpeditionDate());
                }
                if (purchaseCommand.getStatus() != null) {
                    existingPurchaseCommand.setStatus(purchaseCommand.getStatus());
                }

                return existingPurchaseCommand;
            })
            .map(purchaseCommandRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, purchaseCommand.getId().toString())
        );
    }

    /**
     * {@code GET  /purchase-commands} : get all the purchaseCommands.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of purchaseCommands in body.
     */
    @GetMapping("")
    public List<PurchaseCommand> getAllPurchaseCommands(
        @RequestParam(name = "eagerload", required = false, defaultValue = "true") boolean eagerload
    ) {
        LOG.debug("REST request to get all PurchaseCommands");
        if (eagerload) {
            return purchaseCommandRepository.findAllWithEagerRelationships();
        } else {
            return purchaseCommandRepository.findAll();
        }
    }

    /**
     * {@code GET  /purchase-commands/:id} : get the "id" purchaseCommand.
     *
     * @param id the id of the purchaseCommand to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the purchaseCommand, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<PurchaseCommand> getPurchaseCommand(@PathVariable("id") UUID id) {
        LOG.debug("REST request to get PurchaseCommand : {}", id);
        Optional<PurchaseCommand> purchaseCommand = purchaseCommandRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(purchaseCommand);
    }

    /**
     * {@code GET  /purchase-commands/self} : get the purchase commands of an authenticated user.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the client, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/self")
    public List<PurchaseCommand> getSelfPurchaseCommands(@RequestParam(value = "showLines", defaultValue = "false") boolean showLines) {
        LOG.debug("REST request to get Purchase Commands for authenticated user");

        String userLogin = SecurityUtils.getCurrentUserLogin()
            .orElseThrow(() -> new BadRequestAlertException("Current user login not found", "purchase-commands", "loginnotfound"));

        return (showLines)
            ? purchaseCommandRepository.findAllWithEagerRelationshipsByLogin(userLogin)
            : purchaseCommandRepository.findAllByLogin(userLogin);
    }

    /**
     * {@code GET  /purchase-commands/self-current-draft} : get current purchase command
     * with draft status of an authenticated user.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the client, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/self-current-draft")
    public ResponseEntity<PurchaseCommand> getSelfCurrentPurchaseCommand() {
        LOG.debug("REST request to get the draft purchase command for authenticated user");
        String userLogin = SecurityUtils.getCurrentUserLogin()
            .orElseThrow(() -> new BadRequestAlertException("Current user login not found", "purchase-commands", "loginnotfound"));
        Optional<PurchaseCommand> purchaseCommand = purchaseCommandRepository.findCurrentDraftWithRelationshipsByLogin(userLogin);
        return ResponseUtil.wrapOrNotFound(purchaseCommand);
    }

    /**
     * {@code GET  /purchase-commands/self-current-draft/check-stock} : check current draft purchase command
     * of an authenticated user.
     *
     * @return the {@link List<PurchaseCommandInvalidLineDTO>} with status {@code 200 (OK)} and with body the invalid stocks, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/self-current-draft/check-stock")
    public List<PurchaseCommandInvalidLineDTO> checkSelfCurrentPurchaseCommandStock() throws Exception {
        LOG.debug("REST request to check stock of the draft purchase command for authenticated user");
        return this.purchaseCommandService.getInvalidBooksStockForSelfCurrentDraftPurchaseCommand();
    }

    /**
     * {@code GET  /purchase-commands/self-current-draft/check-stock} : check current draft purchase command
     * of an authenticated user.
     *
     * @return the {@link List<PurchaseCommandInvalidLineDTO>} with status {@code 200 (OK)} and with body the invalid stocks, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/self-current-draft/validate")
    public boolean validateSelfCurrentPurchaseCommandStock() throws Exception {
        LOG.debug("REST request to check stock of the draft purchase command for authenticated user");

        PurchaseCommand purchaseCommand = this.purchaseCommandService.validateSelfCurrentDraftPurchaseCommand();

        User user =
            this.userService.getUserWithAuthorities()
                .orElseThrow(() -> new BadRequestAlertException("Current user login not found", "client", "loginnotfound"));

        this.mailService.sendCommandOrderedMail(user, purchaseCommand);

        return true;
    }

    /**
     * {@code DELETE  /purchase-commands/:id} : delete the "id" purchaseCommand.
     *
     * @param id the id of the purchaseCommand to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePurchaseCommand(@PathVariable("id") UUID id) {
        LOG.debug("REST request to delete PurchaseCommand : {}", id);
        purchaseCommandRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    @PostMapping("/self-current-draft/add-command-line")
    public ResponseEntity<PurchaseCommand> addCommandLineToCart(@Valid @RequestBody PurchaseCommandLine purchaseCommandLine) {
        String userLogin = SecurityUtils.getCurrentUserLogin()
            .orElseThrow(() -> new BadRequestAlertException("Current user login not found", "client", "loginnotfound"));
        Optional<Client> clientOptional = this.clientRepository.findOneWithToOneRelationshipsByUserLogin(userLogin);
        if (!clientOptional.isPresent()) {
            throw new BadRequestAlertException("Client not found", "client", "clientnotfound");
        }
        Client client = clientOptional.get();

        PurchaseCommand purchaseCommand = purchaseCommandService.addItemToCart(purchaseCommandLine, client);
        return ResponseEntity.ok(purchaseCommand);
    }

    /**
     * {@code DELETE  /self-current-draft/remove-command-line/:bookId} : Remove an item from the cart.
     *
     * @param bookId the ID of the book to remove from the cart.
     * @return the {@link ResponseEntity} with status {@code 204 (No Content)}.
     */
    @DeleteMapping("/self-current-draft/remove-command-line/{bookId}")
    public ResponseEntity<PurchaseCommand> removeItemFromCart(@PathVariable UUID bookId) {
        String userLogin = SecurityUtils.getCurrentUserLogin()
            .orElseThrow(() -> new BadRequestAlertException("User login not found", "user", "loginNotFound"));

        Client client = clientRepository
            .findOneWithToOneRelationshipsByUserLogin(userLogin)
            .orElseThrow(() -> new BadRequestAlertException("Client not found", "client", "notFound"));

        PurchaseCommand purchaseCommand = purchaseCommandService.removeItemFromCart(bookId, client);
        return ResponseEntity.ok(purchaseCommand);
    }

    /**
     * {@code DELETE  /self-current-draft/decrement-command-line/:bookId} : Decrease the quantity of an item in the cart.
     *
     * @param bookId the ID of the book to decrement.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated purchaseCommand.
     */
    @DeleteMapping("/self-current-draft/decrement-command-line/{bookId}")
    public ResponseEntity<PurchaseCommand> decrementItemInCart(@PathVariable UUID bookId) {
        String userLogin = SecurityUtils.getCurrentUserLogin()
            .orElseThrow(() -> new BadRequestAlertException("User login not found", "user", "loginNotFound"));

        Client client = clientRepository
            .findOneWithToOneRelationshipsByUserLogin(userLogin)
            .orElseThrow(() -> new BadRequestAlertException("Client not found", "client", "notFound"));

        PurchaseCommand purchaseCommand = purchaseCommandService.decrementItemInCart(bookId, client);
        return ResponseEntity.ok(purchaseCommand);
    }

    @DeleteMapping("/self-current-draft/clear-cart")
    public ResponseEntity<PurchaseCommand> clearCart() {
        String userLogin = SecurityUtils.getCurrentUserLogin()
            .orElseThrow(() -> new BadRequestAlertException("User login not found", "user", "loginNotFound"));

        Client client = clientRepository
            .findOneWithToOneRelationshipsByUserLogin(userLogin)
            .orElseThrow(() -> new BadRequestAlertException("Client not found", "client", "notFound"));

        PurchaseCommand purchaseCommand = purchaseCommandService.clearCart(client);
        return ResponseEntity.ok(purchaseCommand);
    }

    @PutMapping("/self-current-draft/update-command-line")
    public ResponseEntity<PurchaseCommand> updateCart(@Valid @RequestBody List<PurchaseCommandLine> purchaseCommandLines) {
        String userLogin = SecurityUtils.getCurrentUserLogin()
            .orElseThrow(() -> new BadRequestAlertException("User login not found", "user", "loginNotFound"));

        Client client = clientRepository
            .findOneWithToOneRelationshipsByUserLogin(userLogin)
            .orElseThrow(() -> new BadRequestAlertException("Client not found", "client", "notFound"));

        PurchaseCommand purchaseCommand = purchaseCommandService.updateCommandLineInCart(purchaseCommandLines, client);
        return ResponseEntity.ok(purchaseCommand);
    }
}
