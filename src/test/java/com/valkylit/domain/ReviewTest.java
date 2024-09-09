package com.valkylit.domain;

import static com.valkylit.domain.BookTestSamples.*;
import static com.valkylit.domain.ClientTestSamples.*;
import static com.valkylit.domain.ReviewTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.valkylit.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ReviewTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Review.class);
        Review review1 = getReviewSample1();
        Review review2 = new Review();
        assertThat(review1).isNotEqualTo(review2);

        review2.setId(review1.getId());
        assertThat(review1).isEqualTo(review2);

        review2 = getReviewSample2();
        assertThat(review1).isNotEqualTo(review2);
    }

    @Test
    void clientTest() {
        Review review = getReviewRandomSampleGenerator();
        Client clientBack = getClientRandomSampleGenerator();

        review.setClient(clientBack);
        assertThat(review.getClient()).isEqualTo(clientBack);

        review.client(null);
        assertThat(review.getClient()).isNull();
    }

    @Test
    void bookTest() {
        Review review = getReviewRandomSampleGenerator();
        Book bookBack = getBookRandomSampleGenerator();

        review.setBook(bookBack);
        assertThat(review.getBook()).isEqualTo(bookBack);

        review.book(null);
        assertThat(review.getBook()).isNull();
    }
}
