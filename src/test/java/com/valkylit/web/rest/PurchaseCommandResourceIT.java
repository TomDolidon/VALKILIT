package com.valkylit.web.rest;

import static com.valkylit.domain.PurchaseCommandAsserts.*;
import static com.valkylit.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.valkylit.IntegrationTest;
import com.valkylit.domain.PurchaseCommand;
import com.valkylit.domain.enumeration.PurchaseCommandStatus;
import com.valkylit.repository.PurchaseCommandRepository;
import jakarta.persistence.EntityManager;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.UUID;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link PurchaseCommandResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class PurchaseCommandResourceIT {

    private static final LocalDate DEFAULT_EXPEDITION_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_EXPEDITION_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final PurchaseCommandStatus DEFAULT_STATUS = PurchaseCommandStatus.DRAFT;
    private static final PurchaseCommandStatus UPDATED_STATUS = PurchaseCommandStatus.ORDERED;

    private static final String ENTITY_API_URL = "/api/purchase-commands";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private ObjectMapper om;

    @Autowired
    private PurchaseCommandRepository purchaseCommandRepository;

    @Mock
    private PurchaseCommandRepository purchaseCommandRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPurchaseCommandMockMvc;

    private PurchaseCommand purchaseCommand;

    private PurchaseCommand insertedPurchaseCommand;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PurchaseCommand createEntity() {
        return new PurchaseCommand().expeditionDate(DEFAULT_EXPEDITION_DATE).status(DEFAULT_STATUS);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PurchaseCommand createUpdatedEntity() {
        return new PurchaseCommand().expeditionDate(UPDATED_EXPEDITION_DATE).status(UPDATED_STATUS);
    }

    @BeforeEach
    public void initTest() {
        purchaseCommand = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedPurchaseCommand != null) {
            purchaseCommandRepository.delete(insertedPurchaseCommand);
            insertedPurchaseCommand = null;
        }
    }

    @Test
    @Transactional
    void createPurchaseCommand() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the PurchaseCommand
        var returnedPurchaseCommand = om.readValue(
            restPurchaseCommandMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(purchaseCommand)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            PurchaseCommand.class
        );

        // Validate the PurchaseCommand in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertPurchaseCommandUpdatableFieldsEquals(returnedPurchaseCommand, getPersistedPurchaseCommand(returnedPurchaseCommand));

        insertedPurchaseCommand = returnedPurchaseCommand;
    }

    @Test
    @Transactional
    void createPurchaseCommandWithExistingId() throws Exception {
        // Create the PurchaseCommand with an existing ID
        insertedPurchaseCommand = purchaseCommandRepository.saveAndFlush(purchaseCommand);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPurchaseCommandMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(purchaseCommand)))
            .andExpect(status().isBadRequest());

        // Validate the PurchaseCommand in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkStatusIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        purchaseCommand.setStatus(null);

        // Create the PurchaseCommand, which fails.

        restPurchaseCommandMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(purchaseCommand)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllPurchaseCommands() throws Exception {
        // Initialize the database
        insertedPurchaseCommand = purchaseCommandRepository.saveAndFlush(purchaseCommand);

        // Get all the purchaseCommandList
        restPurchaseCommandMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(purchaseCommand.getId().toString())))
            .andExpect(jsonPath("$.[*].expeditionDate").value(hasItem(DEFAULT_EXPEDITION_DATE.toString())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllPurchaseCommandsWithEagerRelationshipsIsEnabled() throws Exception {
        when(purchaseCommandRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restPurchaseCommandMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(purchaseCommandRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllPurchaseCommandsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(purchaseCommandRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restPurchaseCommandMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(purchaseCommandRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getPurchaseCommand() throws Exception {
        // Initialize the database
        insertedPurchaseCommand = purchaseCommandRepository.saveAndFlush(purchaseCommand);

        // Get the purchaseCommand
        restPurchaseCommandMockMvc
            .perform(get(ENTITY_API_URL_ID, purchaseCommand.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(purchaseCommand.getId().toString()))
            .andExpect(jsonPath("$.expeditionDate").value(DEFAULT_EXPEDITION_DATE.toString()))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()));
    }

    @Test
    @Transactional
    void getNonExistingPurchaseCommand() throws Exception {
        // Get the purchaseCommand
        restPurchaseCommandMockMvc.perform(get(ENTITY_API_URL_ID, UUID.randomUUID().toString())).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingPurchaseCommand() throws Exception {
        // Initialize the database
        insertedPurchaseCommand = purchaseCommandRepository.saveAndFlush(purchaseCommand);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the purchaseCommand
        PurchaseCommand updatedPurchaseCommand = purchaseCommandRepository.findById(purchaseCommand.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedPurchaseCommand are not directly saved in db
        em.detach(updatedPurchaseCommand);
        updatedPurchaseCommand.expeditionDate(UPDATED_EXPEDITION_DATE).status(UPDATED_STATUS);

        restPurchaseCommandMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPurchaseCommand.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedPurchaseCommand))
            )
            .andExpect(status().isOk());

        // Validate the PurchaseCommand in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedPurchaseCommandToMatchAllProperties(updatedPurchaseCommand);
    }

    @Test
    @Transactional
    void putNonExistingPurchaseCommand() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        purchaseCommand.setId(UUID.randomUUID());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPurchaseCommandMockMvc
            .perform(
                put(ENTITY_API_URL_ID, purchaseCommand.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(purchaseCommand))
            )
            .andExpect(status().isBadRequest());

        // Validate the PurchaseCommand in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPurchaseCommand() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        purchaseCommand.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPurchaseCommandMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(purchaseCommand))
            )
            .andExpect(status().isBadRequest());

        // Validate the PurchaseCommand in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPurchaseCommand() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        purchaseCommand.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPurchaseCommandMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(purchaseCommand)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the PurchaseCommand in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePurchaseCommandWithPatch() throws Exception {
        // Initialize the database
        insertedPurchaseCommand = purchaseCommandRepository.saveAndFlush(purchaseCommand);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the purchaseCommand using partial update
        PurchaseCommand partialUpdatedPurchaseCommand = new PurchaseCommand();
        partialUpdatedPurchaseCommand.setId(purchaseCommand.getId());

        partialUpdatedPurchaseCommand.expeditionDate(UPDATED_EXPEDITION_DATE).status(UPDATED_STATUS);

        restPurchaseCommandMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPurchaseCommand.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedPurchaseCommand))
            )
            .andExpect(status().isOk());

        // Validate the PurchaseCommand in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPurchaseCommandUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedPurchaseCommand, purchaseCommand),
            getPersistedPurchaseCommand(purchaseCommand)
        );
    }

    @Test
    @Transactional
    void fullUpdatePurchaseCommandWithPatch() throws Exception {
        // Initialize the database
        insertedPurchaseCommand = purchaseCommandRepository.saveAndFlush(purchaseCommand);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the purchaseCommand using partial update
        PurchaseCommand partialUpdatedPurchaseCommand = new PurchaseCommand();
        partialUpdatedPurchaseCommand.setId(purchaseCommand.getId());

        partialUpdatedPurchaseCommand.expeditionDate(UPDATED_EXPEDITION_DATE).status(UPDATED_STATUS);

        restPurchaseCommandMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPurchaseCommand.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedPurchaseCommand))
            )
            .andExpect(status().isOk());

        // Validate the PurchaseCommand in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPurchaseCommandUpdatableFieldsEquals(
            partialUpdatedPurchaseCommand,
            getPersistedPurchaseCommand(partialUpdatedPurchaseCommand)
        );
    }

    @Test
    @Transactional
    void patchNonExistingPurchaseCommand() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        purchaseCommand.setId(UUID.randomUUID());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPurchaseCommandMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, purchaseCommand.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(purchaseCommand))
            )
            .andExpect(status().isBadRequest());

        // Validate the PurchaseCommand in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPurchaseCommand() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        purchaseCommand.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPurchaseCommandMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(purchaseCommand))
            )
            .andExpect(status().isBadRequest());

        // Validate the PurchaseCommand in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPurchaseCommand() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        purchaseCommand.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPurchaseCommandMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(purchaseCommand)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the PurchaseCommand in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePurchaseCommand() throws Exception {
        // Initialize the database
        insertedPurchaseCommand = purchaseCommandRepository.saveAndFlush(purchaseCommand);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the purchaseCommand
        restPurchaseCommandMockMvc
            .perform(delete(ENTITY_API_URL_ID, purchaseCommand.getId().toString()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return purchaseCommandRepository.count();
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

    protected PurchaseCommand getPersistedPurchaseCommand(PurchaseCommand purchaseCommand) {
        return purchaseCommandRepository.findById(purchaseCommand.getId()).orElseThrow();
    }

    protected void assertPersistedPurchaseCommandToMatchAllProperties(PurchaseCommand expectedPurchaseCommand) {
        assertPurchaseCommandAllPropertiesEquals(expectedPurchaseCommand, getPersistedPurchaseCommand(expectedPurchaseCommand));
    }

    protected void assertPersistedPurchaseCommandToMatchUpdatableProperties(PurchaseCommand expectedPurchaseCommand) {
        assertPurchaseCommandAllUpdatablePropertiesEquals(expectedPurchaseCommand, getPersistedPurchaseCommand(expectedPurchaseCommand));
    }
}
