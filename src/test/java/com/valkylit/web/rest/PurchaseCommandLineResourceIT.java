package com.valkylit.web.rest;

import static com.valkylit.domain.PurchaseCommandLineAsserts.*;
import static com.valkylit.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.valkylit.IntegrationTest;
import com.valkylit.domain.PurchaseCommandLine;
import com.valkylit.repository.PurchaseCommandLineRepository;
import jakarta.persistence.EntityManager;
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
 * Integration tests for the {@link PurchaseCommandLineResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class PurchaseCommandLineResourceIT {

    private static final Integer DEFAULT_QUANTITY = 1;
    private static final Integer UPDATED_QUANTITY = 2;

    private static final Float DEFAULT_UNIT_PRICE = 1F;
    private static final Float UPDATED_UNIT_PRICE = 2F;

    private static final String ENTITY_API_URL = "/api/purchase-command-lines";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private ObjectMapper om;

    @Autowired
    private PurchaseCommandLineRepository purchaseCommandLineRepository;

    @Mock
    private PurchaseCommandLineRepository purchaseCommandLineRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPurchaseCommandLineMockMvc;

    private PurchaseCommandLine purchaseCommandLine;

    private PurchaseCommandLine insertedPurchaseCommandLine;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PurchaseCommandLine createEntity() {
        return new PurchaseCommandLine().quantity(DEFAULT_QUANTITY).unitPrice(DEFAULT_UNIT_PRICE);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PurchaseCommandLine createUpdatedEntity() {
        return new PurchaseCommandLine().quantity(UPDATED_QUANTITY).unitPrice(UPDATED_UNIT_PRICE);
    }

    @BeforeEach
    public void initTest() {
        purchaseCommandLine = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedPurchaseCommandLine != null) {
            purchaseCommandLineRepository.delete(insertedPurchaseCommandLine);
            insertedPurchaseCommandLine = null;
        }
    }

    @Test
    @Transactional
    void createPurchaseCommandLine() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the PurchaseCommandLine
        var returnedPurchaseCommandLine = om.readValue(
            restPurchaseCommandLineMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(purchaseCommandLine)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            PurchaseCommandLine.class
        );

        // Validate the PurchaseCommandLine in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertPurchaseCommandLineUpdatableFieldsEquals(
            returnedPurchaseCommandLine,
            getPersistedPurchaseCommandLine(returnedPurchaseCommandLine)
        );

        insertedPurchaseCommandLine = returnedPurchaseCommandLine;
    }

    @Test
    @Transactional
    void createPurchaseCommandLineWithExistingId() throws Exception {
        // Create the PurchaseCommandLine with an existing ID
        insertedPurchaseCommandLine = purchaseCommandLineRepository.saveAndFlush(purchaseCommandLine);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPurchaseCommandLineMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(purchaseCommandLine)))
            .andExpect(status().isBadRequest());

        // Validate the PurchaseCommandLine in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkQuantityIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        purchaseCommandLine.setQuantity(null);

        // Create the PurchaseCommandLine, which fails.

        restPurchaseCommandLineMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(purchaseCommandLine)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkUnitPriceIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        purchaseCommandLine.setUnitPrice(null);

        // Create the PurchaseCommandLine, which fails.

        restPurchaseCommandLineMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(purchaseCommandLine)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllPurchaseCommandLines() throws Exception {
        // Initialize the database
        insertedPurchaseCommandLine = purchaseCommandLineRepository.saveAndFlush(purchaseCommandLine);

        // Get all the purchaseCommandLineList
        restPurchaseCommandLineMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(purchaseCommandLine.getId().toString())))
            .andExpect(jsonPath("$.[*].quantity").value(hasItem(DEFAULT_QUANTITY)))
            .andExpect(jsonPath("$.[*].unitPrice").value(hasItem(DEFAULT_UNIT_PRICE.doubleValue())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllPurchaseCommandLinesWithEagerRelationshipsIsEnabled() throws Exception {
        when(purchaseCommandLineRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restPurchaseCommandLineMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(purchaseCommandLineRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllPurchaseCommandLinesWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(purchaseCommandLineRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restPurchaseCommandLineMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(purchaseCommandLineRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getPurchaseCommandLine() throws Exception {
        // Initialize the database
        insertedPurchaseCommandLine = purchaseCommandLineRepository.saveAndFlush(purchaseCommandLine);

        // Get the purchaseCommandLine
        restPurchaseCommandLineMockMvc
            .perform(get(ENTITY_API_URL_ID, purchaseCommandLine.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(purchaseCommandLine.getId().toString()))
            .andExpect(jsonPath("$.quantity").value(DEFAULT_QUANTITY))
            .andExpect(jsonPath("$.unitPrice").value(DEFAULT_UNIT_PRICE.doubleValue()));
    }

    @Test
    @Transactional
    void getNonExistingPurchaseCommandLine() throws Exception {
        // Get the purchaseCommandLine
        restPurchaseCommandLineMockMvc.perform(get(ENTITY_API_URL_ID, UUID.randomUUID().toString())).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingPurchaseCommandLine() throws Exception {
        // Initialize the database
        insertedPurchaseCommandLine = purchaseCommandLineRepository.saveAndFlush(purchaseCommandLine);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the purchaseCommandLine
        PurchaseCommandLine updatedPurchaseCommandLine = purchaseCommandLineRepository.findById(purchaseCommandLine.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedPurchaseCommandLine are not directly saved in db
        em.detach(updatedPurchaseCommandLine);
        updatedPurchaseCommandLine.quantity(UPDATED_QUANTITY).unitPrice(UPDATED_UNIT_PRICE);

        restPurchaseCommandLineMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPurchaseCommandLine.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedPurchaseCommandLine))
            )
            .andExpect(status().isOk());

        // Validate the PurchaseCommandLine in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedPurchaseCommandLineToMatchAllProperties(updatedPurchaseCommandLine);
    }

    @Test
    @Transactional
    void putNonExistingPurchaseCommandLine() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        purchaseCommandLine.setId(UUID.randomUUID());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPurchaseCommandLineMockMvc
            .perform(
                put(ENTITY_API_URL_ID, purchaseCommandLine.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(purchaseCommandLine))
            )
            .andExpect(status().isBadRequest());

        // Validate the PurchaseCommandLine in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPurchaseCommandLine() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        purchaseCommandLine.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPurchaseCommandLineMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(purchaseCommandLine))
            )
            .andExpect(status().isBadRequest());

        // Validate the PurchaseCommandLine in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPurchaseCommandLine() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        purchaseCommandLine.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPurchaseCommandLineMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(purchaseCommandLine)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the PurchaseCommandLine in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePurchaseCommandLineWithPatch() throws Exception {
        // Initialize the database
        insertedPurchaseCommandLine = purchaseCommandLineRepository.saveAndFlush(purchaseCommandLine);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the purchaseCommandLine using partial update
        PurchaseCommandLine partialUpdatedPurchaseCommandLine = new PurchaseCommandLine();
        partialUpdatedPurchaseCommandLine.setId(purchaseCommandLine.getId());

        partialUpdatedPurchaseCommandLine.unitPrice(UPDATED_UNIT_PRICE);

        restPurchaseCommandLineMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPurchaseCommandLine.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedPurchaseCommandLine))
            )
            .andExpect(status().isOk());

        // Validate the PurchaseCommandLine in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPurchaseCommandLineUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedPurchaseCommandLine, purchaseCommandLine),
            getPersistedPurchaseCommandLine(purchaseCommandLine)
        );
    }

    @Test
    @Transactional
    void fullUpdatePurchaseCommandLineWithPatch() throws Exception {
        // Initialize the database
        insertedPurchaseCommandLine = purchaseCommandLineRepository.saveAndFlush(purchaseCommandLine);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the purchaseCommandLine using partial update
        PurchaseCommandLine partialUpdatedPurchaseCommandLine = new PurchaseCommandLine();
        partialUpdatedPurchaseCommandLine.setId(purchaseCommandLine.getId());

        partialUpdatedPurchaseCommandLine.quantity(UPDATED_QUANTITY).unitPrice(UPDATED_UNIT_PRICE);

        restPurchaseCommandLineMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPurchaseCommandLine.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedPurchaseCommandLine))
            )
            .andExpect(status().isOk());

        // Validate the PurchaseCommandLine in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPurchaseCommandLineUpdatableFieldsEquals(
            partialUpdatedPurchaseCommandLine,
            getPersistedPurchaseCommandLine(partialUpdatedPurchaseCommandLine)
        );
    }

    @Test
    @Transactional
    void patchNonExistingPurchaseCommandLine() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        purchaseCommandLine.setId(UUID.randomUUID());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPurchaseCommandLineMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, purchaseCommandLine.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(purchaseCommandLine))
            )
            .andExpect(status().isBadRequest());

        // Validate the PurchaseCommandLine in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPurchaseCommandLine() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        purchaseCommandLine.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPurchaseCommandLineMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(purchaseCommandLine))
            )
            .andExpect(status().isBadRequest());

        // Validate the PurchaseCommandLine in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPurchaseCommandLine() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        purchaseCommandLine.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPurchaseCommandLineMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(purchaseCommandLine)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the PurchaseCommandLine in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePurchaseCommandLine() throws Exception {
        // Initialize the database
        insertedPurchaseCommandLine = purchaseCommandLineRepository.saveAndFlush(purchaseCommandLine);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the purchaseCommandLine
        restPurchaseCommandLineMockMvc
            .perform(delete(ENTITY_API_URL_ID, purchaseCommandLine.getId().toString()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return purchaseCommandLineRepository.count();
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

    protected PurchaseCommandLine getPersistedPurchaseCommandLine(PurchaseCommandLine purchaseCommandLine) {
        return purchaseCommandLineRepository.findById(purchaseCommandLine.getId()).orElseThrow();
    }

    protected void assertPersistedPurchaseCommandLineToMatchAllProperties(PurchaseCommandLine expectedPurchaseCommandLine) {
        assertPurchaseCommandLineAllPropertiesEquals(
            expectedPurchaseCommandLine,
            getPersistedPurchaseCommandLine(expectedPurchaseCommandLine)
        );
    }

    protected void assertPersistedPurchaseCommandLineToMatchUpdatableProperties(PurchaseCommandLine expectedPurchaseCommandLine) {
        assertPurchaseCommandLineAllUpdatablePropertiesEquals(
            expectedPurchaseCommandLine,
            getPersistedPurchaseCommandLine(expectedPurchaseCommandLine)
        );
    }
}
