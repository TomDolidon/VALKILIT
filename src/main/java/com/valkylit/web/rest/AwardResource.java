package com.valkylit.web.rest;

import com.valkylit.domain.Award;
import com.valkylit.repository.AwardRepository;
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
 * REST controller for managing {@link com.valkylit.domain.Award}.
 */
@RestController
@RequestMapping("/api/awards")
@Transactional
public class AwardResource {

    private static final Logger LOG = LoggerFactory.getLogger(AwardResource.class);

    private static final String ENTITY_NAME = "award";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AwardRepository awardRepository;

    public AwardResource(AwardRepository awardRepository) {
        this.awardRepository = awardRepository;
    }

    /**
     * {@code POST  /awards} : Create a new award.
     *
     * @param award the award to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new award, or with status {@code 400 (Bad Request)} if the award has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Award> createAward(@Valid @RequestBody Award award) throws URISyntaxException {
        LOG.debug("REST request to save Award : {}", award);
        if (award.getId() != null) {
            throw new BadRequestAlertException("A new award cannot already have an ID", ENTITY_NAME, "idexists");
        }
        award = awardRepository.save(award);
        return ResponseEntity.created(new URI("/api/awards/" + award.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, award.getId().toString()))
            .body(award);
    }

    /**
     * {@code PUT  /awards/:id} : Updates an existing award.
     *
     * @param id the id of the award to save.
     * @param award the award to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated award,
     * or with status {@code 400 (Bad Request)} if the award is not valid,
     * or with status {@code 500 (Internal Server Error)} if the award couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Award> updateAward(@PathVariable(value = "id", required = false) final UUID id, @Valid @RequestBody Award award)
        throws URISyntaxException {
        LOG.debug("REST request to update Award : {}, {}", id, award);
        if (award.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, award.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!awardRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        award = awardRepository.save(award);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, award.getId().toString()))
            .body(award);
    }

    /**
     * {@code PATCH  /awards/:id} : Partial updates given fields of an existing award, field will ignore if it is null
     *
     * @param id the id of the award to save.
     * @param award the award to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated award,
     * or with status {@code 400 (Bad Request)} if the award is not valid,
     * or with status {@code 404 (Not Found)} if the award is not found,
     * or with status {@code 500 (Internal Server Error)} if the award couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Award> partialUpdateAward(
        @PathVariable(value = "id", required = false) final UUID id,
        @NotNull @RequestBody Award award
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Award partially : {}, {}", id, award);
        if (award.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, award.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!awardRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Award> result = awardRepository
            .findById(award.getId())
            .map(existingAward -> {
                if (award.getName() != null) {
                    existingAward.setName(award.getName());
                }
                if (award.getDescription() != null) {
                    existingAward.setDescription(award.getDescription());
                }

                return existingAward;
            })
            .map(awardRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, award.getId().toString())
        );
    }

    /**
     * {@code GET  /awards} : get all the awards.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of awards in body.
     */
    @GetMapping("")
    public List<Award> getAllAwards() {
        LOG.debug("REST request to get all Awards");
        return awardRepository.findAll();
    }

    /**
     * {@code GET  /awards/:id} : get the "id" award.
     *
     * @param id the id of the award to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the award, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Award> getAward(@PathVariable("id") UUID id) {
        LOG.debug("REST request to get Award : {}", id);
        Optional<Award> award = awardRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(award);
    }

    /**
     * {@code DELETE  /awards/:id} : delete the "id" award.
     *
     * @param id the id of the award to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAward(@PathVariable("id") UUID id) {
        LOG.debug("REST request to delete Award : {}", id);
        awardRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
