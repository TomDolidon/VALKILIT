package com.valkylit.domain;

import static com.valkylit.domain.AwardBookTestSamples.*;
import static com.valkylit.domain.AwardTestSamples.*;
import static com.valkylit.domain.BookTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.valkylit.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AwardBookTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(AwardBook.class);
        AwardBook awardBook1 = getAwardBookSample1();
        AwardBook awardBook2 = new AwardBook();
        assertThat(awardBook1).isNotEqualTo(awardBook2);

        awardBook2.setId(awardBook1.getId());
        assertThat(awardBook1).isEqualTo(awardBook2);

        awardBook2 = getAwardBookSample2();
        assertThat(awardBook1).isNotEqualTo(awardBook2);
    }

    @Test
    void bookTest() {
        AwardBook awardBook = getAwardBookRandomSampleGenerator();
        Book bookBack = getBookRandomSampleGenerator();

        awardBook.setBook(bookBack);
        assertThat(awardBook.getBook()).isEqualTo(bookBack);

        awardBook.book(null);
        assertThat(awardBook.getBook()).isNull();
    }

    @Test
    void awardTest() {
        AwardBook awardBook = getAwardBookRandomSampleGenerator();
        Award awardBack = getAwardRandomSampleGenerator();

        awardBook.setAward(awardBack);
        assertThat(awardBook.getAward()).isEqualTo(awardBack);

        awardBook.award(null);
        assertThat(awardBook.getAward()).isNull();
    }
}
