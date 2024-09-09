package com.valkylit.domain;

import static com.valkylit.domain.BookCategoryTestSamples.*;
import static com.valkylit.domain.BookTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.valkylit.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class BookCategoryTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(BookCategory.class);
        BookCategory bookCategory1 = getBookCategorySample1();
        BookCategory bookCategory2 = new BookCategory();
        assertThat(bookCategory1).isNotEqualTo(bookCategory2);

        bookCategory2.setId(bookCategory1.getId());
        assertThat(bookCategory1).isEqualTo(bookCategory2);

        bookCategory2 = getBookCategorySample2();
        assertThat(bookCategory1).isNotEqualTo(bookCategory2);
    }

    @Test
    void bookTest() {
        BookCategory bookCategory = getBookCategoryRandomSampleGenerator();
        Book bookBack = getBookRandomSampleGenerator();

        bookCategory.addBook(bookBack);
        assertThat(bookCategory.getBooks()).containsOnly(bookBack);
        assertThat(bookBack.getCategories()).containsOnly(bookCategory);

        bookCategory.removeBook(bookBack);
        assertThat(bookCategory.getBooks()).doesNotContain(bookBack);
        assertThat(bookBack.getCategories()).doesNotContain(bookCategory);

        bookCategory.books(new HashSet<>(Set.of(bookBack)));
        assertThat(bookCategory.getBooks()).containsOnly(bookBack);
        assertThat(bookBack.getCategories()).containsOnly(bookCategory);

        bookCategory.setBooks(new HashSet<>());
        assertThat(bookCategory.getBooks()).doesNotContain(bookBack);
        assertThat(bookBack.getCategories()).doesNotContain(bookCategory);
    }
}
