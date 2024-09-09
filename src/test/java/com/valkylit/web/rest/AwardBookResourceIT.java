package com.valkylit.web.rest;

import static com.valkylit.domain.AwardBookAsserts.*;
import static com.valkylit.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.valkylit.IntegrationTest;
import com.valkylit.domain.AwardBook;
import com.valkylit.repository.AwardBookRepository;
import jakarta.persistence.EntityManager;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
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
 * Integration tests for the {@link AwardBookResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class AwardBookResourceIT {

    private static final LocalDate DEFAULT_YEAR = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_YEAR = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/award-books";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private AwardBookRepository awardBookRepository;

    @Mock
    private AwardBookRepository awardBookRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAwardBookMockMvc;

    private AwardBook awardBook;

    private AwardBook insertedAwardBook;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AwardBook createEntity() {
        return new AwardBook().year(DEFAULT_YEAR);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AwardBook createUpdatedEntity() {
        return new AwardBook().year(UPDATED_YEAR);
    }

    @BeforeEach
    public void initTest() {
        awardBook = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedAwardBook != null) {
            awardBookRepository.delete(insertedAwardBook);
            insertedAwardBook = null;
        }
    }

    @Test
    @Transactional
    void createAwardBook() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the AwardBook
        var returnedAwardBook = om.readValue(
            restAwardBookMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(awardBook)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            AwardBook.class
        );

        // Validate the AwardBook in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertAwardBookUpdatableFieldsEquals(returnedAwardBook, getPersistedAwardBook(returnedAwardBook));

        insertedAwardBook = returnedAwardBook;
    }

    @Test
    @Transactional
    void createAwardBookWithExistingId() throws Exception {
        // Create the AwardBook with an existing ID
        awardBook.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAwardBookMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(awardBook)))
            .andExpect(status().isBadRequest());

        // Validate the AwardBook in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkYearIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        awardBook.setYear(null);

        // Create the AwardBook, which fails.

        restAwardBookMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(awardBook)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllAwardBooks() throws Exception {
        // Initialize the database
        insertedAwardBook = awardBookRepository.saveAndFlush(awardBook);

        // Get all the awardBookList
        restAwardBookMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(awardBook.getId().intValue())))
            .andExpect(jsonPath("$.[*].year").value(hasItem(DEFAULT_YEAR.toString())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllAwardBooksWithEagerRelationshipsIsEnabled() throws Exception {
        when(awardBookRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restAwardBookMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(awardBookRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllAwardBooksWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(awardBookRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restAwardBookMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(awardBookRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getAwardBook() throws Exception {
        // Initialize the database
        insertedAwardBook = awardBookRepository.saveAndFlush(awardBook);

        // Get the awardBook
        restAwardBookMockMvc
            .perform(get(ENTITY_API_URL_ID, awardBook.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(awardBook.getId().intValue()))
            .andExpect(jsonPath("$.year").value(DEFAULT_YEAR.toString()));
    }

    @Test
    @Transactional
    void getNonExistingAwardBook() throws Exception {
        // Get the awardBook
        restAwardBookMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingAwardBook() throws Exception {
        // Initialize the database
        insertedAwardBook = awardBookRepository.saveAndFlush(awardBook);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the awardBook
        AwardBook updatedAwardBook = awardBookRepository.findById(awardBook.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedAwardBook are not directly saved in db
        em.detach(updatedAwardBook);
        updatedAwardBook.year(UPDATED_YEAR);

        restAwardBookMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAwardBook.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedAwardBook))
            )
            .andExpect(status().isOk());

        // Validate the AwardBook in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedAwardBookToMatchAllProperties(updatedAwardBook);
    }

    @Test
    @Transactional
    void putNonExistingAwardBook() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        awardBook.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAwardBookMockMvc
            .perform(
                put(ENTITY_API_URL_ID, awardBook.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(awardBook))
            )
            .andExpect(status().isBadRequest());

        // Validate the AwardBook in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAwardBook() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        awardBook.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAwardBookMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(awardBook))
            )
            .andExpect(status().isBadRequest());

        // Validate the AwardBook in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAwardBook() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        awardBook.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAwardBookMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(awardBook)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the AwardBook in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAwardBookWithPatch() throws Exception {
        // Initialize the database
        insertedAwardBook = awardBookRepository.saveAndFlush(awardBook);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the awardBook using partial update
        AwardBook partialUpdatedAwardBook = new AwardBook();
        partialUpdatedAwardBook.setId(awardBook.getId());

        partialUpdatedAwardBook.year(UPDATED_YEAR);

        restAwardBookMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAwardBook.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedAwardBook))
            )
            .andExpect(status().isOk());

        // Validate the AwardBook in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertAwardBookUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedAwardBook, awardBook),
            getPersistedAwardBook(awardBook)
        );
    }

    @Test
    @Transactional
    void fullUpdateAwardBookWithPatch() throws Exception {
        // Initialize the database
        insertedAwardBook = awardBookRepository.saveAndFlush(awardBook);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the awardBook using partial update
        AwardBook partialUpdatedAwardBook = new AwardBook();
        partialUpdatedAwardBook.setId(awardBook.getId());

        partialUpdatedAwardBook.year(UPDATED_YEAR);

        restAwardBookMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAwardBook.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedAwardBook))
            )
            .andExpect(status().isOk());

        // Validate the AwardBook in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertAwardBookUpdatableFieldsEquals(partialUpdatedAwardBook, getPersistedAwardBook(partialUpdatedAwardBook));
    }

    @Test
    @Transactional
    void patchNonExistingAwardBook() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        awardBook.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAwardBookMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, awardBook.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(awardBook))
            )
            .andExpect(status().isBadRequest());

        // Validate the AwardBook in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAwardBook() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        awardBook.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAwardBookMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(awardBook))
            )
            .andExpect(status().isBadRequest());

        // Validate the AwardBook in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAwardBook() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        awardBook.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAwardBookMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(awardBook)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the AwardBook in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAwardBook() throws Exception {
        // Initialize the database
        insertedAwardBook = awardBookRepository.saveAndFlush(awardBook);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the awardBook
        restAwardBookMockMvc
            .perform(delete(ENTITY_API_URL_ID, awardBook.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return awardBookRepository.count();
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

    protected AwardBook getPersistedAwardBook(AwardBook awardBook) {
        return awardBookRepository.findById(awardBook.getId()).orElseThrow();
    }

    protected void assertPersistedAwardBookToMatchAllProperties(AwardBook expectedAwardBook) {
        assertAwardBookAllPropertiesEquals(expectedAwardBook, getPersistedAwardBook(expectedAwardBook));
    }

    protected void assertPersistedAwardBookToMatchUpdatableProperties(AwardBook expectedAwardBook) {
        assertAwardBookAllUpdatablePropertiesEquals(expectedAwardBook, getPersistedAwardBook(expectedAwardBook));
    }
}
