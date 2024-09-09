package com.valkylit.web.rest;

import static com.valkylit.domain.AwardAsserts.*;
import static com.valkylit.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.valkylit.IntegrationTest;
import com.valkylit.domain.Award;
import com.valkylit.repository.AwardRepository;
import jakarta.persistence.EntityManager;
import java.util.UUID;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link AwardResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AwardResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/awards";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private ObjectMapper om;

    @Autowired
    private AwardRepository awardRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAwardMockMvc;

    private Award award;

    private Award insertedAward;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Award createEntity() {
        return new Award().name(DEFAULT_NAME).description(DEFAULT_DESCRIPTION);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Award createUpdatedEntity() {
        return new Award().name(UPDATED_NAME).description(UPDATED_DESCRIPTION);
    }

    @BeforeEach
    public void initTest() {
        award = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedAward != null) {
            awardRepository.delete(insertedAward);
            insertedAward = null;
        }
    }

    @Test
    @Transactional
    void createAward() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Award
        var returnedAward = om.readValue(
            restAwardMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(award)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Award.class
        );

        // Validate the Award in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertAwardUpdatableFieldsEquals(returnedAward, getPersistedAward(returnedAward));

        insertedAward = returnedAward;
    }

    @Test
    @Transactional
    void createAwardWithExistingId() throws Exception {
        // Create the Award with an existing ID
        insertedAward = awardRepository.saveAndFlush(award);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAwardMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(award)))
            .andExpect(status().isBadRequest());

        // Validate the Award in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        award.setName(null);

        // Create the Award, which fails.

        restAwardMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(award)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllAwards() throws Exception {
        // Initialize the database
        insertedAward = awardRepository.saveAndFlush(award);

        // Get all the awardList
        restAwardMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(award.getId().toString())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())));
    }

    @Test
    @Transactional
    void getAward() throws Exception {
        // Initialize the database
        insertedAward = awardRepository.saveAndFlush(award);

        // Get the award
        restAwardMockMvc
            .perform(get(ENTITY_API_URL_ID, award.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(award.getId().toString()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()));
    }

    @Test
    @Transactional
    void getNonExistingAward() throws Exception {
        // Get the award
        restAwardMockMvc.perform(get(ENTITY_API_URL_ID, UUID.randomUUID().toString())).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingAward() throws Exception {
        // Initialize the database
        insertedAward = awardRepository.saveAndFlush(award);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the award
        Award updatedAward = awardRepository.findById(award.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedAward are not directly saved in db
        em.detach(updatedAward);
        updatedAward.name(UPDATED_NAME).description(UPDATED_DESCRIPTION);

        restAwardMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAward.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedAward))
            )
            .andExpect(status().isOk());

        // Validate the Award in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedAwardToMatchAllProperties(updatedAward);
    }

    @Test
    @Transactional
    void putNonExistingAward() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        award.setId(UUID.randomUUID());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAwardMockMvc
            .perform(put(ENTITY_API_URL_ID, award.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(award)))
            .andExpect(status().isBadRequest());

        // Validate the Award in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAward() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        award.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAwardMockMvc
            .perform(put(ENTITY_API_URL_ID, UUID.randomUUID()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(award)))
            .andExpect(status().isBadRequest());

        // Validate the Award in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAward() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        award.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAwardMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(award)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Award in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAwardWithPatch() throws Exception {
        // Initialize the database
        insertedAward = awardRepository.saveAndFlush(award);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the award using partial update
        Award partialUpdatedAward = new Award();
        partialUpdatedAward.setId(award.getId());

        partialUpdatedAward.name(UPDATED_NAME).description(UPDATED_DESCRIPTION);

        restAwardMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAward.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedAward))
            )
            .andExpect(status().isOk());

        // Validate the Award in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertAwardUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedAward, award), getPersistedAward(award));
    }

    @Test
    @Transactional
    void fullUpdateAwardWithPatch() throws Exception {
        // Initialize the database
        insertedAward = awardRepository.saveAndFlush(award);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the award using partial update
        Award partialUpdatedAward = new Award();
        partialUpdatedAward.setId(award.getId());

        partialUpdatedAward.name(UPDATED_NAME).description(UPDATED_DESCRIPTION);

        restAwardMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAward.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedAward))
            )
            .andExpect(status().isOk());

        // Validate the Award in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertAwardUpdatableFieldsEquals(partialUpdatedAward, getPersistedAward(partialUpdatedAward));
    }

    @Test
    @Transactional
    void patchNonExistingAward() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        award.setId(UUID.randomUUID());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAwardMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, award.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(award))
            )
            .andExpect(status().isBadRequest());

        // Validate the Award in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAward() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        award.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAwardMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(award))
            )
            .andExpect(status().isBadRequest());

        // Validate the Award in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAward() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        award.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAwardMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(award)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Award in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAward() throws Exception {
        // Initialize the database
        insertedAward = awardRepository.saveAndFlush(award);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the award
        restAwardMockMvc
            .perform(delete(ENTITY_API_URL_ID, award.getId().toString()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return awardRepository.count();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected Award getPersistedAward(Award award) {
        return awardRepository.findById(award.getId()).orElseThrow();
    }

    protected void assertPersistedAwardToMatchAllProperties(Award expectedAward) {
        assertAwardAllPropertiesEquals(expectedAward, getPersistedAward(expectedAward));
    }

    protected void assertPersistedAwardToMatchUpdatableProperties(Award expectedAward) {
        assertAwardAllUpdatablePropertiesEquals(expectedAward, getPersistedAward(expectedAward));
    }
}
