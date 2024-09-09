package com.valkylit.domain;

import static com.valkylit.domain.AuthorTestSamples.*;
import static com.valkylit.domain.AwardBookTestSamples.*;
import static com.valkylit.domain.BookCategoryTestSamples.*;
import static com.valkylit.domain.BookTestSamples.*;
import static com.valkylit.domain.PublisherTestSamples.*;
import static com.valkylit.domain.ReviewTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.valkylit.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class BookTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Book.class);
        Book book1 = getBookSample1();
        Book book2 = new Book();
        assertThat(book1).isNotEqualTo(book2);

        book2.setId(book1.getId());
        assertThat(book1).isEqualTo(book2);

        book2 = getBookSample2();
        assertThat(book1).isNotEqualTo(book2);
    }

    @Test
    void awardBookTest() {
        Book book = getBookRandomSampleGenerator();
        AwardBook awardBookBack = getAwardBookRandomSampleGenerator();

        book.addAwardBook(awardBookBack);
        assertThat(book.getAwardBooks()).containsOnly(awardBookBack);
        assertThat(awardBookBack.getBook()).isEqualTo(book);

        book.removeAwardBook(awardBookBack);
        assertThat(book.getAwardBooks()).doesNotContain(awardBookBack);
        assertThat(awardBookBack.getBook()).isNull();

        book.awardBooks(new HashSet<>(Set.of(awardBookBack)));
        assertThat(book.getAwardBooks()).containsOnly(awardBookBack);
        assertThat(awardBookBack.getBook()).isEqualTo(book);

        book.setAwardBooks(new HashSet<>());
        assertThat(book.getAwardBooks()).doesNotContain(awardBookBack);
        assertThat(awardBookBack.getBook()).isNull();
    }

    @Test
    void reviewsTest() {
        Book book = getBookRandomSampleGenerator();
        Review reviewBack = getReviewRandomSampleGenerator();

        book.addReviews(reviewBack);
        assertThat(book.getReviews()).containsOnly(reviewBack);
        assertThat(reviewBack.getBook()).isEqualTo(book);

        book.removeReviews(reviewBack);
        assertThat(book.getReviews()).doesNotContain(reviewBack);
        assertThat(reviewBack.getBook()).isNull();

        book.reviews(new HashSet<>(Set.of(reviewBack)));
        assertThat(book.getReviews()).containsOnly(reviewBack);
        assertThat(reviewBack.getBook()).isEqualTo(book);

        book.setReviews(new HashSet<>());
        assertThat(book.getReviews()).doesNotContain(reviewBack);
        assertThat(reviewBack.getBook()).isNull();
    }

    @Test
    void publisherTest() {
        Book book = getBookRandomSampleGenerator();
        Publisher publisherBack = getPublisherRandomSampleGenerator();

        book.setPublisher(publisherBack);
        assertThat(book.getPublisher()).isEqualTo(publisherBack);

        book.publisher(null);
        assertThat(book.getPublisher()).isNull();
    }

    @Test
    void categoryTest() {
        Book book = getBookRandomSampleGenerator();
        BookCategory bookCategoryBack = getBookCategoryRandomSampleGenerator();

        book.addCategory(bookCategoryBack);
        assertThat(book.getCategories()).containsOnly(bookCategoryBack);

        book.removeCategory(bookCategoryBack);
        assertThat(book.getCategories()).doesNotContain(bookCategoryBack);

        book.categories(new HashSet<>(Set.of(bookCategoryBack)));
        assertThat(book.getCategories()).containsOnly(bookCategoryBack);

        book.setCategories(new HashSet<>());
        assertThat(book.getCategories()).doesNotContain(bookCategoryBack);
    }

    @Test
    void authorTest() {
        Book book = getBookRandomSampleGenerator();
        Author authorBack = getAuthorRandomSampleGenerator();

        book.addAuthor(authorBack);
        assertThat(book.getAuthors()).containsOnly(authorBack);

        book.removeAuthor(authorBack);
        assertThat(book.getAuthors()).doesNotContain(authorBack);

        book.authors(new HashSet<>(Set.of(authorBack)));
        assertThat(book.getAuthors()).containsOnly(authorBack);

        book.setAuthors(new HashSet<>());
        assertThat(book.getAuthors()).doesNotContain(authorBack);
    }
}
