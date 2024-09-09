package com.valkylit.domain;

import static org.assertj.core.api.Assertions.assertThat;

public class BookAsserts {

    /**
     * Asserts that the entity has all properties (fields/relationships) set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertBookAllPropertiesEquals(Book expected, Book actual) {
        assertBookAutoGeneratedPropertiesEquals(expected, actual);
        assertBookAllUpdatablePropertiesEquals(expected, actual);
    }

    /**
     * Asserts that the entity has all updatable properties (fields/relationships) set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertBookAllUpdatablePropertiesEquals(Book expected, Book actual) {
        assertBookUpdatableFieldsEquals(expected, actual);
        assertBookUpdatableRelationshipsEquals(expected, actual);
    }

    /**
     * Asserts that the entity has all the auto generated properties (fields/relationships) set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertBookAutoGeneratedPropertiesEquals(Book expected, Book actual) {
        assertThat(expected)
            .as("Verify Book auto generated properties")
            .satisfies(e -> assertThat(e.getId()).as("check id").isEqualTo(actual.getId()));
    }

    /**
     * Asserts that the entity has all the updatable fields set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertBookUpdatableFieldsEquals(Book expected, Book actual) {
        assertThat(expected)
            .as("Verify Book relevant properties")
            .satisfies(e -> assertThat(e.getTitle()).as("check title").isEqualTo(actual.getTitle()))
            .satisfies(e -> assertThat(e.getSubtitle()).as("check subtitle").isEqualTo(actual.getSubtitle()))
            .satisfies(e -> assertThat(e.getImageUri()).as("check imageUri").isEqualTo(actual.getImageUri()))
            .satisfies(e -> assertThat(e.getPrice()).as("check price").isEqualTo(actual.getPrice()))
            .satisfies(e -> assertThat(e.getIsbn()).as("check isbn").isEqualTo(actual.getIsbn()))
            .satisfies(e -> assertThat(e.getFormat()).as("check format").isEqualTo(actual.getFormat()))
            .satisfies(e -> assertThat(e.getStock()).as("check stock").isEqualTo(actual.getStock()))
            .satisfies(e -> assertThat(e.getDescription()).as("check description").isEqualTo(actual.getDescription()))
            .satisfies(e -> assertThat(e.getPageCount()).as("check pageCount").isEqualTo(actual.getPageCount()))
            .satisfies(e -> assertThat(e.getLanguage()).as("check language").isEqualTo(actual.getLanguage()))
            .satisfies(e -> assertThat(e.getPublishDate()).as("check publishDate").isEqualTo(actual.getPublishDate()));
    }

    /**
     * Asserts that the entity has all the updatable relationships set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertBookUpdatableRelationshipsEquals(Book expected, Book actual) {
        assertThat(expected)
            .as("Verify Book relationships")
            .satisfies(e -> assertThat(e.getPublisher()).as("check publisher").isEqualTo(actual.getPublisher()))
            .satisfies(e -> assertThat(e.getCategories()).as("check categories").isEqualTo(actual.getCategories()))
            .satisfies(e -> assertThat(e.getAuthors()).as("check authors").isEqualTo(actual.getAuthors()));
    }
}
