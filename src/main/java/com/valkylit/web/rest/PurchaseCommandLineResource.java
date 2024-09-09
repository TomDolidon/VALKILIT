package com.valkylit.web.rest;

import com.valkylit.domain.PurchaseCommandLine;
import com.valkylit.repository.PurchaseCommandLineRepository;
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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.valkylit.domain.PurchaseCommandLine}.
 */
@RestController
@RequestMapping("/api/purchase-command-lines")
@Transactional
public class PurchaseCommandLineResource {

    private static final Logger LOG = LoggerFactory.getLogger(PurchaseCommandLineResource.class);

    private static final String ENTITY_NAME = "purchaseCommandLine";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PurchaseCommandLineRepository purchaseCommandLineRepository;

    public PurchaseCommandLineResource(PurchaseCommandLineRepository purchaseCommandLineRepository) {
        this.purchaseCommandLineRepository = purchaseCommandLineRepository;
    }

    /**
     * {@code POST  /purchase-command-lines} : Create a new purchaseCommandLine.
     *
     * @param purchaseCommandLine the purchaseCommandLine to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new purchaseCommandLine, or with status {@code 400 (Bad Request)} if the purchaseCommandLine has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<PurchaseCommandLine> createPurchaseCommandLine(@Valid @RequestBody PurchaseCommandLine purchaseCommandLine)
        throws URISyntaxException {
        LOG.debug("REST request to save PurchaseCommandLine : {}", purchaseCommandLine);
        if (purchaseCommandLine.getId() != null) {
            throw new BadRequestAlertException("A new purchaseCommandLine cannot already have an ID", ENTITY_NAME, "idexists");
        }
        purchaseCommandLine = purchaseCommandLineRepository.save(purchaseCommandLine);
        return ResponseEntity.created(new URI("/api/purchase-command-lines/" + purchaseCommandLine.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, purchaseCommandLine.getId().toString()))
            .body(purchaseCommandLine);
    }

    /**
     * {@code PUT  /purchase-command-lines/:id} : Updates an existing purchaseCommandLine.
     *
     * @param id the id of the purchaseCommandLine to save.
     * @param purchaseCommandLine the purchaseCommandLine to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated purchaseCommandLine,
     * or with status {@code 400 (Bad Request)} if the purchaseCommandLine is not valid,
     * or with status {@code 500 (Internal Server Error)} if the purchaseCommandLine couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<PurchaseCommandLine> updatePurchaseCommandLine(
        @PathVariable(value = "id", required = false) final UUID id,
        @Valid @RequestBody PurchaseCommandLine purchaseCommandLine
    ) throws URISyntaxException {
        LOG.debug("REST request to update PurchaseCommandLine : {}, {}", id, purchaseCommandLine);
        if (purchaseCommandLine.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, purchaseCommandLine.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!purchaseCommandLineRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        purchaseCommandLine = purchaseCommandLineRepository.save(purchaseCommandLine);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, purchaseCommandLine.getId().toString()))
            .body(purchaseCommandLine);
    }

    /**
     * {@code PATCH  /purchase-command-lines/:id} : Partial updates given fields of an existing purchaseCommandLine, field will ignore if it is null
     *
     * @param id the id of the purchaseCommandLine to save.
     * @param purchaseCommandLine the purchaseCommandLine to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated purchaseCommandLine,
     * or with status {@code 400 (Bad Request)} if the purchaseCommandLine is not valid,
     * or with status {@code 404 (Not Found)} if the purchaseCommandLine is not found,
     * or with status {@code 500 (Internal Server Error)} if the purchaseCommandLine couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<PurchaseCommandLine> partialUpdatePurchaseCommandLine(
        @PathVariable(value = "id", required = false) final UUID id,
        @NotNull @RequestBody PurchaseCommandLine purchaseCommandLine
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update PurchaseCommandLine partially : {}, {}", id, purchaseCommandLine);
        if (purchaseCommandLine.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, purchaseCommandLine.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!purchaseCommandLineRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<PurchaseCommandLine> result = purchaseCommandLineRepository
            .findById(purchaseCommandLine.getId())
            .map(existingPurchaseCommandLine -> {
                if (purchaseCommandLine.getQuantity() != null) {
                    existingPurchaseCommandLine.setQuantity(purchaseCommandLine.getQuantity());
                }
                if (purchaseCommandLine.getUnitPrice() != null) {
                    existingPurchaseCommandLine.setUnitPrice(purchaseCommandLine.getUnitPrice());
                }

                return existingPurchaseCommandLine;
            })
            .map(purchaseCommandLineRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, purchaseCommandLine.getId().toString())
        );
    }

    /**
     * {@code GET  /purchase-command-lines} : get all the purchaseCommandLines.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of purchaseCommandLines in body.
     */
    @GetMapping("")
    public List<PurchaseCommandLine> getAllPurchaseCommandLines(
        @RequestParam(name = "eagerload", required = false, defaultValue = "true") boolean eagerload
    ) {
        LOG.debug("REST request to get all PurchaseCommandLines");
        if (eagerload) {
            return purchaseCommandLineRepository.findAllWithEagerRelationships();
        } else {
            return purchaseCommandLineRepository.findAll();
        }
    }

    /**
     * {@code GET  /purchase-command-lines/:id} : get the "id" purchaseCommandLine.
     *
     * @param id the id of the purchaseCommandLine to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the purchaseCommandLine, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<PurchaseCommandLine> getPurchaseCommandLine(@PathVariable("id") UUID id) {
        LOG.debug("REST request to get PurchaseCommandLine : {}", id);
        Optional<PurchaseCommandLine> purchaseCommandLine = purchaseCommandLineRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(purchaseCommandLine);
    }

    /**
     * {@code DELETE  /purchase-command-lines/:id} : delete the "id" purchaseCommandLine.
     *
     * @param id the id of the purchaseCommandLine to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePurchaseCommandLine(@PathVariable("id") UUID id) {
        LOG.debug("REST request to delete PurchaseCommandLine : {}", id);
        purchaseCommandLineRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
