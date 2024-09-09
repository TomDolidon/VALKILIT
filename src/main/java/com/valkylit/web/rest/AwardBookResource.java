package com.valkylit.web.rest;

import com.valkylit.domain.AwardBook;
import com.valkylit.repository.AwardBookRepository;
import com.valkylit.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.valkylit.domain.AwardBook}.
 */
@RestController
@RequestMapping("/api/award-books")
@Transactional
public class AwardBookResource {

    private static final Logger LOG = LoggerFactory.getLogger(AwardBookResource.class);

    private static final String ENTITY_NAME = "awardBook";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AwardBookRepository awardBookRepository;

    public AwardBookResource(AwardBookRepository awardBookRepository) {
        this.awardBookRepository = awardBookRepository;
    }

    /**
     * {@code POST  /award-books} : Create a new awardBook.
     *
     * @param awardBook the awardBook to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new awardBook, or with status {@code 400 (Bad Request)} if the awardBook has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<AwardBook> createAwardBook(@Valid @RequestBody AwardBook awardBook) throws URISyntaxException {
        LOG.debug("REST request to save AwardBook : {}", awardBook);
        if (awardBook.getId() != null) {
            throw new BadRequestAlertException("A new awardBook cannot already have an ID", ENTITY_NAME, "idexists");
        }
        awardBook = awardBookRepository.save(awardBook);
        return ResponseEntity.created(new URI("/api/award-books/" + awardBook.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, awardBook.getId().toString()))
            .body(awardBook);
    }

    /**
     * {@code PUT  /award-books/:id} : Updates an existing awardBook.
     *
     * @param id the id of the awardBook to save.
     * @param awardBook the awardBook to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated awardBook,
     * or with status {@code 400 (Bad Request)} if the awardBook is not valid,
     * or with status {@code 500 (Internal Server Error)} if the awardBook couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<AwardBook> updateAwardBook(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody AwardBook awardBook
    ) throws URISyntaxException {
        LOG.debug("REST request to update AwardBook : {}, {}", id, awardBook);
        if (awardBook.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, awardBook.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!awardBookRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        awardBook = awardBookRepository.save(awardBook);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, awardBook.getId().toString()))
            .body(awardBook);
    }

    /**
     * {@code PATCH  /award-books/:id} : Partial updates given fields of an existing awardBook, field will ignore if it is null
     *
     * @param id the id of the awardBook to save.
     * @param awardBook the awardBook to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated awardBook,
     * or with status {@code 400 (Bad Request)} if the awardBook is not valid,
     * or with status {@code 404 (Not Found)} if the awardBook is not found,
     * or with status {@code 500 (Internal Server Error)} if the awardBook couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<AwardBook> partialUpdateAwardBook(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody AwardBook awardBook
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update AwardBook partially : {}, {}", id, awardBook);
        if (awardBook.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, awardBook.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!awardBookRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<AwardBook> result = awardBookRepository
            .findById(awardBook.getId())
            .map(existingAwardBook -> {
                if (awardBook.getYear() != null) {
                    existingAwardBook.setYear(awardBook.getYear());
                }

                return existingAwardBook;
            })
            .map(awardBookRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, awardBook.getId().toString())
        );
    }

    /**
     * {@code GET  /award-books} : get all the awardBooks.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of awardBooks in body.
     */
    @GetMapping("")
    public List<AwardBook> getAllAwardBooks(@RequestParam(name = "eagerload", required = false, defaultValue = "true") boolean eagerload) {
        LOG.debug("REST request to get all AwardBooks");
        if (eagerload) {
            return awardBookRepository.findAllWithEagerRelationships();
        } else {
            return awardBookRepository.findAll();
        }
    }

    /**
     * {@code GET  /award-books/:id} : get the "id" awardBook.
     *
     * @param id the id of the awardBook to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the awardBook, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<AwardBook> getAwardBook(@PathVariable("id") Long id) {
        LOG.debug("REST request to get AwardBook : {}", id);
        Optional<AwardBook> awardBook = awardBookRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(awardBook);
    }

    /**
     * {@code DELETE  /award-books/:id} : delete the "id" awardBook.
     *
     * @param id the id of the awardBook to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAwardBook(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete AwardBook : {}", id);
        awardBookRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
