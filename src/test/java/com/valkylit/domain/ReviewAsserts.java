package com.valkylit.domain;

import static org.assertj.core.api.Assertions.assertThat;

public class ReviewAsserts {

    /**
     * Asserts that the entity has all properties (fields/relationships) set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertReviewAllPropertiesEquals(Review expected, Review actual) {
        assertReviewAutoGeneratedPropertiesEquals(expected, actual);
        assertReviewAllUpdatablePropertiesEquals(expected, actual);
    }

    /**
     * Asserts that the entity has all updatable properties (fields/relationships) set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertReviewAllUpdatablePropertiesEquals(Review expected, Review actual) {
        assertReviewUpdatableFieldsEquals(expected, actual);
        assertReviewUpdatableRelationshipsEquals(expected, actual);
    }

    /**
     * Asserts that the entity has all the auto generated properties (fields/relationships) set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertReviewAutoGeneratedPropertiesEquals(Review expected, Review actual) {
        assertThat(expected)
            .as("Verify Review auto generated properties")
            .satisfies(e -> assertThat(e.getId()).as("check id").isEqualTo(actual.getId()));
    }

    /**
     * Asserts that the entity has all the updatable fields set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertReviewUpdatableFieldsEquals(Review expected, Review actual) {
        assertThat(expected)
            .as("Verify Review relevant properties")
            .satisfies(e -> assertThat(e.getRating()).as("check rating").isEqualTo(actual.getRating()))
            .satisfies(e -> assertThat(e.getComment()).as("check comment").isEqualTo(actual.getComment()));
    }

    /**
     * Asserts that the entity has all the updatable relationships set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertReviewUpdatableRelationshipsEquals(Review expected, Review actual) {
        assertThat(expected)
            .as("Verify Review relationships")
            .satisfies(e -> assertThat(e.getClient()).as("check client").isEqualTo(actual.getClient()))
            .satisfies(e -> assertThat(e.getBook()).as("check book").isEqualTo(actual.getBook()));
    }
}
